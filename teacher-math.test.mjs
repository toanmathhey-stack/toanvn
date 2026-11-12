import {test} from 'node:test';
import assert from 'node:assert/strict';
import {promptHTML} from './public/math.js';
test('Dashboard exercise titles render delimited mathematics without richPrompt metadata',()=>{
 for(const prompt of [String.raw`Tính \(\frac{1}{2}\).`,String.raw`Tính $$\sqrt{9}$$.`,String.raw`Giải \[x^{2}=4\].`]){
   const html=promptHTML({prompt});assert.match(html,/class="katex"/);assert.doesNotMatch(html,/math-fallback/);
 }
 assert.match(promptHTML({prompt:String.raw`<img src=x onerror=alert(1)> \(x^2\)`}),/&lt;img/);
});
