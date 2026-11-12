import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createStore} from '../auth-store.mjs';
import {exercises} from '../public/data.js';
test('parent dashboard uses only linked children, exact results and empty-data states without writes',()=>{
 const dir=mkdtempSync(path.join(os.tmpdir(),'parent-dashboard-'));try{
 const store=createStore(path.join(dir,'accounts.json')),password='Parent-test-password-123!';
 const child=store.createUser({username:'child',name:'Child',password,role:'student'}),other=store.createUser({username:'other',name:'Other child',password,role:'student'}),teacher=store.createUser({username:'teacher',name:'Teacher',password,role:'teacher',studentIds:[child.id,other.id]}),parent=store.createUser({username:'parent',name:'Parent',password,role:'parent',studentIds:[child.id]}),empty=store.createUser({username:'empty',name:'Empty parent',password,role:'parent'});
 let data=store.learning.parentDashboard(parent);assert.equal(data.average,null);assert.equal(data.completion,null);assert.equal(data.accuracy,null);assert.equal(data.progress,'Đang theo dõi');assert.equal(data.children.length,1);assert.equal(data.events.length,0);
 assert.equal(store.learning.parentDashboard(empty).child,null);assert.throws(()=>store.learning.parentDashboard(parent,{studentId:other.id}),e=>e.status===403);assert.throws(()=>store.learning.parentDashboard(child),e=>e.status===403);
 const group=store.learning.createClass(teacher,{name:'7A',grade:7,studentIds:[child.id,other.id]});store.learning.assignSet(teacher,{classId:group.id,title:'Assignment',due:'2026-12-01',exerciseIds:['sign-1','sign-2']});
 store.saveStudent(child,{attempts:[{id:crypto.randomUUID(),exerciseId:'sign-1',skill:'sign',answer:exercises.find(e=>e.id==='sign-1').answer,working:'I checked signs.',initialCorrect:false,corrected:false,time:Date.now(),mode:'practice'}],reviews:{}});
 const before=JSON.stringify(store.workspace(child));data=store.learning.parentDashboard(parent,{days:30});assert.equal(data.completion,50);assert.equal(data.average,5);assert.equal(data.trend.length,30);assert.equal(data.accuracy,100);assert.equal(data.accuracyChange,null);assert.deepEqual(data.child.classes,['7A']);assert.equal(data.pending.length,1);assert.equal(data.events.length,2);assert.equal(JSON.stringify(store.workspace(child)),before);assert.ok(!JSON.stringify(data).includes(other.name));assert.ok(!('ranking' in data));
 }finally{rmSync(dir,{recursive:true,force:true});}
});
