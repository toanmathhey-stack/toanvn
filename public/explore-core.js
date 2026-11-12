export const rounded=n=>Math.round(n*1e8)/1e8;
export function rectangleMetrics({aw,ah,bw,bh}){return {pa:rounded(2*(aw+ah)),sa:rounded(aw*ah),pb:rounded(2*(bw+bh)),sb:rounded(bw*bh)};}
export function isCounterexample(data){const {pa,pb,sa,sb}=rectangleMetrics(data);return pa>pb&&sa<=sb;}
export function gardenMetrics(a){return {a,b:24-2*a,area:rounded(a*(24-2*a)),fence:24};}
