'use strict';
const curriculum = require('../shared/curriculum.json');
const allQuestions = require('../shared/questions.json');
const domains = [
 'Applications & Integration','Model Selection & Optimization','Agents & Workflows',
 'Prompt & Context Engineering','Tools & MCP','Security & Safety','Claude Code','Evaluation & Debugging'
];
const finalDomains=[1,0,0,0,5,0,3,3,2,0,2,4,5,1,4,5,4,4,0,1,0,7,0,2,7,1,5,4,4,1,0,5,0,7,7,5].map(i=>domains[i]);
const weeklyDomains=[
 [0,0,0,0,0,2,4,0,5,3,2,0],
 [4,2,1,5,1,4,2,7,7,5,6,2],
 [0,0,5,5,2,0,2,7,5,7,0,5]
].map(row=>row.map(i=>domains[i]));
for (const [key,questions] of Object.entries(allQuestions)) {
  for (let i=0;i<questions.length;i++) {
    if (key.startsWith('day')) questions[i].domain=curriculum[Number(key.slice(3))-1].domain;
    else if (key.startsWith('week')) questions[i].domain=weeklyDomains[Number(key.slice(4))-1][i];
    else questions[i].domain=finalDomains[i];
  }
}
function emptyUser(){return {reviewed:{},labs:{},attempts:[],createdAt:new Date().toISOString()};}
function validLearner(id){return typeof id==='string' && /^[a-zA-Z0-9_-]{8,64}$/.test(id);}
function validQuizId(id){return /^(?:day(?:[1-9]|1\d|2[01])|week[123]|final)$/.test(id);}
function hash(input){let h=2166136261;for(const c of input){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function orderFor(q,learner){const out=[0,1,2,3];let seed=hash(q.id+'|'+learner); for(let i=3;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;let j=seed%(i+1);[out[i],out[j]]=[out[j],out[i]];} return out;}
function publicQuiz(id,learner){if(!validQuizId(id))return null;const src=allQuestions[id];return {id,title:id==='final'?'Final Readiness Assessment':id.startsWith('week')?`Week ${id.slice(4)} Mock Examination`:`Day ${id.slice(3)} Knowledge Check`,kind:id==='final'?'final':id.startsWith('week')?'weekly':'daily',timeLimitSeconds:id==='final'?5400:id.startsWith('week')?1800:480,scheduledDate:id==='final'?'2026-11-21':id==='week1'?'2026-11-07':id==='week2'?'2026-11-14':id==='week3'?'2026-11-21':`2026-11-${String(id.slice(3)).padStart(2,'0')}`,questions:src.map(q=>{const order=orderFor(q,learner);return {id:q.id,prompt:q.prompt,domain:q.domain,options:order.map(i=>q.options[i])};})};}
function grade(id,learner,answers,elapsed=0){const quiz=publicQuiz(id,learner);if(!quiz)return null;const raw=allQuestions[id];const details=raw.map((q,ix)=>{const order=orderFor(q,learner);const correctIndex=order.indexOf(q.answer);const selected=Number(answers[q.id]);const valid=Number.isInteger(selected)&&selected>=0&&selected<4;const correct=valid&&selected===correctIndex;return {id:q.id,prompt:q.prompt,domain:q.domain,selectedIndex:valid?selected:null,correctIndex,options:order.map(i=>q.options[i]),correct,explanation:q.explanation};});let correct=details.filter(x=>x.correct).length;const breakdown={};for(const d of domains){const set=details.filter(q=>q.domain===d);if(set.length)breakdown[d]={total:set.length,correct:set.filter(x=>x.correct).length,percent:Math.round(100*set.filter(x=>x.correct).length/set.length)};}
 return {quizId:id,kind:quiz.kind,score:Math.round(correct*100/raw.length),correct,total:raw.length,breakdown,details,elapsedSeconds:Math.min(Math.max(Number(elapsed)||0,0),30000),takenAt:new Date().toISOString()};}
function bestScore(user,id){return Math.max(-1,...(user.attempts||[]).filter(a=>a.quizId===id).map(a=>a.score));}
function getSummary(user){let dayStats=curriculum.map(c=>{const score=bestScore(user,`day${c.day}`);const reviewed=Boolean(user.reviewed[c.day]),lab=Boolean(user.labs[c.day]);return {day:c.day,reviewed,lab,bestScore:score,completed:reviewed&&lab&&score>=75};});const completedDays=dayStats.filter(d=>d.completed).length;
 const weekly=[1,2,3].map(w=>({week:w,score:bestScore(user,`week${w}`),dueDate:`2026-11-${[7,14,21][w-1]}`}));const finalScore=bestScore(user,'final');const finalAttempt=(user.attempts||[]).filter(x=>x.quizId==='final').sort((a,b)=>b.score-a.score)[0];const breakdown=finalAttempt?.breakdown||{};const weakDomains=Object.entries(breakdown).filter(([k,v])=>v.percent<60).map(([k])=>k);
 const requirements={days:completedDays>=18,weekly:weekly.every(w=>w.score>=75),final:finalScore>=85,domains:finalAttempt?weakDomains.length===0:false};let status='Not assessed';let why='Take the final assessment to see a readiness estimate.';
 if(finalAttempt){if(Object.values(requirements).every(Boolean)){status='Practice-ready';why='Strong practice evidence across lessons, weekly mocks and the final assessment.';}else {status='Keep preparing'; why='Some study targets still need work before taking the official exam.';}}
 return {dayStats,completedDays,weekly,finalScore,finalBreakdown:breakdown,weakDomains,readiness:{status,why,requirements},attemptsCount:(user.attempts||[]).length,recentAttempts:(user.attempts||[]).slice(-6).reverse().map(({details,...a})=>a)};
}
function mockResponse(input){const prompt=String(input.prompt||'').slice(0,1600).trim();const maxTokens=Math.max(1,Math.min(4096,Number(input.max_tokens)||256));if(!prompt)throw new Error('Enter a prompt to run the simulator.');const ticket=prompt.match(/(?:ticket|order)[\s#: -]*([A-Z]?[-]?\d{1,5})/i);
 if(ticket){const id=ticket[1].toUpperCase();return {id:'msg_sim_'+Date.now(),type:'message',role:'assistant',model:'mock-claude-local',content:[{type:'tool_use',id:'toolu_sim_01',name:'lookup_ticket',input:{ticketId:id}}],stop_reason:'tool_use',usage:{input_tokens:null,output_tokens:null},simulation:true,note:'This is a deterministic local tool request, not a Claude API call.'};}
 const low=prompt.toLowerCase();let text=low.includes('api')?'An API is a contract that lets one program request functionality or data from another.':low.includes('mcp')?'MCP standardizes how AI applications connect to external tools and context.':low.includes('token')?'Tokens are the units used to process inputs and generate outputs; token counts are not the same as character counts.':`Mock reply: I received your prompt: “${prompt.slice(0,150)}”. This deterministic sample demonstrates response parsing, not live AI reasoning.`;
 if(text.length>maxTokens*4)text=text.slice(0,maxTokens*4);return {id:'msg_sim_'+Date.now(),type:'message',role:'assistant',model:'mock-claude-local',content:[{type:'text',text}],stop_reason:'end_turn',usage:{input_tokens:null,output_tokens:null},simulation:true,note:'Token usage is intentionally unmeasured in this simulator.'};}
module.exports={curriculum,allQuestions,domains,emptyUser,validLearner,validQuizId,publicQuiz,grade,bestScore,getSummary,mockResponse};
