import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {DatabaseSync} from 'node:sqlite';

const project=path.dirname(fileURLToPath(import.meta.url));
const root=path.join(project,'dist');
const curriculum=vm.runInNewContext(fs.readFileSync(path.join(root,'content.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'curriculum.js'),'utf8')+'\nCurriculum;',{});
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const hash=value=>crypto.createHash('sha256').update(value).digest();
const same=(a,b)=>crypto.timingSafeEqual(hash(a),hash(b));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.pdf':'application/pdf','.json':'application/json; charset=utf-8'};
const fail=(status,message)=>Object.assign(new Error(message),{status});

export function createApp({dataDir=process.env.SOUTHBANK_DATA_DIR||path.join(project,'.data'),adminKey=process.env.SOUTHBANK_ADMIN_KEY}={}){
 fs.mkdirSync(dataDir,{recursive:true,mode:0o700});
 const keyFile=adminKey===undefined?path.join(dataDir,'admin-key.txt'):null;
 if(keyFile){if(!fs.existsSync(keyFile))fs.writeFileSync(keyFile,crypto.randomBytes(32).toString('hex'),{mode:0o600,flag:'wx'});adminKey=fs.readFileSync(keyFile,'utf8').trim()}
 if(typeof adminKey!=='string'||adminKey.length<32)throw new Error('The organiser key must be at least 32 characters.');
 const db=new DatabaseSync(path.join(dataDir,'results.sqlite'));
 db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS learners(id TEXT PRIMARY KEY, secret_hash TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS runs(id TEXT PRIMARY KEY, learner_id TEXT NOT NULL REFERENCES learners(id) ON DELETE CASCADE, path TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS events(id TEXT PRIMARY KEY, run_id TEXT NOT NULL REFERENCES runs(id) ON DELETE CASCADE, seq INTEGER NOT NULL, question TEXT NOT NULL, selected TEXT NOT NULL, correct INTEGER NOT NULL, stage TEXT NOT NULL, round INTEGER NOT NULL, attempt INTEGER NOT NULL, version TEXT NOT NULL, client_at TEXT NOT NULL, received_at TEXT NOT NULL, UNIQUE(run_id,seq), UNIQUE(run_id,stage,question,attempt));
 CREATE INDEX IF NOT EXISTS events_run ON events(run_id,seq);`);
 function identity(body){if(!body||!uuid.test(body.learnerId)||typeof body.secret!=='string'||!/^[a-f0-9-]{72}$/i.test(body.secret))throw fail(400,'Invalid anonymous identity');return body.learnerId}
 function validateEvent(e){
  if(!e||!uuid.test(e.id)||!uuid.test(e.runId)||!['resident','access'].includes(e.path)||!Number.isSafeInteger(e.seq)||e.seq<1||e.seq>1000000||!['practice','final'].includes(e.stage)||!Number.isSafeInteger(e.round)||e.round<0||e.round>10000||(e.stage==='practice'?e.round!==0:e.round<1)||!Number.isSafeInteger(e.attempt)||e.attempt<1||e.attempt>1000000||(e.stage==='final'&&e.attempt!==e.round)||e.version!==curriculum.version||typeof e.at!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(e.at)||!Number.isFinite(Date.parse(e.at)))throw fail(400,'Invalid answer event');
  const q=curriculum.questions(e.path).find(q=>q.id===e.question);
  if(!curriculum.valid(q,e.selected)||(e.stage==='final'&&!e.selected.length))throw fail(400,'Invalid answer selection');
  return {q,selected:JSON.stringify([...e.selected].sort()),correct:curriculum.correct(q,e.selected)?1:0};
 }
 function ingest(body){
  const learnerId=identity(body);
  if(!Array.isArray(body.events)||!body.events.length||body.events.length>100)throw fail(400,'Send 1 to 100 answer events');
  const checked=body.events.map(e=>({e,...validateEvent(e)}));
  if(new Set(checked.map(x=>x.e.id)).size!==checked.length)throw fail(400,'Repeated event ID in batch');
  const finals=new Map();for(const {e} of checked)if(e.stage==='final'){const key=e.runId+':'+e.round;const group=finals.get(key)||[];group.push(e);finals.set(key,group)}
  for(const group of finals.values()){const qs=curriculum.questions(group[0].path);if(group.length!==qs.length||new Set(group.map(e=>e.question)).size!==qs.length||group.some(e=>e.path!==group[0].path)||!qs.every(q=>group.some(e=>e.question===q.id)))throw fail(400,'Submit every question in a final round together')}
  db.exec('BEGIN IMMEDIATE');
  try{
   const learner=db.prepare('SELECT secret_hash FROM learners WHERE id=?').get(learnerId);
   const secretHash=hash(body.secret).toString('hex');
   if(learner&&!same(learner.secret_hash,secretHash))throw fail(403,'Identity does not match');
   if(!learner)db.prepare('INSERT INTO learners VALUES (?,?)').run(learnerId,secretHash);
   for(const {e,selected,correct} of checked){
    const run=db.prepare('SELECT * FROM runs WHERE id=?').get(e.runId);
    if(run&&(run.learner_id!==learnerId||run.path!==e.path))throw fail(409,'Run does not match');
    if(!run)db.prepare('INSERT INTO runs VALUES (?,?,?)').run(e.runId,learnerId,e.path);
    const old=db.prepare('SELECT * FROM events WHERE id=?').get(e.id);
    if(old){if(old.run_id!==e.runId||old.seq!==e.seq||old.question!==e.question||old.selected!==selected||old.stage!==e.stage||old.round!==e.round||old.attempt!==e.attempt||old.client_at!==e.at)throw fail(409,'An existing answer cannot be overwritten');continue}
    if(db.prepare('SELECT id FROM events WHERE run_id=? AND seq=?').get(e.runId,e.seq))throw fail(409,'Sequence already used');
    if(db.prepare('SELECT id FROM events WHERE run_id=? AND stage=? AND question=? AND attempt=?').get(e.runId,e.stage,e.question,e.attempt))throw fail(409,'Attempt already submitted');
    if(e.stage==='final'&&db.prepare("SELECT id FROM events WHERE run_id=? AND stage='final' AND round=? AND question=?").get(e.runId,e.round,e.question))throw fail(409,'Final answer already submitted');
    db.prepare('INSERT INTO events VALUES (?,?,?,?,?,?,?,?,?,?,?,?)').run(e.id,e.runId,e.seq,e.question,selected,correct,e.stage,e.round,e.attempt,e.version,e.at,new Date().toISOString());
   }
   db.exec('COMMIT');return {accepted:checked.map(x=>x.e.id)};
  }catch(e){db.exec('ROLLBACK');throw e}
 }
 function results(){
  const rows=db.prepare('SELECT e.*, r.path, r.learner_id FROM events e JOIN runs r ON r.id=e.run_id ORDER BY received_at,seq').all();
  const runs=new Map();
  for(const row of rows){let r=runs.get(row.run_id);if(!r){r={id:row.run_id,learnerId:row.learner_id,path:row.path,events:[]};runs.set(r.id,r)}r.events.push({id:row.id,seq:row.seq,question:row.question,selected:JSON.parse(row.selected),correct:!!row.correct,stage:row.stage,round:row.round,attempt:row.attempt,at:row.client_at,receivedAt:row.received_at})}
  for(const r of runs.values()){
   r.events.sort((a,b)=>a.seq-b.seq);
   const qs=curriculum.questions(r.path),rounds=[...new Set(r.events.filter(e=>e.stage==='final').map(e=>e.round))].sort((a,b)=>a-b);
   r.questions=qs.map(q=>({id:q.id,title:q.title,options:q.options}));
   const score=es=>({correct:es.filter(e=>e.correct).length,recorded:es.length,total:qs.length});
   r.first=score(qs.map(q=>r.events.find(e=>e.stage==='practice'&&e.attempt===1&&e.question===q.id)).filter(Boolean));
   r.finals=rounds.map(round=>({round,...score(r.events.filter(e=>e.stage==='final'&&e.round===round))}));
  }
  return {version:curriculum.version,runs:[...runs.values()]};
 }
 function json(res,status,value){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(value))}
 async function readBody(req){if(!req.headers['content-type']?.startsWith('application/json'))throw fail(415,'JSON required');let chunks=[],size=0;for await(const chunk of req){size+=chunk.length;if(size>200000)throw fail(413,'Request too large');chunks.push(chunk)}try{return JSON.parse(Buffer.concat(chunks).toString('utf8'))}catch{throw fail(400,'Invalid JSON')}}
 const server=http.createServer(async(req,res)=>{
  try{
   const url=new URL(req.url,'http://localhost');
   if(url.pathname.startsWith('/api/')){
    if(req.headers.origin){let origin;try{origin=new URL(req.headers.origin)}catch{throw fail(403,'Origin not allowed')}if(origin.host!==req.headers.host||!['http:','https:'].includes(origin.protocol))throw fail(403,'Origin not allowed')}
    if(req.method==='GET'&&url.pathname==='/api/status')return json(res,200,{version:curriculum.version});
    if(req.method==='POST'&&url.pathname==='/api/events')return json(res,200,ingest(await readBody(req)));
    if(req.method==='GET'&&url.pathname==='/api/results'){
     const token=(req.headers.authorization||'').replace(/^Bearer /,'');if(!same(token,adminKey))throw fail(401,'Organiser key required');return json(res,200,results());
    }
    if(req.method==='DELETE'&&url.pathname==='/api/learner'){
     const body=await readBody(req),id=identity(body),row=db.prepare('SELECT secret_hash FROM learners WHERE id=?').get(id);
     if(row&&!same(row.secret_hash,hash(body.secret).toString('hex')))throw fail(403,'Identity does not match');
     db.prepare('DELETE FROM learners WHERE id=?').run(id);return json(res,200,{deleted:true});
    }
    throw fail(404,'API route not found');
   }
   if(!['GET','HEAD'].includes(req.method))throw fail(405,'Method not allowed');
   let relative;try{relative=decodeURIComponent(url.pathname)}catch{throw fail(400,'Invalid path')}
   const file=path.resolve(root,'.'+(relative==='/'?'/index.html':relative));
   if(!file.startsWith(root+path.sep)||relative.split('/').some(s=>s.startsWith('.'))||!fs.existsSync(file)||!fs.statSync(file).isFile())throw fail(404,'Not found');
   res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'DENY'});
   if(req.method==='HEAD')res.end();else fs.createReadStream(file).pipe(res);
  }catch(e){json(res,e.status||500,{error:e.status?e.message:'The server could not save this request'})}
 });
 server.requestTimeout=15000;
 return {server,db,keyFile,close:()=>new Promise(resolve=>server.close(()=>{db.close();resolve()}))};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const host=process.env.SOUTHBANK_HOST||'127.0.0.1';const port=Number(process.env.SOUTHBANK_PORT||process.env.PORT||4173);
 if(!Number.isInteger(port)||port<0||port>65535)throw new Error('PORT or SOUTHBANK_PORT must be a port number between 0 and 65535.');
 const app=createApp();
 app.server.listen(port,host,()=>{const listeningPort=app.server.address().port;console.log(`Southbank Ready: http://${host}:${listeningPort}`);console.log(`Organiser results: http://${host}:${listeningPort}/#organiser`);console.log(app.keyFile?`Your private organiser key is in ${app.keyFile}`:'Your private organiser key is set in the SOUTHBANK_ADMIN_KEY environment variable.');});
 for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{void app.close().then(()=>process.exit(0))});
}
