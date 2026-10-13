// Run from the project root: node translations/build.mjs
// Columns: source ID | Indonesian | Arabic | Simplified Chinese | Traditional Chinese | Italian.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const source=JSON.parse(fs.readFileSync('translations/en.json','utf8'));
const locales=['id','ar','zh-Hans','zh-Hant','it'];
const data={};
for(const file of fs.readdirSync('translations').filter(f=>f.endsWith('.txt')).sort()){
 for(const line of fs.readFileSync('translations/'+file,'utf8').split(/\r?\n/)){
  if(!line.trim()||line.startsWith('#'))continue;
  const [id,...values]=line.split('|');
  assert.equal(values.length,5,`${file}, ID ${id}: expected five translations`);
  const english=source[Number(id)];assert.ok(english,`Unknown ID ${id}`);
  assert.ok(!data[english],`Duplicate source ${id}`);
  const placeholders=value=>[...value.matchAll(/\{\w+\}/g)].map(m=>m[0]).sort();
  values.forEach((value,i)=>{assert.ok(value.trim(),`Empty translation ${id}/${locales[i]}`);assert.deepEqual(placeholders(value),placeholders(english),`Placeholders ${id}/${locales[i]}`)});
  data[english]=Object.fromEntries(locales.map((locale,i)=>[locale,values[i]]));
 }
}
// Aliases reuse reviewed translations, including variable chapter and progress labels.
const patterns=Object.keys(data).filter(s=>s.includes('{')).map(key=>({key,keys:[...key.matchAll(/\{(\w+)\}/g)].map(m=>m[1]),regex:new RegExp('^'+key.split(/(\{\w+\})/).map(s=>/^\{\w+\}$/.test(s)?'(.+?)':s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('')+'$')}));
const unused=new Set([335,337,338,378,391]); // Old sample dates / former concatenated URL sentence.
const literal=new Set([3,9,527]); // Brand, typographic icon, URL placeholder.
for(const [index,english] of source.entries()){
 if(data[english]||unused.has(index))continue;
 if(literal.has(index)){data[english]=Object.fromEntries(locales.map(l=>[l,english]));continue}
 if(index===0){data[english]=Object.fromEntries(locales.map(l=>[l,'Southbank Ready — '+data[source[586]][l]]));continue}
 const suffix=english.endsWith(' ↗')?' ↗':english.endsWith(':')?':':'';
 if(suffix&&data[english.slice(0,-suffix.length)]){data[english]=Object.fromEntries(locales.map(l=>[l,data[english.slice(0,-suffix.length)][l]+suffix]));continue}
 let found=false;
 for(const p of patterns){const m=english.match(p.regex);if(m){const values=Object.fromEntries(p.keys.map((k,i)=>[k,m[i+1]]));data[english]=Object.fromEntries(locales.map(l=>[l,data[p.key][l].replace(/\{(\w+)\}/g,(_,k)=>values[k])]));found=true;break}}
 assert.ok(found,`Missing translation: ${index} ${english}`);
}
fs.writeFileSync('dist/i18n-data.js',"'use strict';\n// Generated from translations/*.txt by translations/build.mjs.\nconst TRANSLATIONS="+JSON.stringify(data,null,2)+';\n');
console.log(`Built ${Object.keys(data).length} messages in ${locales.length} languages.`);
