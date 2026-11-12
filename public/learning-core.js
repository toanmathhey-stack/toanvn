// Shared, deterministic reporting. A topic is never treated as proof of an error type.
export const errorTypes={sign:'Quy tắc dấu',equivalence:'Biến đổi tương đương',calculation:'Tính toán',concept:'Hiểu kiến thức / điều kiện',reading:'Đọc và mô hình hóa đề',strategy:'Chưa biết bắt đầu',unknown:'Chưa đủ bằng chứng'};
const skillTypes={sign:['sign','calculation'],distribute:['equivalence','sign'],combine:['equivalence','concept'],equation:['equivalence','sign'],fractions6:['concept','calculation'],percent6:['reading','calculation'],area6:['concept','reading'],ratio7:['concept','reading'],angles7:['concept','calculation'],identity8:['equivalence','concept'],pythagoras8:['concept','calculation'],roots9:['concept','sign'],systems9:['equivalence','calculation'],quadratic9:['equivalence','calculation'],trig9:['concept','reading'],circle9:['concept','reading']};
export const remediationTags=e=>e.errorTags?.length?e.errorTags:skillTypes[e.skill]||['concept','calculation'];
export function assignmentScore(assignment,attempts){
 const ids=assignment.exerciseIds||[];
 const answers=ids.map(id=>attempts.filter(a=>a.exerciseId===id&&a.time>=assignment.created).sort((a,b)=>a.time-b.time)[0]);
 const answered=answers.filter(Boolean).length,correct=answers.filter(a=>a?.initialCorrect).length;
 return {total:ids.length,answered,correct,score:ids.length?Math.round(correct/ids.length*100)/10:null,complete:ids.length>0&&answered===ids.length};
}
export function resolvedAssignments(state,catalog){
 return state.assignments.map(a=>{
   if(a.exerciseIds?.length)return a;
   const matching=catalog.filter(e=>e.skill===a.skill),grade=Number(a.grade||state.profile?.grade||7),graded=matching.filter(e=>e.grades.includes(grade));
   return {...a,exerciseIds:(graded.length?graded:matching).map(e=>e.id)};
 }).filter(a=>a.exerciseIds.length);
}
export function personalReport(state,catalog,diagnoses={}){
 const attempts=[...state.attempts].sort((a,b)=>a.time-b.time),wrong=attempts.filter(a=>!a.initialCorrect);
 const errors=Object.entries(errorTypes).map(([type,label])=>{
   const rows=wrong.filter(a=>(diagnoses[a.id]?.type||'unknown')===type);
   const confirmed=rows.filter(a=>diagnoses[a.id]?.status==='confirmed').length;
   return {type,label,count:rows.length,confirmed,pending:rows.length-confirmed,attemptIds:rows.map(a=>a.id)};
 });
 const comparisons=wrong.filter(a=>a.completed&&a.corrected).map(a=>{
   const next=attempts.find(b=>b.time>a.completed&&b.skill===a.skill&&b.exerciseId!==a.exerciseId);
   const later=attempts.filter(b=>b.time>a.completed&&b.skill===a.skill);
   return {attemptId:a.id,skill:a.skill,type:diagnoses[a.id]?.type||'unknown',beforeCorrect:false,after:next?{attemptId:next.id,exerciseId:next.exerciseId,correct:next.initialCorrect,time:next.time}:null,recurrences:later.filter(b=>!b.initialCorrect&&diagnoses[a.id]?.type!=='unknown'&&diagnoses[a.id]?.type&&diagnoses[b.id]?.type===diagnoses[a.id].type).length};
 });
 const bySkill=[...new Set(attempts.map(a=>a.skill))].map(skill=>{const rows=attempts.filter(a=>a.skill===skill),recent=rows.slice(-5);return{skill,attempts:rows.length,correct:rows.filter(a=>a.initialCorrect).length,recentCorrect:recent.filter(a=>a.initialCorrect).length,recentTotal:recent.length,status:recent.length<3?'Chưa đủ dữ liệu':recent.every(a=>a.initialCorrect)?'Đang tiến bộ':'Cần củng cố'};});
 return {reflections:attempts.filter(a=>a.explanation).map(a=>({id:a.id,exerciseId:a.exerciseId,explanation:a.explanation,note:state.notes?.[a.id]||'',exercise:catalog.find(e=>e.id===a.exerciseId)})),errors,comparisons,bySkill,total:attempts.length,correct:attempts.filter(a=>a.initialCorrect).length,assignments:resolvedAssignments(state,catalog).map(a=>({...a,result:assignmentScore(a,attempts)})),evidence:wrong.map(a=>({...a,diagnosis:diagnoses[a.id]||{type:'unknown',status:'pending',source:'none',reason:'Chưa có phân tích cách làm.'},exercise:catalog.find(e=>e.id===a.exerciseId)}))};
}
export function recommend(state,catalog,diagnoses={},grade=7){
 const available=catalog.filter(e=>e.grades.includes(Number(grade))),attempts=[...state.attempts].sort((a,b)=>a.time-b.time),weak=attempts.filter(a=>!a.initialCorrect).reverse();
 const candidates=new Map();
 for(const a of weak){
   const type=diagnoses[a.id]?.type||'unknown';
   // Prefer another task in the same skill; only use tagged alternatives if no peer exists.
   const peers=available.filter(e=>e.skill===a.skill&&e.id!==a.exerciseId);
   for(const e of peers.length?peers:available.filter(e=>type!=='unknown'&&remediationTags(e).includes(type))){
     const done=attempts.filter(b=>b.exerciseId===e.id),latest=done.at(-1);
     if(latest?.initialCorrect&&latest.time>a.time)continue;
     const score=(e.skill===a.skill?20:0)+(remediationTags(e).includes(type)?10:0)+(done.length?0:8);
     if(!candidates.has(e.id)||candidates.get(e.id).score<score)candidates.set(e.id,{id:e.id,prompt:e.prompt,skill:e.skill,score,type,sourceAttemptId:a.id,reason:type==='unknown'?'Luyện bài khác cùng kỹ năng; chưa đủ bằng chứng xác định loại lỗi.':`Củng cố ${errorTypes[type].toLocaleLowerCase('vi')} sau bài đã làm sai.`,stage:'Khắc phục'});
   }
 }
 if(!candidates.size)for(const e of available.filter(e=>!attempts.some(a=>a.exerciseId===e.id)))candidates.set(e.id,{id:e.id,prompt:e.prompt,skill:e.skill,score:0,type:'unknown',reason:'Bài chưa làm trong chương trình lớp hiện tại.',stage:'Khám phá'});
 return [...candidates.values()].sort((a,b)=>b.score-a.score).slice(0,6);
}
