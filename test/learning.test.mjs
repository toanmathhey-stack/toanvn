import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {randomUUID} from 'node:crypto';
import {createStore} from '../auth-store.mjs';
import {exercises} from '../public/data.js';
import {personalReport,recommend,assignmentScore} from '../public/learning-core.js';
import {learningAI} from '../learning-ai.mjs';
const record=(id,answer,time=Date.now())=>{const e=exercises.find(e=>e.id===id);return{id:randomUUID(),exerciseId:id,skill:e.skill,mode:'practice',answer,initialCorrect:false,corrected:false,time,working:'Em tính -3 + 7 = -10 vì cộng hai số rồi giữ dấu âm.'};};
test('class ownership, assigned sets, server grades, immutable evidence and teacher review survive restart',()=>{
 const dir=mkdtempSync(path.join(os.tmpdir(),'learning-'));try{
 const filename=path.join(dir,'db.json'),store=createStore(filename),password='Learning-test-123!';
 const student=store.createUser({username:'student',name:'Student',role:'student',password}),other=store.createUser({username:'other',name:'Other',role:'student',password}),teacher=store.createUser({username:'teacher',name:'Teacher',role:'teacher',password,studentIds:[student.id]}),parent=store.createUser({username:'parent',name:'Parent',role:'parent',password,studentIds:[student.id]});
 const l=store.learning;
 assert.equal(l.dashboard(teacher).completion,null);assert.throws(()=>l.dashboard(student),e=>e.status===403);
 assert.throws(()=>l.classReport(student),e=>e.status===403);assert.throws(()=>l.report(teacher,other.id),e=>e.status===403);
 assert.throws(()=>l.createClass(teacher,{name:'7A',grade:7,studentIds:[other.id]}),e=>e.status===403);
 const group=l.createClass(teacher,{name:'7A',grade:7,studentIds:[student.id]});
 assert.throws(()=>l.assignSet(teacher,{classId:group.id,title:'Wrong grade',due:'2026-12-01',exerciseIds:['roots9-1']}),e=>e.status===400);
 l.assignSet(teacher,{classId:group.id,title:'Signs',due:'2026-12-01',exerciseIds:['sign-1','sign-2']});
 const first=record('sign-1','999');first.initialCorrect=true;store.saveStudent(student,{attempts:[first],reviews:{}});
 assert.equal(store.workspace(student).state.attempts[0].initialCorrect,false);
 const context=l.diagnoseContext(student,{attemptId:first.id});
 l.storeDiagnosis(student,context,{type:'sign',status:'pending',source:'gemini',evidence:'giữ dấu âm',reason:'Sai quy tắc dấu',nextStep:'So sánh giá trị tuyệt đối'});
 assert.equal(l.report(parent,student.id).errors.find(e=>e.type==='sign').pending,1);
 assert.throws(()=>l.reviewDiagnosis(student,{attemptId:first.id}),e=>e.status===403);
 l.reviewDiagnosis(teacher,{studentId:student.id,attemptId:first.id,type:'sign',evidence:'giữ dấu âm',reason:'Sai quy tắc dấu',nextStep:'So sánh giá trị tuyệt đối'});
 l.storeDiagnosis(student,context,{type:'concept',status:'pending'});assert.equal(l.report(student).evidence[0].diagnosis.type,'sign');
 const edited={...first,working:'Changed after feedback',correction:exercises.find(e=>e.id==='sign-1').answer,corrected:true,completed:Date.now()};store.saveStudent(student,{attempts:[edited],reviews:{}});
 assert.equal(store.workspace(student).state.attempts[0].working,first.working);
 assert.throws(()=>store.saveStudent(student,{attempts:[{...first,answer:'0'}],reviews:{}}),e=>e.status===409);
 const second=record('sign-2',exercises.find(e=>e.id==='sign-2').answer,Date.now()+10);store.saveStudent(student,{attempts:[edited,second],reviews:{}});
 const r=l.report(student);assert.equal(r.assignments[0].result.score,5);assert.equal(r.assignments[0].result.complete,true);assert.equal(r.comparisons[0].after.correct,true);
 assert.equal(l.classReport(teacher,group.id).errors.find(e=>e.type==='sign').students.length,1);
 const dashboard=l.dashboard(teacher,{classId:group.id});assert.equal(dashboard.completion,100);assert.equal(dashboard.totalStudents,1);assert.equal(dashboard.attention,1);assert.equal(dashboard.assignedRecently,1);assert.equal(dashboard.trend.length,7);
 assert.equal(createStore(filename).learning.report(student).errors.find(e=>e.type==='sign').confirmed,1);
 const admin=store.createUser({username:'admin',name:'Admin',role:'admin',password});store.link(admin,{userId:teacher.id,studentIds:[]});const fresh=store.authenticate(store.login('teacher',password,'teacher').token);assert.equal(l.classReport(fresh,group.id).total,0);assert.throws(()=>l.report(fresh,student.id),e=>e.status===403);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
test('unknown history stays unknown; recurrence requires matching diagnosis; recommendations stay in grade',()=>{
 const a={...record('sign-1','999',1),completed:2,corrected:true},b={...record('sign-2','999',3)},c={...record('sign-3','999',4)};
 const state={attempts:[a,b,c],assignments:[]};let r=personalReport(state,exercises,{});assert.equal(r.errors.find(e=>e.type==='unknown').count,3);assert.equal(r.comparisons[0].recurrences,0);
 const diagnoses={[a.id]:{type:'sign',status:'confirmed'},[b.id]:{type:'calculation',status:'pending'},[c.id]:{type:'sign',status:'pending'}};
 r=personalReport(state,exercises,diagnoses);assert.equal(r.comparisons[0].recurrences,1);
 const recs=recommend(state,exercises,diagnoses,7);assert.ok(recs.length);assert.ok(recs.every(r=>exercises.find(e=>e.id===r.id).grades.includes(7)));
 assert.equal(assignmentScore({exerciseIds:['sign-1'],created:10},state.attempts).score,0);
});
test('AI requires verbatim evidence and existing recommended exercise IDs',async()=>{
 const mock=value=>async()=>({ok:true,json:async()=>({candidates:[{content:{parts:[{text:JSON.stringify(value)}]}}]})});
 const input={key:'fake',model:'test',task:'diagnose',data:{working:'x = -3 vì đổi dấu'},fetcher:mock({type:'sign',evidence:'đổi dấu',reason:'Giải thích',nextStep:'Thế lại',confidence:0.7})};
 assert.equal((await learningAI(input)).status,'pending');
 await assert.rejects(learningAI({...input,fetcher:mock({type:'sign',evidence:'not in working',reason:'X',nextStep:'Y',confidence:1})}),e=>e.status===502);
 await assert.rejects(learningAI({...input,key:''}),e=>e.status===503);
 await assert.rejects(learningAI({...input,task:'insight',data:{candidates:[{id:'sign-1'}]},fetcher:mock({summary:'Test',actions:['Test'],exerciseIds:['invented']})}),e=>e.status===502);
});
