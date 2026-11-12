export function learningStats(state,exercises,skills,now=Date.now()){
 const ids=new Set(exercises.map(e=>e.id)),attempts=state.attempts.filter(a=>ids.has(a.exerciseId));
 const mistakes=attempts.filter(a=>!a.initialCorrect),completed=new Set(attempts.filter(a=>a.completed).map(a=>a.exerciseId)).size;
 const bySkill=Object.fromEntries(skills.map(skill=>{
   const rows=attempts.filter(a=>a.skill===skill.id),recent=rows.slice(-5),correct=rows.filter(a=>a.initialCorrect).length;
   return [skill.id,{count:rows.length,correct,percent:rows.length?Math.round(correct/rows.length*100):0,completed:new Set(rows.filter(a=>a.completed).map(a=>a.exerciseId)).size,total:exercises.filter(e=>e.skill===skill.id).length,label:recent.length>=3&&recent.every(a=>a.initialCorrect)&&recent.some(a=>a.mode==='review')?'Đang tiến bộ':rows.some(a=>!a.initialCorrect)?'Cần ôn':'Chưa đủ dữ liệu'}];
 }));
 return{attempts,mistakes,completed,bySkill,discovered:new Set(attempts.map(a=>a.exerciseId)).size,corrected:mistakes.filter(a=>a.corrected).length,days:new Set(attempts.map(a=>new Date(a.time).toDateString())).size,due:Object.entries(state.reviews).filter(([id,r])=>ids.has(id)&&r.due<=now),scheduled:Object.keys(state.reviews).filter(id=>ids.has(id)).length};
}
