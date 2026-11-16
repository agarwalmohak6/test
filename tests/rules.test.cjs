const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {handler}=require('../server/index.cjs');
const rules=JSON.parse(fs.readFileSync(path.join(__dirname,'../public/rules.json'),'utf8'));

test('Rules library contains all 17 episode notes in order',()=>{
 assert.equal(rules.length,17);
 assert.deepEqual(rules.map(x=>x.episode),Array.from({length:17},(_,i)=>`EP${String(i+1).padStart(2,'0')}`));
 for(const ep of rules){
  assert.ok(ep.title.length>5);
  assert.ok(ep.overview.length>100);
  assert.ok(ep.topics.length>=2);
  assert.ok(ep.thumbRules.length>=4);
  assert.ok(ep.examTrap.length>20);
  assert.ok(ep.memoryLine.length>5);
 }
});

test('Rules library has no duplicate episode IDs and only valid decision filters',()=>{
 const ids=new Set();
 for(const ep of rules){
  assert.ok(!ids.has(ep.episode));ids.add(ep.episode);
  assert.ok(['all','runs','call','see','production'].includes(ep.decisionKey));
  assert.ok(ep.topics.every(t=>t.heading&&t.body));
 }
});

test('Rules navigation and page are wired into the React app',()=>{
 const app=fs.readFileSync(path.join(__dirname,'../src/app.jsx'),'utf8');
 assert.match(app,/\['rules','bookOpen','Rules'\]/);
 assert.match(app,/rules:\['Rules','EP01–EP17/);
 assert.match(app,/page==='rules'\?this\.renderRules\(\)/);
 assert.match(app,/fetch\('\/rules\.json\?v=ep01-17'\)/);
});

test('Rules JSON and stylesheet are served by the existing Node server',async()=>{
 const server=http.createServer(handler);
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=`http://127.0.0.1:${server.address().port}`;
 try{
  const [jsonRes,cssRes]=await Promise.all([fetch(base+'/rules.json'),fetch(base+'/rules.css')]);
  assert.equal(jsonRes.status,200);assert.match(jsonRes.headers.get('content-type'),/application\/json/);
  const served=await jsonRes.json();assert.equal(served.length,17);assert.equal(served[16].episode,'EP17');
  assert.equal(cssRes.status,200);assert.match(await cssRes.text(),/\.rules-episode-list/);
 }finally{await new Promise(resolve=>server.close(resolve));}
});
