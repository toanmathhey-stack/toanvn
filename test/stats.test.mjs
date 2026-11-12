import {test} from 'node:test';
import assert from 'node:assert/strict';
import {learningStats} from '../public/learning-stats.js';
test('completion counts unique exercises, mistakes count attempts and other grades stay out of current report',()=>{
 const state={attempts:[{exerciseId:'a',skill:'s',time:1,completed:2,corrected:true,initialCorrect:false},{exerciseId:'a',skill:'s',time:3,completed:4,initialCorrect:true},{exerciseId:'old',skill:'other',time:4,completed:5,initialCorrect:false}],reviews:{a:{due:20},old:{due:10}}};
 const result=learningStats(state,[{id:'a',skill:'s'},{id:'b',skill:'s'}],[{id:'s'}],15);
 assert.equal(result.completed,1);assert.equal(result.discovered,1);assert.equal(result.corrected,1);assert.equal(result.bySkill.s.total,2);assert.equal(result.bySkill.s.count,2);assert.equal(result.bySkill.s.percent,50);assert.equal(result.due.length,0);assert.equal(result.scheduled,1);
});
