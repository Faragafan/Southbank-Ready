// The website is already built. Check the runtime and files without opening
// the results database: Render mounts its persistent disk only at runtime.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {DatabaseSync} from 'node:sqlite';

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(project,'dist');
const [major,minor]=process.versions.node.split('.').map(Number);
assert.ok(major>=22&&major<25&&(major!==22||minor>=13),'Use Node.js 22.13+ or Node.js 24.');
const database=new DatabaseSync(':memory:');
assert.equal(database.prepare('SELECT 1 AS ready').get().ready,1);
database.close();
const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
 const reference=match[1];
 if(/^(?:https?:|data:|\/\/)/.test(reference))continue;
 const file=path.resolve(dist,reference.split(/[?#]/)[0]);
 assert.ok(file.startsWith(dist+path.sep)&&fs.statSync(file).isFile(),`Missing website asset: ${reference}`);
}
for(const name of fs.readdirSync(dist).filter(name=>name.endsWith('.js'))){
 new vm.Script(fs.readFileSync(path.join(dist,name),'utf8'),{filename:name});
}
const checked=spawnSync(process.execPath,['--check',path.join(project,'serve.mjs')],{encoding:'utf8'});
assert.equal(checked.status,0,checked.stderr||checked.error?.message);
console.log('Ready to deploy: Node, SQLite, website assets and JavaScript checks passed.');
