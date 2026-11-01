/* ClaudePath interactive offline Messages API laboratory.
 * React 16 compatible. No real model, account, key, inference or tokenization is performed.
 */
const CL_R=window.React;
const FIELD_GUIDE={
 'model':['Model identifier','Selects the model used by a real API call. mock-* identifiers are local teaching fixtures, not Claude model names.'],
 'max_tokens':['Output budget','Maximum output tokens the model may generate. Not a guarantee it will use all of them. Here truncation uses an approximation.'],
 'system':['System instructions','Higher-priority application instructions. On the Messages API, this is a top-level field rather than a system role in messages.'],
 'messages':['Conversation history','Stateless API calls must include the turns needed to provide context. The assistant does not remember previous API calls automatically.'],
 'role':['Role','Who authored the message. Most Messages API conversation messages use user and assistant; tool results are sent under user role.'],
 'content':['Content blocks','Content may be plain text or typed blocks such as text, tool_use and tool_result. Streaming sends deltas.'],
 'temperature':['Sampling control','Controls randomness in a real model, subject to model support. Our deterministic fixture does not randomly generate output.'],
 'stream':['Streaming toggle','When enabled, an API may deliver server-sent events incrementally. Our SSE timeline uses real network streaming but mock content.'],
 'stop_sequences':['Custom stop text','Optional sequences that terminate text generation, reflected by stop_reason stop_sequence when matched.'],
 'tools':['Client tool definitions','JSON Schema and descriptions let a model request a tool. The host app executes it and sends the result back.'],
 'name':['Tool name','A machine-readable identifier for a tool supplied to the model.'],
 'description':['Tool description','A description helps the model determine when a tool should be called.'],
 'input_schema':['Tool JSON Schema','Defines the expected input arguments to the tool. Your backend must still validate the data before execution.'],
 'properties':['Schema properties','Names and validation constraints of arguments accepted by a tool.'],
 'required':['Required properties','Tool arguments required by the tool schema.'],
 'type':['Block or object type','Identifies whether this is a message, text block, tool_use request, tool_result or error.'],
 'id':['Response or tool ID','Identifier useful for logs; tool_result must reference the matching tool_use ID. Mock identifiers are invented and marked sim.'],
 'input':['Tool arguments','The model-proposed arguments passed to your tool only after validation.'],
 'tool_use_id':['Tool call correlation','Connects a tool_result block to the tool_use block that requested it.'],
 'is_error':['Tool failure marker','Flags an error result so the model can consider the failure rather than silently using bad data.'],
 'stop_reason':['Why generation stopped','end_turn: finished; tool_use: application must run tool; max_tokens: hit output cap; stop_sequence: matched delimiter; refusal: declined request.'],
 'stop_sequence':['Matched delimiter','The custom stop sequence that caused the model to end, when applicable; otherwise null.'],
 'usage':['Provider accounting','In real responses, usage contains billed token counts. We deliberately leave these null because no Anthropic tokenizer or model runs.'],
 'input_tokens':['Provider input count','Actual input tokens reported by a real service. Null in this simulator; see separately labelled approximation.'],
 'output_tokens':['Provider output count','Actual output tokens reported by a real service. Null in this simulator; see separately labelled approximation.'],
 'cache_creation_input_tokens':['Cache-write tokens','In actual Claude usage, cache creation input tokens are reported separately when applicable. Not measured here.'],
 'cache_read_input_tokens':['Cache-read tokens','In actual Claude usage, cache read input tokens are reported separately when applicable. Not measured here.'],
 'error':['Error details','Structured error type and message. Retry transient conditions but repair malformed requests before retry.'],
 'message':['Error message','Human-readable problem description; consider not showing sensitive raw backend data to an end user.'],
 'simulation':['Simulator mode','True means this is a local classroom fixture, not an actual Anthropic API result.'],
 'estimated_input_tokens':['Approximate input tokens','Estimated from characters. Not Anthropic token counts, not billing, and unsuitable for exact context limits.'],
 'estimated_output_tokens':['Approximate output tokens','Estimated from characters. In real usage rely on the provider response.'],
 'server_processing_ms':['Backend work time','Measured local JavaScript fixture execution time, separate from deliberately added network delay.'],
 'simulated_model_delay_ms':['Artificial delay','A classroom delay to make UI timing observable. Not an actual model benchmark.'],
 'model_delay_ms':['Artificial delay','Controlled fixture delay, not model inference latency.'],
 'cache_demo':['Cache demonstration','A teaching-only map comparing repeated prompt inputs; no provider cache is used.'],
 'hit':['Cache demonstration hit','True indicates a repeated fixture input, not a real Anthropic cache hit.'],
 'source':['Content origin','This app uses predetermined instructional examples and deterministic rules rather than an inference API.'],
 'authenticClaudeUsage':['Real usage flag','False because no paid or free Claude API inference occurs.'],
 'stop_sequence_demo':['Stop sequence demo','Custom stop sequence behavior illustrated locally.'],
 'index':['Block index','Position of a content block in a streamed message.'],
 'delta':['Streaming change','The incremental fragment that clients must assemble in the correct order.'],
 'text':['Text content','Text carried in a content block or streamed text delta.'],
 'partial_json':['Incremental JSON','During tool input streaming, JSON arguments may arrive in fragments; do not parse until complete.'],
 'status':['Status','A state or status code associated with a tool record or server response.'],
 'retry_after_ms':['Retry guidance','When a transient 429 or 529 appears, a service may recommend waiting before retrying. This is a simulated delay in our lesson.'],
 'prompt':['User request text','The current user turn, sent alongside the relevant earlier messages. This simulator uses topic rules and fixtures, not natural-language inference.']
};
const CL_SCENARIO_FALLBACK=[{id:'basics',name:'First Messages request',group:'Foundations',prompt:'Explain what an API is',system:'You are a patient developer mentor.',skill:'Request construction'}];
const CL_TABS=['Guided JSON','Raw JSON','Event timeline','How it works'];
const pretty=v=>JSON.stringify(v,null,2);
const ms=n=>Number.isFinite(n)?`${n.toFixed(0)} ms`:'—';
const copyText=async text=>{try{await navigator.clipboard.writeText(text);return true;}catch{return false;}};
function showFieldTip(e,field){const panel=document.getElementById('cl-floating-help');const desc=FIELD_GUIDE[field];if(!panel||!desc)return;panel.textContent=field+' — '+desc[1];panel.style.display='block';const rect=e.currentTarget.getBoundingClientRect();panel.style.left=Math.max(12,Math.min(window.innerWidth-310,rect.left))+'px';panel.style.top=(rect.bottom+10>window.innerHeight-105?Math.max(12,rect.top-116):rect.bottom+9)+'px';}
function hideFieldTip(){const panel=document.getElementById('cl-floating-help');if(panel)panel.style.display='none';}
function FieldHint({field,small=false}){const info=FIELD_GUIDE[field];if(!info)return null;return <span onMouseEnter={e=>showFieldTip(e,field)} onFocus={e=>showFieldTip(e,field)} onMouseLeave={hideFieldTip} onBlur={hideFieldTip} className={'cl-help '+(small?'cl-help-small':'')} tabIndex="0" role="note" aria-label={`About ${field}: ${info[1]}`} data-help={info[1]} title={`${info[0]}: ${info[1]}`}>?</span>}
function GuidedNode({value,k,depth=0,path=''}){
 const obj=value!==null&&typeof value==='object';const isArray=Array.isArray(value);
 if(!obj)return <div className="cl-json-line" style={{paddingLeft:Math.min(depth,7)*15}}><span className="cl-json-key">{k==null?'':`${k}: `}</span><span className={typeof value==='string'?'cl-str':typeof value==='number'?'cl-num':'cl-other'}>{pretty(value)===undefined?'undefined':pretty(value)}</span>{k!=null&&<FieldHint field={k} small/>}</div>;
 const entries=Object.entries(value);return <details className="cl-json-node" open={depth<=1}><summary style={{paddingLeft:Math.min(depth,7)*15}}><span className="cl-json-key">{k==null?'root':k}</span><FieldHint field={k||''} small/><span className="cl-json-bracket">{isArray?'[':'{'} {entries.length} {isArray?'items':'fields'} {isArray?']':'}'}</span></summary><div>{entries.length?entries.map(([key,val])=><GuidedNode key={path+'/'+key} k={isArray?key:key} value={val} depth={depth+1} path={path+'/'+key}/>):<span className="cl-json-empty">Empty</span>}</div></details>;
}
class ClaudePathPlayground extends CL_R.Component{
 constructor(p){super(p);this.state={catalog:CL_SCENARIO_FALLBACK,scenario:'basics',model:'mock-balanced',prompt:'Explain what an API is and give one useful example.',system:'You are a clear, patient developer mentor.',max_tokens:256,temperature:0.5,timeout:5000,stop_sequences:'',stream:false,autoRetry:true,history:[],result:null,error:null,loading:false,events:[],liveText:'',attempts:[],selectedTab:'Guided JSON',elapsed:null,ttfb:null,ttft:null,toolOutput:null,toolLoading:false,toolTrace:null,runCount:0,cacheExample:false,expandHistory:false,search:'',showAdvanced:false};this.ctrl=null;this.deadline=null;this.runId=0;}
 componentDidMount(){this.mounted=true;fetch('/api/playground/scenarios').then(async r=>{if(!r.ok)throw Error('Cannot load scenarios');return r.json()}).then(x=>{if(this.mounted)this.setState({catalog:x.scenarios||CL_SCENARIO_FALLBACK});}).catch(()=>{});}
 componentWillUnmount(){this.mounted=false;this.runId++;this.ctrl?.abort();clearTimeout(this.deadline);}
 pick=(id)=>{const s=this.state.catalog.find(x=>x.id===id)||CL_SCENARIO_FALLBACK[0];this.cancel();this.setState({scenario:id,prompt:s.prompt||'',system:s.system||'',stream:!!s.stream,max_tokens:s.max_tokens||256,stop_sequences:s.stop_sequences?.join(', ')||'',history:[],result:null,error:null,events:[],attempts:[],elapsed:null,ttft:null,ttfb:null,toolOutput:null,toolTrace:null,liveText:'',selectedTab:'Guided JSON'});}
 change=(k,v)=>this.setState({[k]:v});
 request=(extra={})=>{const s=this.state;return {scenario:s.scenario,model:s.model,prompt:s.prompt,system:s.system,max_tokens:Number(s.max_tokens),temperature:Number(s.temperature),stream:s.stream,history:s.history.map(x=>({role:x.role,content:x.content})),stop_sequences:s.stop_sequences.split(',').map(x=>x.trim()).filter(Boolean),...extra};}
 cancel=()=>{this.runId++;this.ctrl?.abort();clearTimeout(this.deadline);this.ctrl=null;this.setState({loading:false,toolLoading:false});}
 fetchJSON=async(url,payload,signal,timing)=>{const sent=performance.now();const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal});if(timing)timing.firstByteMs=performance.now()-sent;let d=await r.json();if(!r.ok){const e=new Error(d?.error?.message||d?.error||`HTTP ${r.status}`);e.httpStatus=r.status;e.data=d;throw e;}return d;}
 streamRun=async(payload,signal,progress)=>{
  const begin=performance.now();const r=await fetch('/api/playground/stream',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal});if(!r.ok){const d=await r.json();const err=new Error(d?.error?.message||`HTTP ${r.status}`);err.httpStatus=r.status;err.data=d;throw err;}
  if(timing)timing.firstByte=performance.now()-requestStart;
  if(!r.body||!r.body.getReader)throw new Error('This browser does not support streaming fetch. Turn streaming off and retry.');
  const reader=r.body.getReader(),decoder=new TextDecoder();let buffer='',result=null,events=[],text='',ttft=null,firstByteMs=null;
  while(true){const part=await reader.read();if(part.done)break;if(firstByteMs===null)firstByteMs=performance.now()-begin;buffer+=decoder.decode(part.value,{stream:true});let split;while((split=buffer.indexOf('\n\n'))>=0){const raw=buffer.slice(0,split);buffer=buffer.slice(split+2);let eName='',dataLine='';for(const ln of raw.split('\n')){if(ln.startsWith('event: '))eName=ln.slice(7);if(ln.startsWith('data: '))dataLine=ln.slice(6)}if(!dataLine)continue;let data;try{data=JSON.parse(dataLine);}catch{continue;}if(eName==='simulation_summary'){result=data.result;continue;}events.push({name:eName,at:Math.round(performance.now()-begin),data});if(eName==='content_block_delta'&&data.delta?.text){text+=data.delta.text;if(ttft===null)ttft=performance.now()-begin;}progress({events:[...events],liveText:text,ttft});}}
  if(!result)throw new Error('Stream ended without the simulation summary.');return {result,events,ttft,firstByteMs};
 }
 run=async(options={})=>{
  if(!this.state.prompt.trim()&&this.state.scenario!=='validation'){this.setState({error:{message:'Write a user message before running.'}});return;}
  this.cancel();const ownId=++this.runId,ctrl=new AbortController();this.ctrl=ctrl;
  const payload=this.request(options);this.setState({loading:true,result:null,error:null,events:[],liveText:'',attempts:[],toolTrace:null,toolOutput:null,ttfb:null,ttft:null,elapsed:null,selectedTab:this.state.stream?'Event timeline':'Guided JSON'});
  const started=performance.now(),attempts=[];let finished=null,timings={};
  try{
   for(let attempt=1;attempt<=3;attempt++){
    const t=performance.now();const body={...payload,attempt};let result=null,ev=[],ttft=null,firstByteMs=null;
    clearTimeout(this.deadline);this.deadline=setTimeout(()=>ctrl.abort(),Number(this.state.timeout));
    try{
     if(payload.stream){const streamed=await this.streamRun(body,ctrl.signal,p=>{if(ownId===this.runId)this.setState(p)},networkTiming);result=streamed.result;ev=streamed.events;ttft=streamed.ttft;firstByteMs=streamed.firstByteMs;}
     else{const timing={};result=await this.fetchJSON('/api/playground/run',body,ctrl.signal,timing);firstByteMs=timing.firstByteMs;}
     clearTimeout(this.deadline);if(ownId!==this.runId)return;
     const duration=performance.now()-t;attempts.push({attempt,status:200,elapsed:Math.round(duration)});
     finished=result;timings={duration:performance.now()-started,ttfb:firstByteMs,ttft:payload.stream?ttft:null,events:ev};break;
    }catch(e){clearTimeout(this.deadline);if(ownId!==this.runId)return;const duration=performance.now()-t,status=e.httpStatus||0;
      attempts.push({attempt,status:status||'ABORT',elapsed:Math.round(duration),message:e.message});
      if(e.name==='AbortError')throw new Error(`Request cancelled or exceeded the ${this.state.timeout} ms timeout.`);
      if(!this.state.autoRetry||![429,529].includes(status)||attempt===3)throw e;
      const delay=Math.min(1200,Math.max(e.data?.retry_after_ms||0,200*attempt));
      this.setState({attempts:[...attempts]});await new Promise((resolve,reject)=>{const timer=setTimeout(resolve,delay);ctrl.signal.addEventListener('abort',()=>{clearTimeout(timer);reject(new Error('Cancelled during retry delay.'))},{once:true});});
    }
   }
   if(ownId!==this.runId)return;
   this.setState(s=>({loading:false,result:finished,elapsed:timings.duration,ttfb:timings.ttfb,ttft:timings.ttft,events:timings.events||[],attempts,runCount:s.runCount+1}));
  }catch(e){if(ownId!==this.runId)return;this.setState({loading:false,elapsed:performance.now()-started,error:{message:e.message,status:e.httpStatus||null,details:e.data||null},attempts});}
 }
 executeTool=async()=>{const s=this.state;const tool=s.result?.response?.content?.find(c=>c.type==='tool_use');if(!tool)return;this.setState({toolLoading:true,error:null});try{
   const output=await this.fetchJSON('/api/playground/tool',{name:tool.name,input:tool.input});
   const oldRequest=s.result.request;
   // Pass the existing turns and the tool response separately: normalize() appends
   // exactly one assistant tool_use and exactly one user tool_result message.
   const after=await this.fetchJSON('/api/playground/run',this.request({history:oldRequest.messages,continued:true,toolUse:tool,toolResult:output.tool_result,stream:false}));
   this.setState({toolLoading:false,toolOutput:output,toolTrace:{first:s.result,second:after},result:after,selectedTab:'Guided JSON'});
  }catch(e){this.setState({toolLoading:false,error:{message:e.message}});}
 }
 addTurn=()=>{const r=this.state.result?.response;if(!r)return;const texts=r.content.filter(x=>x.type==='text').map(x=>x.text).join('\n');const history=[...this.state.history,{role:'user',content:this.state.prompt},{role:'assistant',content:texts||'[A tool call is pending; finish it first]'}].slice(-14);this.setState({history,prompt:'',result:null,error:null,events:[],liveText:'',toolTrace:null});}
 exportRun=()=>{const data={exportedAt:new Date().toISOString(),notice:'Educational simulator. Timing is real browser elapsed time; token counts are rough estimates, not Anthropic usage.',scenario:this.state.scenario,request:this.state.result?.request||this.request(),response:this.state.result?.response||null,metrics:this.state.result?.metrics||null,timing:{elapsed_ms:this.state.elapsed,first_byte_ms:this.state.ttfb,first_delta_ms:this.state.ttft},attempts:this.state.attempts,events:this.state.events};const file=new Blob([pretty(data)],{type:'application/json'}),href=URL.createObjectURL(file),a=document.createElement('a');a.href=href;a.download='claudepath-simulation.json';a.click();URL.revokeObjectURL(href);}
 render(){const s=this.state,selected=s.catalog.find(x=>x.id===s.scenario)||CL_SCENARIO_FALLBACK[0],result=s.result,request=result?.request||{model:s.model,max_tokens:s.max_tokens,system:s.system,messages:[...s.history,{role:'user',content:s.prompt}],temperature:s.temperature,stream:s.stream,...(s.stop_sequences.trim()?{stop_sequences:s.stop_sequences.split(',').map(x=>x.trim()).filter(Boolean)}:{})},response=result?.response||null,raw=(response||s.error?.details||null),cache=result?.cache_demo,metrics=result?.metrics;const filtered=s.catalog.filter(x=>(x.name+' '+x.skill+' '+x.group).toLowerCase().includes(s.search.toLowerCase()));const etaOutput=metrics?.estimated_output_tokens||0;const throughput=s.elapsed>0?(etaOutput/(s.elapsed/1000)).toFixed(1):null;
 return <div className="page-content cl-page"><div id="cl-floating-help" role="tooltip" className="cl-floating-help"/>
  <div className="cl-topline"><div><div className="eyebrow">INTERACTIVE DEVELOPER LAB · NO API KEY</div><h1>Messages API Playground <span className="cl-top-spark">✳</span></h1><p>Build requests, watch the lifecycle, and understand every field. All responses are <b>scripted local simulations</b>, never generated by Claude.</p></div><div className="cl-top-actions"><span className="cl-running-dot"/> Offline teaching engine</div></div>
  <div className="cl-notice"><Icon name="shield" size={18}/><div><strong>Measured time · Estimated tokens · 0 API charges</strong><p>Network timing below is measured in your browser, with intentional fixture delays. Token approximations are based on text length (not an Anthropic tokenizer); actual provider usage stays <code>null</code>. No API credentials or user prompts are sent to Anthropic.</p></div></div>
  <div className="cl-stats" aria-live="polite">
   {[[ 'TOTAL TIME', s.elapsed==null?'—':ms(s.elapsed),'Real browser time, including mock delay and retries' ],['INPUT TOKENS',metrics?'~'+metrics.estimated_input_tokens:'—','Approximate; actual input_tokens remains null'],['OUTPUT TOKENS',metrics?'~'+metrics.estimated_output_tokens:'—','Approximate; actual output_tokens remains null'],['FIRST BYTE',s.ttfb==null?'—':ms(s.ttfb),'Measured first HTTP bytes / headers from our simulator'],['FIRST TOKEN',s.ttft==null?'—':ms(s.ttft),'First streamed text delta measured from request start; only for SSE'],['RETRY ATTEMPTS',s.attempts.length||'—','Measured HTTP attempts, including failures']].map(([label,value,tip])=><div key={label} className="cl-stat" title={tip}><span>{label}</span><strong>{value}</strong><small>{tip}</small></div>)}
  </div>
  <div className="cl-layout">
   <section className="cl-panel cl-config"><div className="cl-panel-head"><span><Icon name="sliders" size={17}/> Request builder</span><span className="cl-label">EDITABLE</span></div>
    <div className="cl-config-inner">
     <label className="cl-field" htmlFor="cl-search">Browse {s.catalog.length} scenarios <FieldHint field="messages"/></label>
     <input id="cl-search" className="cl-input cl-search" placeholder="Filter: streaming, tools, safety, caching..." value={s.search} onChange={e=>this.change('search',e.target.value)}/>
     <div className="cl-scenario-grid" role="group" aria-label="Choose a scenario">{filtered.map(x=><button key={x.id} className={'cl-scenario '+(x.id===s.scenario?'active':'')} onClick={()=>this.pick(x.id)} type="button"><span>{x.name}</span><small>{x.group}</small></button>)}{!filtered.length&&<p>No scenarios match. Try “tool”, “token” or “error”.</p>}</div>
     <div className="cl-active-scenario"><strong>{selected.name}</strong><span>{selected.skill}</span><p>{selected.tip}</p></div>
     <div className="cl-fieldrow"><label className="cl-field" htmlFor="cl-model">Model <FieldHint field="model"/></label><select id="cl-model" className="cl-input" value={s.model} onChange={e=>this.change('model',e.target.value)}><option value="mock-fast">mock-fast · 40ms lesson delay</option><option value="mock-balanced">mock-balanced · 110ms</option><option value="mock-deep">mock-deep · 230ms</option></select></div>
     <label className="cl-field" htmlFor="cl-system">System instructions <FieldHint field="system"/></label><textarea className="cl-input cl-textarea" id="cl-system" rows="3" value={s.system} onChange={e=>this.change('system',e.target.value)}/>
     <label className="cl-field" htmlFor="cl-prompt">User message <FieldHint field="messages"/></label><textarea className="cl-input cl-textarea" id="cl-prompt" rows="4" value={s.prompt} onChange={e=>this.change('prompt',e.target.value)} placeholder="Ask about an API, tokens, MCP, retrying errors..."/>
     {s.history.length>0&&<div className="cl-history"><button onClick={()=>this.change('expandHistory',!s.expandHistory)}>Conversation history · {s.history.length} turns <Icon name="down" size={14}/></button>{s.expandHistory&&s.history.map((x,i)=><div key={i}><b>{x.role}</b> {typeof x.content==='string'?x.content:pretty(x.content)}</div>)}<button className="cl-clear" onClick={()=>this.setState({history:[],result:null})}>Clear history</button></div>}
     <div className="cl-slider-head"><label className="cl-field" htmlFor="cl-max">Maximum output tokens <FieldHint field="max_tokens"/></label><b>{s.max_tokens}</b></div><input id="cl-max" className="cl-slider" type="range" min="8" max="2048" step="8" value={s.max_tokens} onChange={e=>this.change('max_tokens',+e.target.value)}/>
     <button type="button" className="cl-advanced-toggle" onClick={()=>this.change('showAdvanced',!s.showAdvanced)} aria-expanded={s.showAdvanced}>Advanced request controls <Icon name="down" size={15}/></button>
     {s.showAdvanced&&<div className="cl-advanced"><div className="cl-fieldrow"><label className="cl-field" htmlFor="cl-temp">Temperature <FieldHint field="temperature"/></label><input id="cl-temp" className="cl-input" type="number" step="0.1" min="0" max="1" value={s.temperature} onChange={e=>this.change('temperature',Math.max(0,Math.min(1,+e.target.value||0)))}/></div><label className="cl-field" htmlFor="cl-stop">Stop sequences (comma separated) <FieldHint field="stop_sequences"/></label><input id="cl-stop" className="cl-input" value={s.stop_sequences} placeholder="e.g. ###" onChange={e=>this.change('stop_sequences',e.target.value)}/><div className="cl-fieldrow"><label className="cl-field" htmlFor="cl-timeout">Client timeout (ms)</label><input id="cl-timeout" className="cl-input" type="number" min="250" max="30000" value={s.timeout} onChange={e=>this.change('timeout',Math.max(250,Math.min(30000,+e.target.value||5000)))}/></div><label className="cl-toggle"><input type="checkbox" checked={s.autoRetry} onChange={e=>this.change('autoRetry',e.target.checked)}/> Retry 429 / 529 up to 3 times</label></div>}
     <div className="cl-run-actions"><label className="cl-toggle"><input type="checkbox" checked={s.stream} onChange={e=>this.change('stream',e.target.checked)}/> Stream events (SSE) <FieldHint field="stream"/></label><div className="cl-runbuttons"><button disabled={s.loading||s.toolLoading} className="btn btn-coral" onClick={()=>this.run()}><Icon name="play" size={14}/>{s.loading?'Running…':'Run simulation'}</button><button className="btn btn-outline" disabled={!s.loading} onClick={this.cancel}>Cancel</button></div></div>
     {s.result&&!s.result.response.content.some(x=>x.type==='tool_use')&&<button className="cl-addturn" onClick={this.addTurn}>Add reply to conversation & ask a follow-up <Icon name="arrow" size={15}/></button>}
     {s.result?.response?.content?.some(x=>x.type==='tool_use')&&<button disabled={s.toolLoading} className="cl-addturn cl-toolbutton" onClick={this.executeTool}>{s.toolLoading?'Executing local fixture…':'Execute tool → send result → continue'} <Icon name="arrow" size={15}/></button>}
    </div>
   </section>
   <section className="cl-panel cl-inspect"><div className="cl-panel-head"><span><Icon name="terminal" size={17}/> Response inspector</span><button className="cl-download" disabled={!s.result} onClick={this.exportRun} title="Download simulation trace JSON"><Icon name="download" size={14}/> Export trace</button></div>
    <div className="cl-tabs" role="tablist" aria-label="Inspect simulation details">{CL_TABS.map(t=><button key={t} role="tab" aria-selected={s.selectedTab===t} className={s.selectedTab===t?'active':''} onClick={()=>this.change('selectedTab',t)}>{t}</button>)}</div>
    <div className="cl-inspect-content">
     {s.loading&&<div className="cl-live" role="status"><div className="cl-spinner"/> <strong>Processing mock request</strong><span>{s.stream?'SSE streaming enabled; chunks appear below.':'Waiting for scripted response.'}</span>{s.liveText&&<pre>{s.liveText}</pre>}</div>}
     {s.error&&<div className="cl-error" role="alert"><b>Request failed {s.error.status?`· HTTP ${s.error.status}`:''}</b><p>{s.error.message}</p><small>Open the error details in the inspector. For 400, fix the request; for 429 or 529, use a bounded retry.</small></div>}
     {s.selectedTab==='Guided JSON'&&<div className="cl-inspector-split"><div><div className="cl-prehead">REQUEST <button onClick={()=>copyText(pretty(request))} title="Copy request">Copy</button></div><div className="cl-code"><GuidedNode value={request} k="request"/></div></div><div><div className="cl-prehead">{s.error?'ERROR RESPONSE':'SIMULATED RESPONSE'} <button disabled={!raw} onClick={()=>copyText(pretty(raw))} title="Copy response">Copy</button></div><div className="cl-code">{raw?<GuidedNode value={raw} k="response"/>:<div className="cl-empty">Run any scenario to inspect every response field. Hover a <strong>?</strong> icon or tap it for a definition.</div>}</div></div></div>}
     {s.selectedTab==='Raw JSON'&&<div className="cl-inspector-split"><div><div className="cl-prehead">REQUEST JSON</div><pre className="cl-raw">{pretty(request)}</pre></div><div><div className="cl-prehead">{s.error?'ERROR JSON':'RESPONSE JSON'}</div><pre className="cl-raw">{raw?pretty(raw):'// Run a simulation to view the result.'}</pre></div></div>}
     {s.selectedTab==='Event timeline'&&<div className="cl-events"><p>Real SSE messages are received over HTTP, while their content and scheduled delivery are entirely simulated.</p>{s.events.length?s.events.map((e,i)=><details key={i}><summary><span className="cl-event-num">{i+1}</span><span>{e.name}</span><small>+{e.at} ms</small></summary><pre>{pretty(e.data)}</pre></details>):<div className="cl-empty">Enable streaming, then Run. The complete sequence of <code>message_start</code>, <code>content_block_delta</code>, and <code>message_stop</code> appears here.</div>}</div>}
     {s.selectedTab==='How it works'&&<div className="cl-explain-detail"><h3>{selected.name}</h3><p>{selected.skill}</p><p>{selected.tip}</p><h4>What is happening underneath?</h4><ol><li>Your browser prepares a Messages-shaped JSON request.</li><li>Node.js validates the scenario, fields, conversation history and limits.</li><li>The offline rules engine returns deterministic content or a controlled error.</li><li>Browser clocks measure the elapsed network time; a rough character formula estimates token counts.</li><li>Tool examples add a <code>tool_use</code> block and require an application-side <code>tool_result</code> continuation.</li></ol><h4>What this cannot demonstrate</h4><p>Claude's true intelligence, reasoning quality, precise tokenization, real cache hits, billing, model benchmarks, live MCP server connectivity, or model-generated tool decisions. Use the official Messages API documentation for exact contracts.</p><a target="_blank" rel="noopener noreferrer" href="https://platform.claude.com/docs/en/api/messages/create">Official Messages API documentation ↗</a></div>}
     {s.result&&<div className="cl-debug-summary"><div><b>stop_reason</b><code>{response?.stop_reason||'—'}</code><FieldHint field="stop_reason"/></div><div><b>Time to first byte</b><code>{s.ttfb==null?'—':ms(s.ttfb)}</code></div><div><b>Input / output</b><code>~{metrics?.estimated_input_tokens||0} / ~{metrics?.estimated_output_tokens||0} tokens</code></div><div><b>Approx. throughput</b><code>{throughput||'—'} estimated tok/s</code></div><div><b>Local processing</b><code>{ms(metrics?.server_processing_ms)} · artificial delay {ms(metrics?.simulated_model_delay_ms)}</code></div><div><b>First byte</b><code>{s.ttfb==null?'Not measured':ms(s.ttfb)}</code></div><div><b>Provider token usage</b><code>null · not measured</code></div>{cache?.enabled&&<div><b>Local cache demo</b><code>{cache.hit?'Repeated request ✓':'First request'}</code></div>}{s.toolTrace&&<div><b>Tool round trip</b><code>2 model-shaped requests + 1 fixture</code></div>}</div>}
     {s.attempts.length>0&&<div className="cl-attempts"><div className="cl-prehead">HTTP ATTEMPT TRACE</div>{s.attempts.map((a,i)=><div key={i} className="cl-attempt"><strong>Attempt {a.attempt}</strong><span className={a.status===200?'cl-success':'cl-fail'}>{a.status===200?'200 success':`HTTP ${a.status}`}</span><span>{a.elapsed} ms</span>{a.message&&<small>{a.message}</small>}</div>)}</div>}
     {s.toolTrace&&<div className="cl-tooltrace"><div className="cl-prehead">TOOL LOOP TRACE</div><details><summary>1. Assistant requested tool_use</summary><pre>{pretty(s.toolTrace.first.response.content)}</pre></details><details><summary>2. Local fixture tool_result</summary><pre>{pretty(s.toolOutput?.tool_result)}</pre></details><details><summary>3. Assistant response after tool result</summary><pre>{pretty(s.toolTrace.second.response)}</pre></details></div>}
    </div>
   </section>
  </div>
  <div className="cl-bottom-guide"><div><span className="cl-guide-icon">01</span><strong>Choose a scenario</strong><p>18 exercises from conversation history to streaming, context, error handling, security and MCP concepts.</p></div><div><span className="cl-guide-icon">02</span><strong>Edit & run</strong><p>Try your own prompts and parameters. The scripted lesson engine still works with arbitrary inputs, but never pretends to be a model.</p></div><div><span className="cl-guide-icon">03</span><strong>Inspect deeply</strong><p>Hover or focus ? for field definitions. Export traces, retry failures, complete tool loops and compare token estimates with wall time.</p></div></div>
 </div>;
 }
}
window.ClaudePathPlayground=ClaudePathPlayground;
