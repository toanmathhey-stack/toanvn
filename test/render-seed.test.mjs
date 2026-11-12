import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {seedRender} from '../scripts/seed-render.mjs';
import {createStore} from '../auth-store.mjs';
test('Render seed preserves learning data, rotates credentials, and never overwrites a database',()=>{
 const dir=mkdtempSync(path.join(os.tmpdir(),'math-seed-')),filename=path.join(dir,'accounts.json');
 try{
  assert.throws(()=>seedRender(filename,''));
  assert.equal(seedRender(filename,'Seed-test-password-123!'),true);
  const store=createStore(filename),credentials=JSON.parse(readFileSync(path.join(dir,'initial-credentials.json'),'utf8'));
  for(const c of credentials)assert.equal(store.login(c.username,c.password,c.username).user.role,c.role);
  const seeded=JSON.parse(readFileSync(filename,'utf8')),source=JSON.parse(readFileSync('deploy-seed/accounts.json','utf8'));
  assert.deepEqual(seeded.states,source.states);assert.deepEqual(seeded.lessonPublications,source.lessonPublications);
  assert.ok(source.users.every(u=>!u.hash&&!u.salt&&!u.password));
  const before=readFileSync(filename,'utf8');assert.equal(seedRender(filename,''),false);assert.equal(readFileSync(filename,'utf8'),before);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
