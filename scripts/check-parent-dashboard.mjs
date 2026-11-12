import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {createTestApp} from './browser-fixture.mjs';
import {exercises} from '../public/data.js';
const app=await createTestApp(),{accounts}=await import('../server.mjs'),browser=await chromium.launch({channel:'msedge',headless:true});
const password='Isolated-test-password-123!',child=accounts.users().find(u=>u.role==='student'),teacher=accounts.users().find(u=>u.role==='teacher');
const second=accounts.createUser({username:'sibling',name:'Nguyễn Hà My',password,role:'student'}),outsider=accounts.createUser({username:'outsider',name:'Private student',password,role:'student'});
accounts.createUser({username:'parent',name:'Chị Lan',password,role:'parent',studentIds:[child.id,second.id]});accounts.createUser({username:'emptyparent',name:'Parent without link',password,role:'parent'});
accounts.learning.createClass(teacher,{name:'7A',grade:7,studentIds:[child.id]});
for(const [i,title] of ['Quy tắc dấu và số nguyên','Luyện tập tỉ lệ thuận','Góc trong tam giác','Bài luyện tổng hợp'].entries())accounts.learning.assignSet(teacher,{studentId:child.id,title,due:'2026-12-0'+(i+1),exerciseIds:['sign-1','ratio7-1','angles7-1','sign-2']});
accounts.workspace(child).state.assignments.forEach(a=>a.created=Date.now()-6*86400000);
const attempts=['sign-1','ratio7-1','angles7-1'].map((id,i)=>{const e=exercises.find(e=>e.id===id);return{id:crypto.randomUUID(),exerciseId:id,skill:e.skill,answer:i===1?'999':e.answer,working:'Em đã tính từng bước.',initialCorrect:true,corrected:false,time:Date.now()-(5-i)*86400000,mode:'practice'};});accounts.saveStudent(child,{attempts,reviews:{}});
accounts.learning.reviewDiagnosis(teacher,{studentId:child.id,attemptId:attempts[1].id,type:'concept',evidence:'Em đã tính từng bước.',reason:'Cần làm rõ quan hệ tỉ lệ thuận.',nextStep:'Giáo viên kiểm tra cách tìm hệ số.'});
const page=await browser.newPage({viewport:{width:1536,height:1024}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await app.login(page,'parent');await page.goto(app.base);await page.locator('#pd-child').waitFor();await page.locator('.pd-hero h1').waitFor();const data=await (await page.request.get(app.base+'/api/learning/parent-dashboard')).json();assert.equal(data.completion,75);assert.equal(data.average,5);assert.equal(data.wrong,1);assert.equal(data.children.length,2);
 await page.screenshot({path:'artifacts/parent-dashboard-desktop.png',fullPage:true});
 await page.locator('#pd-days').selectOption('30');await page.waitForFunction(()=>document.querySelector('#pd-days')?.value==='30');
 for(const [route,heading] of [['parent/results','Kết quả học tập của Nguyễn Minh'],['parent/progress','Báo cáo tiến bộ của Nguyễn Minh'],['parent/assignments','Lịch học - Bài tập'],['parent/notifications','Cập nhật của Nguyễn Minh'],['parent/child','Hồ sơ con']]){await page.locator(`#navigation a[href="#${route}"]`).click();await page.getByRole('heading',{name:heading,exact:true,level:1}).waitFor();assert.equal(await page.locator('a[href^="#learn/"]').count(),0);}
 await page.goto(app.base+'/#home');await page.locator('#pd-child').selectOption(second.id);await page.locator('.pd-hero h1').filter({hasText:'Nguyễn Hà My'}).waitFor();assert.ok((await page.locator('.pd-metrics').textContent()).includes('—'));assert.equal(await page.locator('.pd-task').count(),0);
 await page.locator('#navigation a[href="#learning"]').click();await page.getByText('Chưa ghi nhận đáp án sai.',{exact:true}).waitFor();assert.equal(await page.locator('[data-review],[data-analyze],#personal-insight').count(),0);
 await page.goto(app.base+'/#home');await page.locator('#pd-child').selectOption(child.id);await page.locator('.pd-hero h1').filter({hasText:'Nguyễn Minh'}).waitFor();await page.locator('#search-input').fill('tỉ lệ');await page.locator('#global-search').evaluate(f=>f.requestSubmit());await page.locator('.pd-search-results').getByText('Luyện tập tỉ lệ thuận',{exact:true}).waitFor();
 assert.equal((await page.request.get(app.base+'/api/learning/parent-dashboard?studentId='+outsider.id)).status(),403);for(const route of ['assign','review','classes'])assert.equal((await page.request.post(app.base+'/api/learning/'+route,{data:{}})).status(),403);
 await page.goto(app.base+'/#home');await page.locator('.pd-hero').waitFor();await page.setViewportSize({width:390,height:844});await page.screenshot({path:'artifacts/parent-dashboard-mobile.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await app.login(page,'emptyparent');await page.reload();await page.getByRole('heading',{name:'Chưa có hồ sơ con được liên kết'}).waitFor();assert.deepEqual(errors,[]);
 console.log('PASS: parent layout, real metrics, chart period, linked-child switch, sidebar routes, search, empty states, read-only permissions and mobile.');
}finally{await browser.close();await app.close();}
