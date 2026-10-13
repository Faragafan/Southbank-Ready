'use strict';
// Local, exact-message translations. Never sends learner notes to a translation service.
const I18N=(()=>{
 const languages={en:['English','en-AU'],id:['Bahasa Indonesia','id-ID'],ar:['العربية','ar'], 'zh-Hans':['简体中文','zh-CN'],'zh-Hant':['繁體中文','zh-TW'],it:['Italiano','it-IT']};
 const key='southbank-ready-language';
 let language='en';
 try{const saved=localStorage.getItem(key);if(Object.hasOwn(languages,saved))language=saved}catch{}
 const originals=new WeakMap();
 const normalize=s=>s.replace(/\s+/g,' ').trim();
 const patterns=Object.keys(TRANSLATIONS).filter(s=>s.includes('{')).map(source=>({source,keys:[...source.matchAll(/\{(\w+)\}/g)].map(m=>m[1]),regex:new RegExp('^'+source.split(/(\{\w+\})/).map(s=>/^\{\w+\}$/.test(s)?'(.+?)':s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('')+'$')}));
 function t(source,values={}){
  let normalized=normalize(String(source)),message=normalized,params=values;
  if(!Object.hasOwn(TRANSLATIONS,normalized))for(const p of patterns){const match=normalized.match(p.regex);if(match){normalized=p.source;params={...Object.fromEntries(p.keys.map((k,i)=>[k,match[i+1]])),...values};break}}
  const entry=TRANSLATIONS[normalized];
  message=language==='en'?normalized:entry?.[language]||normalized;
  return message.replace(/\{(\w+)\}/g,(all,k)=>Object.hasOwn(params,k)?String(params[k]):all);
 }
 function translateValue(node,field,value){
  const records=originals.get(node)||{};
  let record=records[field];
  if(!record||record.output!==value)record={source:value};
  const source=record.source,core=normalize(source);
  const translated=t(core);
  record.output=core?source.match(/^\s*/)[0]+translated+source.match(/\s*$/)[0]:source;
  records[field]=record;originals.set(node,records);return record.output;
 }
 function localize(root=document.body){
  // The small test DOM intentionally omits TreeWalker; browsers have it.
  if(!document.createTreeWalker)return;
  const skip='[translate="no"], textarea, script, style, svg, #print-plan';
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  let node;
  while((node=walker.nextNode())){
   if(node.parentElement?.closest(skip))continue;
   const next=translateValue(node,'text',node.nodeValue);
   if(next!==node.nodeValue)node.nodeValue=next;
  }
  for(const el of root.querySelectorAll('[aria-label],[placeholder],[alt],[title]')){
   if(el.closest('[translate="no"]'))continue;
   for(const attr of ['aria-label','placeholder','alt','title'])if(el.hasAttribute(attr)){
    const value=el.getAttribute(attr),next=translateValue(el,attr,value);
    if(next!==value)el.setAttribute(attr,next);
   }
  }
  for(const el of root.querySelectorAll('[data-local-date]'))el.textContent=date(el.dataset.localDate,el.dataset.dateStyle==='long');
 }
 function date(value,long=false){return new Intl.DateTimeFormat(languages[language][1],{weekday:long?'long':'short',day:'numeric',month:long?'long':'short',...(long?{year:'numeric'}:{}),timeZone:'UTC'}).format(new Date(value+'T12:00:00Z'))}
 function apply(){
  document.documentElement.lang=language;
  document.documentElement.dir=language==='ar'?'rtl':'ltr';
  document.getElementById('language-select').value=language;
  localize();
 }
 function setLanguage(value){
  if(!Object.hasOwn(languages,value))return;
  language=value;try{localStorage.setItem(key,value)}catch{}
  apply();document.title=t(document.documentElement.dataset.pageTitle||'Your new-neighbour field guide')+' — Southbank Ready';
  document.getElementById('announcer').textContent=t('Language changed. Your answers and notes are kept.');
 }
 return {t,localize,apply,setLanguage,date,get language(){return language},get locale(){return languages[language][1]}};
})();
