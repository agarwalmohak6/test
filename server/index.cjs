'use strict';
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {URL}=require('node:url');
const core=require('./core.cjs');
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
function json(res,status,value){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(value));}
function bodyOf(req){return new Promise((resolve,reject)=>{let data='',bytes=0;req.on('data',chunk=>{bytes+=chunk.length;if(bytes>128000){reject(Object.assign(new Error('Request body too large'),{status:413}));req.destroy();return;}data+=chunk;});req.on('end',()=>{try{resolve(JSON.parse(data||'{}'));}catch{reject(Object.assign(new Error('Invalid JSON'),{status:400}));}});req.on('error',reject);});}
function sendStatic(req,res,url){let relative=decodeURIComponent(url.pathname);if(relative==='/'||relative==='/app')relative='/index.html';if(relative.includes('\0')||relative.split('/').includes('..')){res.writeHead(403);res.end('Forbidden');return;}
 const file=path.resolve(root,'.'+relative);if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:data);});}
async function handler(req,res){try{const url=new URL(req.url,'http://localhost');const route=url.pathname;
 if(route==='/api/health'&&req.method==='GET')return json(res,200,{ok:true,mode:'offline',service:'Claude Cert Academy'});
 if(route==='/api/bootstrap'&&req.method==='GET'){const learner=url.searchParams.get('learner');const user=userFor(learner);return json(res,200,{curriculum:core.curriculum,summary:core.getSummary(user),meta:{start:'2026-11-01',end:'2026-11-21',offline:true,totalQuestions:Object.values(core.allQuestions).reduce((n,qs)=>n+qs.length,0)}});}
 if(route==='/api/lesson'&&req.method==='POST'){const b=await bodyOf(req);const user=userFor(b.learner);const day=Number(b.day);if(!Number.isInteger(day)||day<1||day>21)return json(res,400,{error:'Invalid day'});if(!['reviewed','labs'].includes(b.field)||typeof b.value!=='boolean')return json(res,400,{error:'Invalid field/value'});user[b.field][day]=b.value;persist();return json(res,200,{summary:core.getSummary(user)});}
 const match=route.match(/^\/api\/quiz\/((?:day(?:[1-9]|1\d|2[01]))|week[123]|final)(\/submit)?$/);
 if(match){const id=match[1];if(req.method==='GET'&&!match[2]){const learner=url.searchParams.get('learner');userFor(learner);return json(res,200,core.publicQuiz(id,learner));}
 if(req.method==='POST'&&match[2]){const b=await bodyOf(req);const user=userFor(b.learner);if(!b.answers||typeof b.answers!=='object'||Array.isArray(b.answers))return json(res,400,{error:'Invalid answers'});const result=core.grade(id,b.learner,b.answers,b.elapsedSeconds);user.attempts.push(result);user.attempts=user.attempts.slice(-300);persist();return json(res,200,{result,summary:core.getSummary(user)});}}
 if(route==='/api/simulate'&&req.method==='POST'){const b=await bodyOf(req);return json(res,200,core.mockResponse(b));}
 if(route==='/api/reset'&&req.method==='POST'){const b=await bodyOf(req);userFor(b.learner);store[b.learner]=core.emptyUser();persist();return json(res,200,{summary:core.getSummary(store[b.learner])});}
 if(route.startsWith('/api/'))return json(res,404,{error:'Unknown API route'});
 if(req.method==='GET'||req.method==='HEAD')return sendStatic(req,res,url);
 return json(res,405,{error:'Method not allowed'});
 }catch(err){if(!res.headersSent)json(res,err.status||500,{error:err.status?err.message:'Internal server error'});}}
if(require.main===module){http.createServer(handler).listen(port,'0.0.0.0',()=>console.log(`Claude Cert Academy running at http://localhost:${port} (no API key needed)`));}
module.exports={handler};
