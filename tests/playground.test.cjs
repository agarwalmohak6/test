'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const http=require('node:http');
const lab=require('../server/playground.cjs');
const {handler}=require('../server/index.cjs');
const defaults={prompt:'Explain request and response handling.',system:'Be clear.',max_tokens:256,model:'mock-balanced'};

test('18 varied scenario fixtures are available and no actual model or Anthropic tokens are used',()=>{
 assert.equal(lab.SCENARIOS.length,18);
 assert.equal(new Set(lab.SCENARIOS.map(x=>x.id)).size,18);
 for(const s of lab.SCENARIOS){
  if(['rate_limit','overload','context','validation'].includes(s.id))continue;
  const result=lab.simulate({...defaults,scenario:s.id,prompt:s.prompt,system:s.system,max_tokens:s.max_tokens||256,stop_sequences:s.stop_sequences});
  assert.equal(result.simulation,true,s.id);
  assert.equal(result.authenticClaudeUsage,false,s.id);
  assert.equal(result.response.usage.input_tokens,null,s.id);
  assert.equal(result.response.usage.output_tokens,null,s.id);
  assert.ok(result.metrics.estimated_input_tokens>0,s.id);
  assert.ok(result.metrics.estimated_output_tokens>0,s.id);
  assert.ok(result.metrics.server_processing_ms>=0,s.id);
 }
});

test('max tokens, stop sequences, JSON, refusals, and multi-turn work as teaching fixtures',()=>{
 const max=lab.simulate({...defaults,scenario:'max_tokens',max_tokens:10});
 assert.equal(max.response.stop_reason,'max_tokens');
 const stop=lab.simulate({...defaults,scenario:'stop_sequence',stop_sequences:['###']});
 assert.equal(stop.response.stop_reason,'stop_sequence');
 assert.equal(stop.response.stop_sequence,'###');
 const extracted=lab.simulate({...defaults,scenario:'structured',prompt:'Urgent bug assigned to Maya'});
 assert.equal(JSON.parse(extracted.response.content[0].text).owner,'Maya');
 const refused=lab.simulate({...defaults,scenario:'refusal'});
 assert.equal(refused.response.stop_reason,'refusal');
 const initial=lab.simulate({...defaults,scenario:'multiturn',history:[]});
 assert.equal(initial.request.messages.length,1);
 const later=lab.simulate({...defaults,scenario:'multiturn',history:[{role:'user',content:'Hello'},{role:'assistant',content:'Hi'}]});
 assert.equal(later.request.messages.length,3);
});

test('tool loop constructs actual tool_use and matching tool_result shaped messages',()=>{
 for(const scenario of ['tools','mcp']){
  const s=lab.SCENARIOS.find(x=>x.id===scenario);
  const first=lab.simulate({...defaults,scenario,prompt:s.prompt});
  assert.equal(first.response.stop_reason,'tool_use');
  const block=first.response.content[0];
  const toolResult=lab.runTool(block.name,block.input);
  const second=lab.simulate({...defaults,scenario,prompt:s.prompt,history:first.request.messages,continued:true,toolUse:block,toolResult});
  assert.equal(second.response.stop_reason,'end_turn');
  assert.equal(second.request.messages.length,3);
  const assistant=second.request.messages[1].content[0];
  const user=second.request.messages[2].content[0];
  assert.equal(assistant.type,'tool_use');
  assert.equal(user.type,'tool_result');
  assert.equal(user.tool_use_id,assistant.id);
  assert.match(second.response.content[0].text,/local tool returned/i);
 }
});

test('rate-limit, overload, context, and malformed input behave predictably',()=>{
 for(const [id,count,status] of [['rate_limit',1,429],['overload',2,529]]){
  for(let attempt=1;attempt<=count;attempt++)assert.throws(()=>lab.simulate({...defaults,scenario:id,attempt}),e=>e.status===status);
  assert.equal(lab.simulate({...defaults,scenario:id,attempt:count+1}).response.stop_reason,'end_turn');
 }
 assert.throws(()=>lab.simulate({...defaults,scenario:'validation'}),e=>e.status===400);
 assert.throws(()=>lab.simulate({...defaults,scenario:'basics',prompt:''}),e=>e.status===400);
 assert.throws(()=>lab.simulate({...defaults,scenario:'context',system:'Large context fixture: '+'x'.repeat(600)}),e=>e.status===400);
});

test('local cache demonstration is clearly separate from provider usage',()=>{
 const q={...defaults,scenario:'cache',prompt:'Unique cache test '+Math.random()};
 const first=lab.simulate(q),second=lab.simulate(q);
 assert.equal(first.cache_demo.hit,false);
 assert.equal(second.cache_demo.hit,true);
 assert.equal(second.response.usage.cache_read_input_tokens,null);
});

test('HTTP endpoints support run, tool execution, errors and real SSE event delivery',async()=>{
 const server=http.createServer(handler);await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 const origin='http://127.0.0.1:'+server.address().port;
 async function post(path,data){return fetch(origin+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})}
 try{
  let r=await fetch(origin+'/api/playground/scenarios');assert.equal(r.status,200);let data=await r.json();assert.equal(data.scenarios.length,18);
  r=await post('/api/playground/run',{...defaults,scenario:'basics'});assert.equal(r.status,200);data=await r.json();assert.equal(data.response.stop_reason,'end_turn');
  r=await post('/api/playground/run',{...defaults,scenario:'rate_limit',attempt:1});assert.equal(r.status,429);data=await r.json();assert.equal(data.error.type,'rate_limit_error');
  r=await post('/api/playground/tool',{name:'lookup_ticket',input:{ticketId:'T-42'}});assert.equal(r.status,200);data=await r.json();assert.equal(data.tool_result.status,'In progress');
  r=await post('/api/playground/stream',{...defaults,scenario:'stream',stream:true});assert.equal(r.status,200);assert.match(r.headers.get('content-type'),/text\/event-stream/);
  const text=await r.text();assert.match(text,/event: message_start/);assert.match(text,/event: content_block_delta/);assert.match(text,/event: message_stop/);assert.match(text,/event: simulation_summary/);
  const events=text.split('\n\n').filter(Boolean).map(x=>x.split('\n')[0].replace('event: ',''));assert.equal(events[0],'message_start');
  assert.equal(events.at(-1),'simulation_summary');
 }finally{await new Promise(ok=>server.close(ok));}
});
