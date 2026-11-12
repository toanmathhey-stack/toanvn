import {createStore} from '../auth-store.mjs';
import {randomBytes} from 'node:crypto';
const [username,role,name,...studentIds]=process.argv.slice(2);
if(!username||!role||!name){console.error('node scripts/create-account.mjs <username> <student|teacher|parent|admin> <name> [studentId ...]');process.exit(1);}
const password=process.env.ACCOUNT_PASSWORD||randomBytes(18).toString('base64url');
const user=createStore().createUser({username,role,name,password,studentIds});
console.log(JSON.stringify({...user,password},null,2));
