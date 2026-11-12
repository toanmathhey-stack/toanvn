import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRosterService,workbook} from './roster-import.mjs';
const rows=[['An','Bình','binh@example.com'],['Lan','Bình','binh@example.com']];
function fixture(persist=()=>{}){const user={id:'teacher',role:'teacher',studentIds:[]},db={users:[user],states:{},classes:[]};return {db,user,service:createRosterService({db,persist})};}
async function input(data=rows){return {name:'9A',grade:9,filename:'class.xlsx',base64:(await workbook(data)).toString('base64')};}
test('Excel creates linked siblings, random accounts, correct grade, idempotent commit',async()=>{
 const {db,user,service}=fixture();const p=await service.preview(user,await input());assert.equal(p.valid,true);
 const result=service.commit(user,p.id);assert.equal(result.count,2);assert.equal(db.users.length,4);
 const parent=db.users.find(u=>u.role==='parent');assert.equal(parent.studentIds.length,2);assert.equal(user.studentIds.length,2);
 assert.equal(result.credentials[0][6],result.credentials[1][6]);assert.notEqual(result.credentials[0][2],result.credentials[1][2]);
 assert.equal(db.states[user.studentIds[0]].profile.grade,9);assert.equal(service.commit(user,p.id),result);assert.equal(db.classes.length,1);
 assert.ok(!JSON.stringify(db).includes(result.credentials[0][2]));
 await assert.rejects(service.preview(user,await input()),/đã tồn tại/);
});
test('Reject invalid rows, formulas, duplicate students and foreign teacher access',async()=>{
 const {user,service}=fixture();const p=await service.preview(user,await input([rows[0],rows[0]]));assert.equal(p.valid,false);assert.throws(()=>service.commit(user,p.id));
 await assert.rejects(service.preview({role:'parent'},await input()),{status:403});
 await assert.rejects(service.preview(user,await input([[{formula:'1+1'},'B','b@example.com']])));
 const valid=await service.preview(user,await input());assert.throws(()=>service.commit({id:'other',role:'teacher'},valid.id),{status:404});
});
test('Persistence failure rolls back all accounts, classes and links',async()=>{
 const {db,user,service}=fixture(()=>{throw Error('disk full');});const p=await service.preview(user,await input());
 assert.throws(()=>service.commit(user,p.id),/disk full/);assert.equal(db.users.length,1);assert.equal(db.classes.length,0);assert.deepEqual(user.studentIds,[]);assert.deepEqual(db.states,{});
});
