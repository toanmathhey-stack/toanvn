import test from 'node:test';
import assert from 'node:assert/strict';
import {rectangleMetrics,isCounterexample,gardenMetrics} from '../public/explore-lab.js';
test('counterexamples include equal area but require strictly greater perimeter',()=>{
  assert.deepEqual(rectangleMetrics({aw:10,ah:1,bw:5,bh:5}),{pa:22,sa:10,pb:20,sb:25});
  assert.ok(isCounterexample({aw:10,ah:1,bw:5,bh:5}));
  assert.ok(isCounterexample({aw:8,ah:2,bw:4,bh:4}));
  assert.equal(isCounterexample({aw:6,ah:4,bw:5,bh:5}),false);
  assert.equal(rectangleMetrics({aw:.1,ah:.2,bw:.2,bh:.1}).sa,.02);
});
test('garden uses 24 metres on three sides and peaks at 72 square metres',()=>{
  assert.deepEqual(gardenMetrics(6),{a:6,b:12,area:72,fence:24});
  for(let a=.5;a<=11.5;a+=.5){const d=gardenMetrics(a);assert.equal(2*a+d.b,24);assert.ok(d.b>0);assert.ok(d.area<=72);}
});
