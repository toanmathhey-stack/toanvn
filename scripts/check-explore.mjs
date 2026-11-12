import {createTestApp} from './browser-fixture.mjs';
const testApp=await createTestApp();
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext({viewport:{width:1536,height:1024}});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const route=async kind=>{await page.goto(testApp.base+'/#explore/'+kind);await page.locator('[data-renderer="webgl"] canvas').waitFor();};
try{
  await testApp.login(page);
  await route('counter');
  for(const [id,value] of [['A-w',10],['A-h',1],['B-w',5],['B-h',5]])await page.locator('#'+id).fill(String(value));
  await page.locator('#counter-explain').fill('Chu vi A lon hon B nhung dien tich A nho hon B.');
  await page.locator('#counter-form button').click();
  assert.equal(await page.locator('#counter-result .feedback:not(.warn)').count(),1);
  await page.locator('[data-scene-view="top"]').click();
  assert.equal(await page.locator('[data-scene-view="top"]').getAttribute('aria-pressed'),'true');
  await page.locator('[data-scene-reset]').click();
  await page.screenshot({path:'artifacts/explore-counter.png',fullPage:true});
  await page.locator('#A-w').fill('');
  assert.equal(await page.locator('#A-w').getAttribute('aria-invalid'),'true');
  assert.doesNotMatch(await page.locator('#counter-preview').textContent(),/NaN/);
  await route('garden');
  await page.locator('#garden-a').evaluate(el=>{el.value='6';el.dispatchEvent(new Event('input',{bubbles:true}));});
  assert.match(await page.locator('#garden-area annotation').textContent(),/72/);
  await page.locator('[data-save-garden]').click();await page.locator('[data-save-garden]').click();
  assert.equal(await page.locator('.garden-trial').count(),1);
  await page.screenshot({path:'artifacts/explore-garden.png',fullPage:true});
  await route('blackbox');
  await page.locator('#guess').fill('2x+3');await page.locator('#guess-form button').click();
  assert.equal(await page.locator('#box-result .warn').count(),1);
  for(const x of [0,2]){await page.locator('#box-input').fill(String(x));await page.locator('#box-form button').click();}
  assert.match(await page.locator('#machine-preview').textContent(),/7/);
  await page.locator('#guess-form button').click();assert.equal(await page.locator('#box-result .warn').count(),0);
  await page.waitForTimeout(1600);await page.screenshot({path:'artifacts/explore-blackbox.png',fullPage:true});
  for(const width of [360,390,768]){await page.setViewportSize({width,height:844});for(const kind of ['counter','garden','blackbox']){await route(kind);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${kind} overflow ${width}`);if(width===390)await page.screenshot({path:`artifacts/explore-${kind}-mobile.png`,fullPage:true});}}
  await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.locator('[data-renderer="webgl"] canvas').first().waitFor();await context.setOffline(true);await page.locator('[data-renderer="webgl"] canvas').waitFor();await context.setOffline(false);
  await page.locator('canvas').evaluate(c=>c.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
  await page.locator('[data-renderer="fallback"] svg').waitFor();assert.ok(await page.locator('[data-scene-reset]').isDisabled());
  await page.goto(testApp.base+'/#practice');assert.equal(await page.locator('.scene-canvas-host').count(),0);
  assert.deepEqual(errors,[]);console.log('PASS exploration: WebGL, inputs, math, controls, mobile, offline, context loss and teardown');
}finally{await browser.close();await testApp.close();}
