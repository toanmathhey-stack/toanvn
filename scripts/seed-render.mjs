import {existsSync,mkdirSync,readFileSync,writeFileSync,renameSync,cpSync} from 'node:fs';
import path from 'node:path';
import {randomBytes,scryptSync} from 'node:crypto';
import {fileURLToPath} from 'node:url';

export function seedRender(filename,adminPassword,seedDir=fileURLToPath(new URL('../deploy-seed/',import.meta.url))){
  if(existsSync(filename)||!existsSync(path.join(seedDir,'accounts.json')))return false;
  if(!adminPassword||adminPassword.length<12)throw Error('INITIAL_ADMIN_PASSWORD must contain at least 12 characters to initialize the seed.');
  const db=JSON.parse(readFileSync(path.join(seedDir,'accounts.json'),'utf8'));
  const credentials=[];
  for(const user of db.users){
    const password=user.role==='admin'?adminPassword:randomBytes(24).toString('base64url');
    user.salt=randomBytes(16).toString('hex');user.hash=scryptSync(password,user.salt,64).toString('hex');
    credentials.push({username:user.username,role:user.role,password});
  }
  const folder=path.dirname(filename);mkdirSync(folder,{recursive:true});
  if(existsSync(path.join(seedDir,'uploads')))cpSync(path.join(seedDir,'uploads'),path.join(folder,'uploads'),{recursive:true});
  writeFileSync(path.join(folder,'initial-credentials.json'),JSON.stringify(credentials,null,2),{mode:0o600});
  writeFileSync(filename+'.tmp',JSON.stringify(db),{mode:0o600});renameSync(filename+'.tmp',filename);
  console.log('Local learning data initialized. New login credentials are stored privately beside the database in initial-credentials.json.');
  return true;
}
