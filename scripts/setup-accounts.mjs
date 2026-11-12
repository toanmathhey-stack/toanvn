import {createStore} from '../auth-store.mjs';
import {randomBytes} from 'node:crypto';
import {mkdirSync,writeFileSync} from 'node:fs';
const store=createStore();
if(store.users().length){console.error('Đã có tài khoản. Dùng trang quản trị để tạo thêm.');process.exit(1);}
const created=[];
function add(username,role,name,studentIds=[]){const password=randomBytes(18).toString('base64url');const user=store.createUser({username,password,role,name,studentIds});created.push({...user,password});return user;}
const student=add('hocsinh','student','Nguyễn Minh');
add('giaovien','teacher','Giáo viên Toán',[student.id]);
add('phuhuynh','parent','Phụ huynh Nguyễn Minh',[student.id]);
add('quantri','admin','Quản trị hệ thống');
mkdirSync('private',{recursive:true});
writeFileSync('private/tai-khoan-ban-dau.md','# Tài khoản ban đầu\n\nMỗi tài khoản có mật khẩu ngẫu nhiên riêng. Không đưa file này vào thư mục public hoặc chia sẻ cho học sinh.\n\n'+created.map(u=>`- **${u.name}** (${u.role})\n  - Tên đăng nhập: \`${u.username}\`\n  - Mật khẩu: \`${u.password}\`\n`).join('\n'),{mode:0o600});
console.log('Đã tạo 4 tài khoản. Thông tin đăng nhập: private/tai-khoan-ban-dau.md');
