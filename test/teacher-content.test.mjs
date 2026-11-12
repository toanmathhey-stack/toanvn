import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createStore} from '../auth-store.mjs';
import {validateContent,generateContentDraft} from '../teacher-content.mjs';
const draft={kind:'exercise',grade:7,title:'Xác suất',topic:'Xác suất',prompt:'Tung đồng xu cân đối. Xác suất mặt sấp?',answer:'1/2',wrong:'P=1',rule:'Hai kết quả đồng khả năng, một kết quả thuận lợi nên xác suất bằng 1/2.'};
test('teacher content persists, respects assignment and grade, and saves student attempts',()=>{
 const dir=mkdtempSync(path.join(os.tmpdir(),'content-'));try{
 const file=path.join(dir,'db.json'),store=createStore(file),password='Test-password-123!';
 const student=store.createUser({username:'student',name:'Student',password,role:'student'}),teacher=store.createUser({username:'teacher',name:'Teacher',password,role:'teacher',studentIds:[student.id]}),other=store.createUser({username:'other',name:'Other',password,role:'student'});
 assert.throws(()=>store.publishContent(student,draft),e=>e.status===403);
 const {content}=store.publishContent(teacher,draft);assert.equal(store.teacherContents(student).length,1);assert.equal(store.teacherContents(other).length,0);assert.equal(createStore(file).teacherContents(teacher).length,1);
 store.saveStudent(student,{attempts:[{id:crypto.randomUUID(),exerciseId:content.id,skill:'teacher-'+content.id,time:Date.now(),answer:'1/2',initialCorrect:true,mode:'practice',completed:Date.now()}],reviews:{},profile:{name:'Student',grade:'7'}});
 assert.equal(store.workspace(student).state.attempts.length,1);
 store.saveStudent(student,{attempts:[],reviews:{},profile:{name:'Student',grade:'9'}});assert.equal(store.teacherContents(student).length,0);
 assert.throws(()=>validateContent({...draft,answer:'\\frac{1}{2}'}));assert.throws(()=>validateContent({kind:'formula',grade:7,title:'Bad',topic:'Bad',tex:'\\badcommand',condition:'Any',example:'1'}));
 }finally{rmSync(dir,{recursive:true,force:true});}
});
test('Gemini produces validated draft only and reports unavailable or invalid responses',async()=>{
 const input={kind:'exercise',grade:7,request:'Soạn bài xác suất'};
 await assert.rejects(generateContentDraft({input}),e=>e.status===503);
 const fetcher=async()=>({ok:true,json:async()=>({candidates:[{content:{parts:[{text:JSON.stringify(draft)}]}}]})});
 assert.equal((await generateContentDraft({key:'test',model:'test',input,fetcher})).answer,'1/2');
 await assert.rejects(generateContentDraft({key:'test',model:'test',input,fetcher:async()=>({ok:false})}),e=>e.status===502);
});
