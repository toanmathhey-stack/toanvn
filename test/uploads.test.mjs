import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createStore} from '../auth-store.mjs';
import {pdfFixture,docxFixture} from '../scripts/document-fixtures.mjs';
const pdf=pdfFixture();
test('teacher uploads persist; same grade and assigned teacher are required for download',()=>{
 const dir=mkdtempSync(path.join(os.tmpdir(),'lesson-upload-')),filename=path.join(dir,'db.json');
 try{
  const store=createStore(filename),password='Upload-fixture-password!';
  const add=(username,role,studentIds=[])=>store.createUser({username,name:username,role,password,studentIds});
  const student=add('student','student'),other=add('other','student'),teacher=add('teacher','teacher',[student.id]),teacher2=add('teacher2','teacher'),parent=add('parent','parent',[student.id]),admin=add('admin','admin');
  const payload={grade:9,title:'Căn bậc hai',description:'Đọc rồi tự kiểm chứng.',filename:'Bài học.pdf',base64:pdf.toString('base64')};
  for(const user of [student,parent,admin])assert.throws(()=>store.uploadLesson(user,payload),{status:403});
  const result=store.uploadLesson(teacher,payload);assert.equal(result.duplicate,false);assert.equal(store.uploadLesson(teacher,payload).duplicate,true);assert.equal(store.uploadedLessons(teacher).length,1);
  assert.equal(store.uploadedLessons(student).length,0);assert.throws(()=>store.uploadedFile(student,result.lesson.id),{status:404});
  store.saveStudent(student,{attempts:[],reviews:{},profile:{name:'Student',grade:'9'}});
  assert.equal(store.uploadedLessons(student).length,1);assert.deepEqual(store.uploadedFile(student,result.lesson.id).content,pdf);
  for(const user of [other,parent,teacher2,admin])assert.throws(()=>store.uploadedFile(user,result.lesson.id),{status:404});
  assert.deepEqual(createStore(filename).uploadedFile(student,result.lesson.id).content,pdf);
  const docx=docxFixture(),word=store.uploadLesson(teacher,{...payload,filename:'Bài học.docx',base64:docx.toString('base64')});assert.deepEqual(store.uploadedFile(student,word.lesson.id).content,docx);
  store.link(admin,{userId:teacher.id,studentIds:[]});assert.throws(()=>store.uploadedFile(student,result.lesson.id),{status:404});
  for(const bad of [{filename:'../a.pdf'},{filename:'run.exe'},{base64:Buffer.from('<script>oops</script>').toString('base64')},{base64:'Zg='},{grade:10},{title:'  '}])assert.throws(()=>store.uploadLesson(teacher,{...payload,...bad}),{status:400});
  assert.throws(()=>store.uploadLesson(teacher,{...payload,filename:'test.docx',base64:Buffer.from('P').toString('base64')}),{status:400});
  assert.throws(()=>store.uploadLesson(teacher,{...payload,base64:Buffer.alloc(10*1024*1024+1).toString('base64')}),{status:413});
 }finally{rmSync(dir,{recursive:true,force:true});}
});
