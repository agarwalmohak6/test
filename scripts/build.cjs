// Optional developer rebuild: npm install && npm run build.
const fs=require('node:fs');const path=require('node:path');const ts=require('typescript');
const root=path.resolve(__dirname,'..');const source=fs.readFileSync(path.join(root,'src/app.jsx'),'utf8');
const result=ts.transpileModule(source,{fileName:'app.jsx',compilerOptions:{jsx:ts.JsxEmit.React,target:ts.ScriptTarget.ES2018,removeComments:false}});
fs.writeFileSync(path.join(root,'public/app.js'),result.outputText);
const playground=fs.readFileSync(path.join(root,'src/playground.jsx'),'utf8');
const playgroundOut=ts.transpileModule(playground,{fileName:'playground.jsx',compilerOptions:{jsx:ts.JsxEmit.React,target:ts.ScriptTarget.ES2018,removeComments:false}});
fs.writeFileSync(path.join(root,'public/playground.js'),playgroundOut.outputText);
console.log('Built public/app.js and public/playground.js');
