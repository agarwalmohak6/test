'use strict';
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {URL}=require('node:url');
const core=require('./core.cjs');
const playground=require('./playground.cjs');
const root=path.resolve(__dirname,'..','public');
const dataDir=path.resolve(__dirname,'data');
const storeFile=path.join(dataDir,'progress.json');
const port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json','.png':'image/png','.ico':'image/x-icon','.ics':'text/calendar; charset=utf-8'};
fs.mkdirSync(dataDir,{recursive:true});
function load(){try{return JSON.parse(fs.readFileSync(storeFile,'utf8'));}catch{return {};}}
let store=load();
function persist(){const temp=storeFile+'.tmp';fs.writeFileSync(temp,JSON.stringify(store,null,2));fs.renameSync(temp,storeFile);}
function userFor(id){if(!core.validLearner(id))throw Object.assign(new Error('Invalid learner ID'),{status:400});if(!store[id])store[id]=core.emptyUser();return store[id];}
// Portable, bounded progress snapshot: browser-local backup protects free-hosted demos
// against loss of Render's ephemeral filesystem. This is not an authenticated account.
function exportProgress(user){
 return {version:1,reviewed:{...user.reviewed},labs:{...user.labs},attempts:(user.attempts||[]).slice(-200).map(a=>({
  quizId:a.quizId,kind:a.kind,score:a.score,correct:a.correct,total:a.total,
  breakdown:a.breakdown,elapsedSeconds:a.elapsedSeconds,takenAt:a.takenAt
 }))};
}
function validateSnapshot(snapshot){
 if(!snapshot||snapshot.version!==1||!Array.isArray(snapshot.attempts)||snapshot.attempts.length>200)throw Object.assign(new Error('Invalid backup'),{status:400});
 const result=core.emptyUser();
 for(const field of ['reviewed','labs']){
  if(!snapshot[field]||typeof snapshot[field]!=='object'||Array.isArray(snapshot[field]))throw Object.assign(new Error('Invalid backup flags'),{status:400});
  for(let d=1;d<=21;d++)if(snapshot[field][d]===true)result[field][d]=true;
 }
 for(const a of snapshot.attempts){
  const template=core.allQuestions[a.quizId];
  if(!template||!core.validQuizId(a.quizId)||!Number.isInteger(a.correct)||a.correct<0||a.correct>template.length||a.total!==template.length||a.score!==Math.round(a.correct*100/a.total)||!Number.isFinite(a.elapsedSeconds)||a.elapsedSeconds<0||a.elapsedSeconds>30000||typeof a.takenAt!=='string'||Number.isNaN(Date.parse(a.takenAt)))throw Object.assign(new Error('Invalid backup score'),{status:400});
  const breakdown={};
  if(!a.breakdown||typeof a.breakdown!=='object'||Array.isArray(a.breakdown))throw Object.assign(new Error('Invalid backup domains'),{status:400});
  for(const [k,v] of Object.entries(a.breakdown)){
   if(!core.domains.includes(k)||!v||!Number.isInteger(v.total)||!Number.isInteger(v.correct)||v.total<1||v.correct<0||v.correct>v.total||v.percent!==Math.round(100*v.correct/v.total))throw Object.assign(new Error('Invalid domain score'),{status:400});
   breakdown[k]={total:v.total,correct:v.correct,percent:v.percent};
  }
  if(Object.values(breakdown).reduce((sum,v)=>sum+v.total,0)!==a.total||Object.values(breakdown).reduce((sum,v)=>sum+v.correct,0)!==a.correct)throw Object.assign(new Error('Invalid domain totals'),{status:400});
  result.attempts.push({quizId:a.quizId,kind:a.kind,score:a.score,correct:a.correct,total:a.total,breakdown,elapsedSeconds:a.elapsedSeconds,takenAt:a.takenAt});
 }
 return result;
}
function json(res,status,value){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(value));}
function bodyOf(req){return new Promise((resolve,reject)=>{let data='',bytes=0;req.on('data',chunk=>{bytes+=chunk.length;if(bytes>128000){reject(Object.assign(new Error('Request body too large'),{status:413}));req.destroy();return;}data+=chunk;});req.on('end',()=>{try{resolve(JSON.parse(data||'{}'));}catch{reject(Object.assign(new Error('Invalid JSON'),{status:400}));}});req.on('error',reject);});}
function sendStatic(req,res,url){let relative=decodeURIComponent(url.pathname);if(relative==='/'||relative==='/app')relative='/index.html';if(relative.includes('\0')||relative.split('/').includes('..')){res.writeHead(403);res.end('Forbidden');return;}
 const file=path.resolve(root,'.'+relative);if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:data);});}
