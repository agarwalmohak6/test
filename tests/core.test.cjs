const test=require('node:test');
const assert=require('node:assert/strict');
const http=require('node:http');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const core=require('../server/core.cjs');
const {handler}=require('../server/index.cjs');

test('curriculum contains exactly 21 substantive lessons',()=>{
 assert.equal(core.curriculum.length,21);
 for(const [i,l] of core.curriculum.entries()){
  assert.equal(l.day,i+1); assert.ok(l.notes.length>=3);
  assert.ok(l.objectives.length>=3);assert.ok(l.lab.steps.length>=3);
  assert.ok(l.notes.every(n=>n.body.length>150));
 }
});
test('all quizzes have unique ids, four options, and valid correct indexes',()=>{
 const ids=new Set();let count=0;
 for(const [key,qs] of Object.entries(core.allQuestions)){
  assert.ok(core.validQuizId(key));assert.ok(qs.length>0);
  for(const q of qs){assert.ok(!ids.has(q.id));ids.add(q.id);assert.equal(q.options.length,4);assert.ok(q.answer>=0&&q.answer<4);assert.ok(q.prompt.length>15);assert.ok(q.domain);count++;}
 }
 assert.equal(count,156);assert.equal(core.allQuestions.final.length,36);
 for(let d=1;d<=21;d++)assert.equal(core.allQuestions[`day${d}`].length,4);
});
test('quiz shuffling keeps grading accurate and hides answer key on GET',()=>{
 const learner='learn_test123456',q=core.publicQuiz('day3',learner);
 assert.equal(q.questions.length,4);assert.equal(JSON.stringify(q).includes('correctIndex'),false);
 assert.equal(JSON.stringify(q).includes('explanation'),false);
 let answers={};for(const item of q.questions){const orig=core.allQuestions.day3.find(x=>x.id===item.id);answers[item.id]=item.options.indexOf(orig.options[orig.answer]);}
 const result=core.grade('day3',learner,answers,35);assert.equal(result.score,100);assert.equal(result.correct,4);assert.equal(result.elapsedSeconds,35);
 const fail=core.grade('day3',learner,{});assert.equal(fail.score,0);
});
test('mastery requires reviewed notes, lab done, and 75%+ daily score',()=>{
 const u=core.emptyUser();u.reviewed[1]=true;u.labs[1]=true;
 assert.equal(core.getSummary(u).dayStats[0].completed,false);
 u.attempts.push(core.grade('day1','learn_test123',{}));
 assert.equal(core.getSummary(u).dayStats[0].completed,false);
 const p=core.publicQuiz('day1','learn_test123');let answers={};for(const q of p.questions){const orig=core.allQuestions.day1.find(x=>x.id===q.id);answers[q.id]=q.options.indexOf(orig.options[orig.answer]);}
 u.attempts.push(core.grade('day1','learn_test123',answers));
 assert.equal(core.getSummary(u).dayStats[0].completed,true);
});
test('final readiness requires lesson work, weekly scores, final score, and domains',()=>{
 const u=core.emptyUser();const learner='learn_readiness456';
 for(let d=1;d<=18;d++){u.reviewed[d]=true;u.labs[d]=true;const q=core.publicQuiz('day'+d,learner);const a={};for(const x of q.questions){const original=core.allQuestions['day'+d].find(y=>y.id===x.id);a[x.id]=x.options.indexOf(original.options[original.answer]);}u.attempts.push(core.grade('day'+d,learner,a));}
 for(let w=1;w<=3;w++){const quizId='week'+w,q=core.publicQuiz(quizId,learner),a={};for(const x of q.questions){const original=core.allQuestions[quizId].find(y=>y.id===x.id);a[x.id]=x.options.indexOf(original.options[original.answer]);}u.attempts.push(core.grade(quizId,learner,a));}
 let assessment=core.getSummary(u);assert.equal(assessment.readiness.status,'Not assessed');
 const q=core.publicQuiz('final',learner),a={};for(const x of q.questions){const original=core.allQuestions.final.find(y=>y.id===x.id);a[x.id]=x.options.indexOf(original.options[original.answer]);}u.attempts.push(core.grade('final',learner,a));
 assessment=core.getSummary(u);assert.equal(assessment.readiness.status,'Practice-ready');
});
test('mock simulator reports simulation and does not fake usage values',()=>{
 const response=core.mockResponse({prompt:'Explain what an API is'});assert.equal(response.simulation,true);assert.equal(response.usage.input_tokens,null);assert.equal(response.stop_reason,'end_turn');
 const tool=core.mockResponse({prompt:'Look up ticket T-42'});assert.equal(tool.stop_reason,'tool_use');assert.equal(tool.content[0].name,'lookup_ticket');
});
test('React frontend parses and all main views create elements',()=>{
 const React=require('../public/vendor/react.production.min.js');let rootElement=null;const memory=new Map();const sandbox={React,window:{React,addEventListener(){},removeEventListener(){},scrollTo(){},confirm(){return false;}},ReactDOM:{render(el){rootElement=el;}},document:{getElementById(){return {}}},localStorage:{getItem(k){return memory.get(k)||null;},setItem(k,v){memory.set(k,v);}},crypto:{randomUUID(){return 'test-1234567890'}},setInterval(){return 1},clearInterval(){},setTimeout(){return 1},clearTimeout(){},location:{hash:'',search:''},history:{replaceState(){}},fetch:async()=>{},console};
 sandbox.window.localStorage=sandbox.localStorage;
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../public/app.js'),'utf8'),sandbox,{timeout:2000});
 assert.ok(rootElement);
 const app=new rootElement.type({});const sum=core.getSummary(core.emptyUser());app.state={...app.state,lessons:core.curriculum,summary:sum,loading:false};
 for(const page of ['dashboard','path','notes','assessments','progress','playground','lesson','quiz']){
  app.state.page=page;assert.ok(app.render(),`render failed: ${page}`);
 }
});
test('browser progress backup can restore after an API session reset',async()=>{
 const server=http.createServer(handler);await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port,learner='learn_backup_'+Date.now();
 const send=(path,body)=>fetch(origin+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).then(r=>r.json());
 try{
  const done=await send('/api/lesson',{learner,day:1,field:'reviewed',value:true});
  assert.equal(done.backup.reviewed['1'],true);
  await send('/api/reset',{learner});
  let b=await (await fetch(origin+'/api/bootstrap?learner='+learner)).json();assert.equal(b.summary.dayStats[0].reviewed,false);
  const restored=await send('/api/restore',{learner,backup:done.backup});assert.equal(restored.summary.dayStats[0].reviewed,true);
  b=await (await fetch(origin+'/api/bootstrap?learner='+learner)).json();assert.equal(b.summary.dayStats[0].reviewed,true);
 }finally{await new Promise(r=>server.close(r));}
});
test('HTTP API serves a lesson and grades a daily quiz',async()=>{
 const server=http.createServer(handler);await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port;const learner='learn_http_'+Date.now();
 try{
  const health=await (await fetch(origin+'/api/health')).json();assert.equal(health.ok,true);
  const bootstrap=await (await fetch(origin+'/api/bootstrap?learner='+learner)).json();assert.equal(bootstrap.curriculum.length,21);
  const quiz=await (await fetch(origin+'/api/quiz/day1?learner='+learner)).json();assert.equal(quiz.questions.length,4);
  const body={learner,answers:{}};const response=await fetch(origin+'/api/quiz/day1/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  const attempt=await response.json();assert.equal(attempt.result.score,0);
  const wrong=await fetch(origin+'/api/lesson',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({learner,day:50,field:'reviewed',value:true})});assert.equal(wrong.status,400);
  const pathAttack=await fetch(origin+'/../server/index.cjs');assert.notEqual(pathAttack.status,200);
 }finally{await new Promise(r=>server.close(r));}
});

