import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {seedCustomer} from '../scripts/seed-customer.mjs';
import {createStore} from '../auth-store.mjs';

test('9A3 seed preserves approved accounts and demo data without overwriting later work',()=>{
 const file=path.join(mkdtempSync(path.join(os.tmpdir(),'customer-seed-')),'accounts.json');
 assert.equal(seedCustomer(file),true);
 const source=JSON.parse(readFileSync('deploy-seed/9a3.json','utf8'));
 assert.deepEqual(JSON.parse(readFileSync(file,'utf8')),source);
 const store=createStore(file);
 assert.equal(store.login('nguyenthiminhhuong','minhhuong2026@','test').user.role,'teacher');
 const before=readFileSync(file,'utf8');
 assert.equal(seedCustomer(file),false);
 assert.equal(readFileSync(file,'utf8'),before);
});

test('9A3 seed retains an existing administrator in an otherwise empty deployment',()=>{
 const file=path.join(mkdtempSync(path.join(os.tmpdir(),'customer-admin-')),'accounts.json');
 const store=createStore(file);
 const admin=store.createUser({username:'quantri',name:'Admin',role:'admin',password:'Test-admin-password-2026'});
 assert.equal(seedCustomer(file),true);
 const reopened=createStore(file);
 assert.equal(reopened.login('quantri','Test-admin-password-2026','test').user.id,admin.id);
 assert.equal(reopened.users().filter(u=>u.role==='student').length,37);
 assert.equal(reopened.users().filter(u=>u.role==='parent').length,37);
});