async function handler(req,res){try{const url=new URL(req.url,'http://localhost');const route=url.pathname;
 if(route==='/api/health'&&req.method==='GET')return json(res,200,{ok:true,mode:'offline',service:'Claude Cert Academy'});
 if(route==='/api/bootstrap'&&req.method==='GET'){const learner=url.searchParams.get('learner');const user=userFor(learner);return json(res,200,{curriculum:core.curriculum,summary:core.getSummary(user),meta:{start:'2026-11-01',end:'2026-11-21',offline:true,totalQuestions:Object.values(core.allQuestions).reduce((n,qs)=>n+qs.length,0)}});}
 if(route==='/api/restore'&&req.method==='POST'){const b=await bodyOf(req);const user=userFor(b.learner);const restored=validateSnapshot(b.backup);if((user.attempts||[]).length<=restored.attempts.length){store[b.learner]=restored;persist();}return json(res,200,{summary:core.getSummary(store[b.learner]),backup:exportProgress(store[b.learner])});}
 if(route==='/api/lesson'&&req.method==='POST'){const b=await bodyOf(req);const user=userFor(b.learner);const day=Number(b.day);if(!Number.isInteger(day)||day<1||day>21)return json(res,400,{error:'Invalid day'});if(!['reviewed','labs'].includes(b.field)||typeof b.value!=='boolean')return json(res,400,{error:'Invalid field/value'});user[b.field][day]=b.value;persist();return json(res,200,{summary:core.getSummary(user),backup:exportProgress(user)});}
 const match=route.match(/^\/api\/quiz\/((?:day(?:[1-9]|1\d|2[01]))|week[123]|final)(\/submit)?$/);
 if(match){const id=match[1];if(req.method==='GET'&&!match[2]){const learner=url.searchParams.get('learner');userFor(learner);return json(res,200,core.publicQuiz(id,learner));}
 if(req.method==='POST'&&match[2]){const b=await bodyOf(req);const user=userFor(b.learner);if(!b.answers||typeof b.answers!=='object'||Array.isArray(b.answers))return json(res,400,{error:'Invalid answers'});const result=core.grade(id,b.learner,b.answers,b.elapsedSeconds);user.attempts.push(result);user.attempts=user.attempts.slice(-300);persist();return json(res,200,{result,summary:core.getSummary(user),backup:exportProgress(user)});}}
 if(route==='/api/playground/scenarios'&&req.method==='GET')return json(res,200,{scenarios:playground.SCENARIOS,tools:playground.TOOLS,simulation:true});
 if(route==='/api/playground/tool'&&req.method==='POST'){const b=await bodyOf(req);return json(res,200,{simulation:true,tool_result:playground.runTool(b.name,b.input),warning:'Local fixture output, not an actual MCP or external service call.'});}
 if(route==='/api/playground/run'&&req.method==='POST'){
  const b=await bodyOf(req);const result=playground.simulate(b);
  await playground.wait(b.scenario==='timeout'?1200:result.metrics.simulated_model_delay_ms);
  return json(res,200,result);
 }
 if(route==='/api/playground/stream'&&req.method==='POST'){
  const b=await bodyOf(req),result=playground.simulate({...b,stream:true});
  res.writeHead(200,{'Content-Type':'text/event-stream; charset=utf-8','Cache-Control':'no-cache, no-transform','Connection':'keep-alive','X-Accel-Buffering':'no','X-Content-Type-Options':'nosniff'});
  res.flushHeaders?.();
  let closed=false;res.on('close',()=>{closed=true;});
  for(const e of playground.eventStream(result)){
   if(closed)break;
   res.write('event: '+e.type+'\ndata: '+JSON.stringify(e)+'\n\n');
   if(e.type==='content_block_delta')await playground.wait(45);
   else await playground.wait(8);
  }
  if(!closed){res.write('event: simulation_summary\ndata: '+JSON.stringify({type:'simulation_summary',result})+'\n\n');res.end();}
  return;
 }
 if(route==='/api/simulate'&&req.method==='POST'){const b=await bodyOf(req);return json(res,200,core.mockResponse(b));}
 if(route==='/api/reset'&&req.method==='POST'){const b=await bodyOf(req);userFor(b.learner);store[b.learner]=core.emptyUser();persist();return json(res,200,{summary:core.getSummary(store[b.learner]),backup:exportProgress(store[b.learner])});}
 if(route.startsWith('/api/'))return json(res,404,{error:'Unknown API route'});
 if(req.method==='GET'||req.method==='HEAD')return sendStatic(req,res,url);
 return json(res,405,{error:'Method not allowed'});
 }catch(err){if(!res.headersSent)json(res,err.status||500,err.payload||{error:err.status?err.message:'Internal server error'});}}
if(require.main===module){http.createServer(handler).listen(port,'0.0.0.0',()=>console.log(`Claude Cert Academy running at http://localhost:${port} (no API key needed)`));}
module.exports={handler};
