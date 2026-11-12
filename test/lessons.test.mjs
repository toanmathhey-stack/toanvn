import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createStore} from '../auth-store.mjs';
import {demoLessons} from '../public/demo-lessons.js';
import {exercises,checkAnswer} from '../public/data.js';
import {studentLessonsHTML,teacherLibraryHTML} from '../public/lesson-library.js';
test('demo provides five lessons and fifteen practice placements per grade, valid answers and rendered math',()=>{
  assert.equal(new Set(demoLessons.map(l=>l.id)).size,20);
  for(const grade of [6,7,8,9]){
    const lessons=demoLessons.filter(l=>l.grade===grade);assert.equal(lessons.length,5);
    assert.equal(new Set(lessons.flatMap(l=>l.exerciseIds)).size,15);
    for(const lesson of lessons)for(const id of lesson.exerciseIds){const ex=exercises.find(e=>e.id===id);assert.ok(ex.grades.includes(grade));assert.equal(checkAnswer(ex.wrong,ex.answer),false,id);}
    assert.doesNotMatch(studentLessonsHTML(grade,demoLessons),/math-fallback|katex-error/);
  }
  assert.doesNotMatch(teacherLibraryHTML([]),/math-fallback|katex-error/);
});
test('teacher import persists, is idempotent, and leaves student state untouched',()=>{
  const dir=mkdtempSync(path.join(os.tmpdir(),'math-lessons-')),file=path.join(dir,'db.json');
  try{const store=createStore(file),password='Fixture-only-password-123';
    const student=store.createUser({username:'student',name:'Student',password,role:'student'}),teacher=store.createUser({username:'teacher',name:'Teacher',password,role:'teacher',studentIds:[student.id]});
    const before=JSON.stringify(store.workspace(student));
    for(const role of ['student','parent','admin'])assert.throws(()=>store.importLessons({...student,role}),{status:403});
    assert.deepEqual(store.importLessons(teacher),{added:20,total:20});assert.deepEqual(store.importLessons(teacher),{added:0,total:20});
    assert.equal(JSON.stringify(store.workspace(student)),before);assert.equal(createStore(file).lessonPublications().length,20);
  }finally{rmSync(dir,{recursive:true,force:true});}
});