test('mobile startup uses React 16-compatible structure and tolerates restricted storage',()=>{
 const js=fs.readFileSync(path.join(__dirname,'../public/app.js'),'utf8');
 const jsx=fs.readFileSync(path.join(__dirname,'../src/app.jsx'),'utf8');
 const html=fs.readFileSync(path.join(__dirname,'../public/index.html'),'utf8');
 // The vendored React runtime is v16.0, which has no React.Fragment.
 assert.doesNotMatch(js,/React\.Fragment/);
 assert.doesNotMatch(jsx,/<><div className=\{'sidebar-backdrop/);
 assert.match(js,/localStorage\.getItem/);
 assert.match(js,/claudepath_learner/);
 assert.match(html,/app\.js\?v=layoutfix-3/);
});


test('responsive navigation, collapsible notes and quiz scrolling are included',()=>{
 const src=fs.readFileSync(path.join(__dirname,'../src/app.jsx'),'utf8');
 const css=fs.readFileSync(path.join(__dirname,'../public/styles.css'),'utf8');
 assert.match(src,/jumpQuestion=\(index\)/);
 assert.match(src,/scrollIntoView\(\{behavior:'smooth',block:'start'\}\)/);
 assert.match(src,/openNotesDay:1/);
 assert.match(src,/aria-expanded=\{expanded\}/);
 assert.match(src,/mobile-nav-open/);
 assert.match(css,/\.sidebar \{ overflow-y: auto;/);
 assert.match(css,/\.lesson-aside \{ display:flex; flex-direction:column;/);
 assert.match(css,/\.notes-expand \{ display:flex;/);
 assert.match(css,/\.question-dots button \{ height:44px;/);
 assert.match(css,/safe-area-inset-bottom/);
});
