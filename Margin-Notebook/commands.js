(function(root){
const colors={white:'#ffffff',cream:'#fffbea',ivory:'#fffbea',yellow:'#fff3ae',gold:'#ffedaa',lavender:'#eee5ff',lilac:'#eee5ff',purple:'#ecddff',violet:'#ecddff',blue:'#dfedff',sky:'#e0f0ff',cyan:'#d6f5f9',teal:'#d2f2eb',green:'#e0f5db',mint:'#dcf6e9',sage:'#e1efdf',pink:'#ffe3ee',rose:'#ffe0e6',peach:'#ffe4ce',orange:'#ffe2bd',red:'#ffdada',gray:'#e8ebef',grey:'#e8ebef',beige:'#f4ecd9',default:'#fffefa'};
const nums={a:1,an:1,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,dozen:12};
function banana(text){let total=0;const re=/\b(?:(\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten|dozen)[ \t]+)?bananas?\b(?:[ \t]*[:=×x][ \t]*(\d+))?/gi;for(const m of text.matchAll(re)){const n=(m[1]||'').toLowerCase();total+=m[2]!==undefined?Number(m[2]):n?(nums[n]??Number(n)):1;}return total;}
function clean(q){return q.trim().replace(/[.!?]+$/,'').trim();}
function parse(raw){const src=clean(raw),s=src.toLowerCase();
if(/^(?:please\s+)?(?:undo|revert|take (?:it|that) back|go back)\b/.test(s))return {act:'undo'};
if(/^(?:please\s+)?redo\b/.test(s))return {act:'redo'};
if(!s||/^(?:help|examples|commands|what can|how (?:can|do)|show examples)/.test(s))return {act:'help'};
const cc=Object.keys(colors).find(c=>new RegExp('\\b'+c+'\\b').test(s));const hex=s.match(/#([a-f\d]{6}|[a-f\d]{3})\b/i);
if((cc||hex)&&!/(?:add|insert|create|place|remove|delete)\b.{0,35}\b(?:button|counter|clock|timer)\b/.test(s)){
if(hex&&!cc){let h=hex[1];if(h.length===3)h=[...h].map(v=>v+v).join('');const rgb=[0,2,4].map(i=>parseInt(h.slice(i,i+2),16));return {act:'paint',name:'#'+h,color:'#'+h,dark:(.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2])<145};}return {act:'paint',name:cc,color:colors[cc]};}
if(/\b(colou?r|background|paper shade)\b/.test(s)&&!/\b(button|counter|timer|clock)\b/.test(s))return {act:'palette'};
let type=/\bbananas?\b/.test(s)&&/\b(counter|count|total|track|tally)\b/.test(s)?'banana':/\b(counter|tally|clicker)\b/.test(s)?'counter':/\b(clock|time of day)\b/.test(s)?'clock':/\b(timer|countdown)\b/.test(s)?'timer':/\bbutton\b/.test(s)?'button':null;
if(/\b(delete|remove|discard|take (?:out|away))\b/.test(s)&&!/\b(button (that|to|which))\b/.test(s))return {act:'remove',type};
if(!type)return {act:'help'};
if(type==='button'&&/\b(that|which|to)\s+(?:will\s+)?(?:send|email|delete|open|run|call|remove|download|upload|play|navigate|change|save|reset)\b/.test(s))return {act:'unsupportedButton'};
let where=/\b(top|beginning|start of (?:the |my )?(?:page|note|notebook))\b/.test(s)?'top':/\b(bottom|end of (?:the |my )?(?:page|note|notebook))\b/.test(s)?'bottom':/\b(above|before)\b/.test(s)?'before':'after';
let line=s.match(/\b(?:line|paragraph|row)\s*#?\s*(\d+)\b/);let ord=s.match(/\b(first|second|third|fourth|fifth|last)\s+(?:line|paragraph|row)\b/);
const numbered=line?Number(line[1]):ord?({first:1,second:2,third:3,fourth:4,fifth:5,last:-1})[ord[1]]:null;
const quoted=src.match(/["“]([^"”]{1,60})["”]/)||src.match(/(?:^|\s)'([^']{1,60})'/);
const named=src.match(/\b(?:called|named|labelled|labeled|saying|that says|with (?:the )?(?:text|label))\s+(.+?)(?=\s+(?:at the|above|below|after|before|on (?:this|the)|in (?:this|the))\b|$)/i);
let min=s.match(/\b(\d+(?:\.\d+)?)\s*[- ]?\s*(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h)\b/);if(!min)min=s.match(/\b(\d+(?:\.\d+)?)\s*[- ]?\s*(second|minute|hour)\b/);let secs= min?Number(min[1])*(min[2].startsWith('s')?1:min[2].startsWith('h')?3600:60):300;
return {act:'add',type,where,line:numbered,align:/\bright\b/.test(s)?'right':/\bcent(?:er|re)\b/.test(s)?'center':'left',label:(quoted?.[1]||named?.[1]||'').replace(/^["“']|["”']$/g,'').slice(0,60),seconds:Math.max(1,Math.min(86400,Math.round(secs)))};
}const api={parse,banana};root.MarginCommands=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
