const fs = require('fs');
const path = require('path');
const dir = __dirname;

function loadArr(file){
  const code = fs.readFileSync(path.join(dir,file),'utf8');
  const m = code.match(/const\s+\w+\s*=\s*(\[[\s\S]*\])\s*;?\s*$/);
  return eval(m[1]);
}
function dedupByW(arr){ const s=new Set(); return arr.filter(x=> s.has(x.w) ? false : (s.add(x.w), true)); }

const W4 = dedupByW(loadArr('words4.js'));
const W6 = dedupByW(loadArr('words6.js'));
const EX = dedupByW(loadArr('words_extra.js'));
const AD = dedupByW(loadArr('words_advanced.js'));
const CF = loadArr('confused.js');

// 1. 字段完整性
let problems = 0;
function checkArr(arr, name){
  arr.forEach((x,i)=>{
    if(!x.w || !x.m){ console.log(name+'['+i+'] 缺 w/m:', JSON.stringify(x)); problems++; }
  });
}
checkArr(W4,'W4'); checkArr(W6,'W6'); checkArr(EX,'EX'); checkArr(AD,'AD');
CF.forEach((x,i)=>{ if(!x.w||!x.m||!x.note||!x.q||!x.a||!x.opts){ console.log('CF['+i+'] 缺字段:',JSON.stringify(x)); problems++; } });

// 2. 例句是否含单词的某种词形（cloze 挖空校验）
function escReg(s){ return String(s).replace(/[.*+?^${}()|[\]\\]/g,"\\$&"); }
function inflectCandidates(word){
  const set = new Set([word, word+"s", word+"es", word+"ed", word+"d", word+"ing"]);
  const last = word.slice(-1);
  set.add(word+last+"ed"); set.add(word+last+"ing");
  if(/[^aeiou]y$/i.test(word)){ const s=word.slice(0,-1); set.add(s+"ies"); set.add(s+"ied"); }
  if(/e$/i.test(word)){ const s=word.slice(0,-1); set.add(s+"ing"); set.add(s+"ed"); set.add(s+"es"); }
  const IRREG={arise:["arose","arisen"],rise:["rose","risen"],overcome:["overcame"],undertake:["undertook","undertaken"],withdraw:["withdrew","withdrawn"],seek:["sought"],choose:["chose","chosen"],bear:["bore","borne"],wear:["wore","worn"],fall:["fell","fallen"],lead:["led"],hold:["held"],stand:["stood"],understand:["understood"]};
  (IRREG[word.toLowerCase()]||[]).forEach(f=>set.add(f));
  return [...set].sort((a,b)=>b.length-a.length);
}
function checkSent(arr,name){
  arr.forEach((x,i)=>{
    if(x.s){
      let ok=false;
      for(const c of inflectCandidates(x.w)){ if(new RegExp("\\b"+escReg(c)+"\\b","i").test(x.s)){ ok=true; break; } }
      if(!ok){ console.log(name+'['+i+'] 例句不含单词任何词形 "'+x.w+'": '+x.s); problems++; }
    }
  });
}
checkSent(W4,'W4'); checkSent(W6,'W6');

// 3. 易混词选项是否含答案
CF.forEach((x,i)=>{ if(!x.opts.includes(x.a)){ console.log('CF['+i+'] 选项不含答案 "'+x.a+'":', x.opts); problems++; } });

// 4. 键唯一性（合并后：普通词用 w，易混词 w#idx）
function keyCheck(arr, name, isConf){
  const keys = new Set();
  arr.forEach((x,i)=>{
    const k = isConf ? (x.w+'#'+i) : x.w;
    if(keys.has(k)){ console.log(name+' 重复键: '+k); problems++; }
    keys.add(k);
  });
}
keyCheck(W4,'W4',false); keyCheck(W6,'W6',false); keyCheck(EX,'EX',false); keyCheck(AD,'AD',false); keyCheck(CF,'CF',true);

// 5. 合并去重统计
const MERGED = dedupByW([].concat(W4, W6, EX, AD)).concat(CF);
const noP4 = W4.filter(x=>!x.p).length;
const noP6 = W6.filter(x=>!x.p).length;
const noPEX = EX.filter(x=>!x.p).length;
const noPAD = AD.filter(x=>!x.p).length;

console.log('=== 结果 ===');
console.log('四级:', W4.length, '词, 缺音标:', noP4);
console.log('六级:', W6.length, '词, 缺音标:', noP6);
console.log('追加:', EX.length, '词, 缺音标:', noPEX);
console.log('高阶主题词:', AD.length, '词, 缺音标:', noPAD);
console.log('易混词:', CF.length, '组');
console.log('合并去重后总量:', MERGED.length, '词');
console.log('发现问题数:', problems);
console.log(problems===0 ? '✅ 数据校验通过' : '❌ 存在需修复的问题');
