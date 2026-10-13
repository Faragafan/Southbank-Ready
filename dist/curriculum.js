'use strict';
// Shared by the browser and the server: selections and scoring use stable IDs.
const Curriculum=(()=>{
 const version='2026-10-13';
 function questions(path){
  if(!['resident','access'].includes(path))return [];
  return CHAPTERS[path].filter(c=>c.quiz||c.type==='kit').map(c=>c.quiz?{id:c.id,title:c.quiz.q,options:c.quiz.options.map((label,i)=>({id:String(i),label})),answers:[String(c.quiz.correct)],feedback:c.quiz.feedback,multiple:false}:{id:'kit',title:'Which items belong in your emergency grab bag?',options:KIT_ITEMS.map(i=>({id:i.id,label:i.name})),answers:KIT_ITEMS.filter(i=>i.essential).map(i=>i.id),feedback:'Pack all seven essentials. Leave out candles, heavy furniture and an indoor camping stove.',multiple:true});
 }
 function valid(q,selection){return !!q&&Array.isArray(selection)&&selection.length<=q.options.length&&new Set(selection).size===selection.length&&selection.every(s=>typeof s==='string'&&q.options.some(o=>o.id===s))&&(q.multiple||selection.length===1)}
 function correct(q,selection){return valid(q,selection)&&selection.length===q.answers.length&&q.answers.every(s=>selection.includes(s))}
 return {version,questions,valid,correct};
})();
