'use strict';
const Learning=(()=>{
 const key='southbank-learning-v2';
 const uuid=()=>globalThis.crypto?.randomUUID?.()||'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const n=Math.random()*16|0;return(c==='x'?n:(n&3|8)).toString(16)});
 let data;try{data=JSON.parse(localStorage.getItem(key)||'null')}catch{}
 if(!data||data.version!==2||!Array.isArray(data.events)||!data.runs||!Array.isArray(data.queue))data={version:2,learner:uuid(),secret:uuid()+uuid(),consent:false,runs:{},events:[],queue:[],drafts:{}};
 let online=false,syncing=false,error=false,storageOK=true,inFlight=null;
 function save(){try{localStorage.setItem(key,JSON.stringify(data));storageOK=true}catch{storageOK=false}}
 function run(path){return data.runs[path]||newRun(path)}
 function newRun(path){const value={id:uuid(),path,seq:0};data.runs[path]=value;delete data.drafts[path];save();return value}
 function events(path){const r=run(path);return data.events.filter(e=>e.runId===r.id).sort((a,b)=>a.seq-b.seq)}
 function append(path,question,selection,stage,round){
  const r=run(path),q=Curriculum.questions(path).find(q=>q.id===question);
  if(!Curriculum.valid(q,selection))throw new Error('Invalid answer');
  const event={id:uuid(),runId:r.id,path,seq:++r.seq,question,selected:[...selection].sort(),stage,round,attempt:stage==='practice'?events(path).filter(e=>e.stage==='practice'&&e.question===question).length+1:round,version:Curriculum.version,at:new Date().toISOString()};
  data.events.push(event);if(data.consent)data.queue.push(event.id);return event;
 }
 function practice(path,question,selection){append(path,question,selection,'practice',0);save();void flush()}
 function rounds(path){return [...new Set(events(path).filter(e=>e.stage==='final').map(e=>e.round))].sort((a,b)=>a-b)}
 function final(path,answers){
  const questions=Curriculum.questions(path);
  if(!questions.every(q=>Curriculum.valid(q,answers[q.id])&&(!q.multiple||answers[q.id].length)))return false;
  const round=(rounds(path).at(-1)||0)+1;
  questions.forEach(q=>append(path,q.id,answers[q.id],'final',round));delete data.drafts[path];save();void flush();return true;
 }
 function first(path,q){return events(path).find(e=>e.question===q&&e.stage==='practice')}
 function score(path,stage,round){const qs=Curriculum.questions(path),es=events(path);const selected=qs.map(q=>({q,e:stage==='practice'?es.find(e=>e.question===q.id&&e.stage==='practice'):es.find(e=>e.question===q.id&&e.stage==='final'&&e.round===round)}));return {correct:selected.filter(({q,e})=>e&&Curriculum.correct(q,e.selected)).length,recorded:selected.filter(x=>x.e).length,total:qs.length,items:selected}}
 function draft(path){return data.drafts[path]||{}}
 function choose(path,question,selection){data.drafts[path]??={};data.drafts[path][question]=selection;save()}
 function consent(value){data.consent=value;if(!value)data.queue=[];save();void flush()}
 async function connect(){
  if(!['http:','https:'].includes(location.protocol)||typeof fetch!=='function')return;
  try{const r=await fetch('/api/status',{signal:AbortSignal.timeout(4000)});const s=await r.json();online=r.ok&&s.version===Curriculum.version}catch{online=false}
  if(online)void flush();
 }
 function flush(){
  if(syncing)return inFlight;
  if(!online||!data.consent||!data.queue.length)return Promise.resolve();
  syncing=true;error=false;
  inFlight=(async()=>{
  // Send complete final rounds together; a round is at most five events.
  const ids=data.queue.slice(0,80);const last=data.events.find(e=>e.id===ids.at(-1));
  if(last?.stage==='final')for(const e of data.events)if(e.runId===last.runId&&e.stage==='final'&&e.round===last.round&&data.queue.includes(e.id)&&!ids.includes(e.id))ids.push(e.id);
  try{const r=await fetch('/api/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({learnerId:data.learner,secret:data.secret,events:data.events.filter(e=>ids.includes(e.id))}),signal:AbortSignal.timeout(10000)});if(!r.ok)throw new Error('Upload failed');const result=await r.json();data.queue=data.queue.filter(id=>!result.accepted.includes(id));save()}catch{error=true}
  finally{syncing=false;if(!error&&data.queue.length)void flush()}
  })();return inFlight;
 }
 async function removeShared(){
  if(!online)throw new Error('Server unavailable');
  data.consent=false;data.queue=[];save();
  // Finish any already-sent upload before requesting deletion.
  if(inFlight)await inFlight;
  const r=await fetch('/api/learner',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({learnerId:data.learner,secret:data.secret}),signal:AbortSignal.timeout(10000)});
  if(!r.ok)throw new Error('Delete failed');data.queue=[];data.consent=false;save();
 }
 function clearLocal(){data={version:2,learner:uuid(),secret:uuid()+uuid(),consent:false,runs:{},events:[],queue:[],drafts:{}};save()}
 function status(){return {online,consent:data.consent,pending:data.queue.length,error,storageOK,learner:data.learner}}
 if(typeof window.addEventListener==='function')window.addEventListener('online',()=>void connect());
 return {run,newRun,events,practice,final,rounds,first,score,draft,choose,consent,connect,flush,removeShared,clearLocal,status};
})();
