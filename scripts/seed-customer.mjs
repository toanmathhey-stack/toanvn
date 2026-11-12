import {existsSync,readFileSync,mkdirSync,writeFileSync,renameSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateSnapshot} from '../database/migration.mjs';

export function seedCustomer(filename,source=fileURLToPath(new URL('../deploy-seed/9a3.json',import.meta.url))){
 if(!existsSync(source))return false;
 const seed=JSON.parse(readFileSync(source,'utf8'));
 validateSnapshot(seed);
 const current=existsSync(filename)?JSON.parse(readFileSync(filename,'utf8')):null;
 // Correct the approved teacher display name in deployments already initialized.
 const teacher=current?.users.find(u=>u.role==='teacher'&&u.username==='nguyenthiminhhuong');
 if(teacher?.name==='Nguyễn Thị Minh Hướng'){
  teacher.name='Nguyễn Thị Minh Hương';
  writeFileSync(filename+'.tmp',JSON.stringify(current),{mode:0o600});
  renameSync(filename+'.tmp',filename);
 }
 if(current?.users.some(u=>u.role!=='admin'))return false;
 if(current&&Object.values(current.states||{}).some(s=>s.attempts?.length))return false;
 if(current){
  seed.users.push(...current.users);
  seed.states={...seed.states,...current.states};
 }
 validateSnapshot(seed);
 mkdirSync(path.dirname(filename),{recursive:true});
 writeFileSync(filename+'.tmp',JSON.stringify(seed),{mode:0o600});
 renameSync(filename+'.tmp',filename);
 console.log('9A3 initialized: teacher, students, parents and demonstration learning data; existing passwords preserved.');
 return true;
}
