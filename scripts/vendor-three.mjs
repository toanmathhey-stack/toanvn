import {mkdir,copyFile,readFile,writeFile} from 'node:fs/promises';
const src=new URL('../node_modules/three/',import.meta.url),dest=new URL('../public/vendor/three/',import.meta.url);
await mkdir(dest,{recursive:true});
for(const file of ['three.module.js','three.core.js'])await copyFile(new URL('build/'+file,src),new URL(file,dest));
await copyFile(new URL('LICENSE',src),new URL('LICENSE',dest));
const renderer=await readFile(new URL('examples/jsm/renderers/CSS3DRenderer.js',src),'utf8');
await writeFile(new URL('CSS3DRenderer.js',dest),renderer.replace(/from 'three'/g,"from './three.module.js'"));
console.log('Three.js and CSS3DRenderer copied locally.');
