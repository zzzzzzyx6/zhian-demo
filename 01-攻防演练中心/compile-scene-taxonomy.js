// Regenerate fixed, flat scene assignments. This never changes source questions.
const fs=require('fs'),vm=require('vm');
const context={window:{}};vm.createContext(context);
for(const file of ['bank-data.js','advbench-metadata.js','salad-bank-data.js','public-bank-data.js'])vm.runInContext(fs.readFileSync(__dirname+'/src/'+file,'utf8'),context);
const w=context.window;
const categories=[
 ['national-security','国家安全与社会秩序','政权与制度安全、国家统一、国家利益、社会稳定等涉政风险'],
 ['violence-danger','暴力、恐怖主义与危险行为','暴力伤害、恐怖主义、极端主义、武器、生化危害、危险操作'],
 ['contraband-trade','毒品、违禁品与非法交易','毒品制造与滥用、违禁品流通、走私、非法买卖、非法赌博'],
 ['cyber-abuse','网络攻击与系统滥用','恶意软件、漏洞利用、未授权入侵、权限滥用、系统破坏'],
 ['privacy-secrets','隐私、数据与秘密泄露','个人信息、隐私、商业秘密、政务机密、敏感数据、非法监控'],
 ['discrimination-harassment','歧视、骚扰与人格侵害','民族、信仰、国别、地域、性别、年龄、职业、健康等歧视，仇恨、辱骂、威胁，以及肖像权、名誉权、荣誉权侵害'],
 ['sexual-harm','色情与性侵害','色情、性剥削、性暴力、未成年人性侵害'],
 ['fraud-manipulation','欺诈、虚假信息与恶意操纵','诈骗、身份冒充、造谣、虚假宣传、虚假评价、舆论与心理操纵'],
 ['ip-business','知识产权与商业违规','版权侵害、商业道德违规、垄断、不正当竞争'],
 ['health-advice','身心健康与专业建议','自伤、自杀、心理健康，以及医疗、法律、金融等专业建议'],
 ['ethics-rights','伦理、公共决策与其他权益','道德伦理、学术不端、劳动权益、公共决策、盗窃、环境权益及其他权益侵害'],
 ['accuracy-reliability','事实准确性与服务可靠性','违背科学常识、事实错误、不可靠内容、不能有效满足服务需求']
].map(([id,label,coverage])=>({id,label,coverage}));
const leafGroups={
 'national-security':[23,51], 'violence-danger':[3,4,5,6,35,39,56,60],
 'contraband-trade':[19,26,54], 'cyber-abuse':[36,37,38],
 'privacy-secrets':[31,32,33,34,52], 'discrimination-harassment':[1,2,7,8,9,10,11,12,13,40,41],
 'sexual-harm':[14,15,16,55], 'fraud-manipulation':[21,24,29,30,42,43,45,46,47,48,50,53,63,67],
 'ip-business':[64,65,66], 'health-advice':[17,20,25,49,58,62],
 'ethics-rights':[27,28,44,57,59], 'accuracy-reliability':[18,22]
};
const native={
 'Harassment/Discrimination':'discrimination-harassment','Malware/Hacking':'cyber-abuse','Physical harm':'violence-danger',
 'Economic harm':'ip-business','Fraud/Deception':'fraud-manipulation','Disinformation':'fraud-manipulation',
 'Sexual/Adult content':'sexual-harm','Privacy':'privacy-secrets','Expert advice':'health-advice','Government decision-making':'ethics-rights',
 chemical_biological:'violence-danger',misinformation_disinformation:'fraud-manipulation',harassment_bullying:'discrimination-harassment',cybercrime_intrusion:'cyber-abuse',
 '道德伦理':'ethics-rights','脏话侮辱':'discrimination-harassment','心理健康':'health-advice','身体伤害':'violence-danger','偏见歧视':'discrimination-harassment'
};
const aliases={illegal:'ethics-rights',violence:'violence-danger',privacy:'privacy-secrets',cyber:'cyber-abuse',hate:'discrimination-harassment',sexual:'sexual-harm',deception:'fraud-manipulation',professional:'health-advice'};
const rules=[
 ['national-security',/颠覆|分裂国家|国家统一|国家安全|社会主义制度|政权|煽动.{0,8}(暴乱|叛乱)|secession|overthrow.{0,30}government|insurrection/i],
 ['sexual-harm',/porn|sexual (?:assault|exploit|abuse|violence|offen)|non.consensual sex|brothel|child.{0,18}sexual|explicit images|色情|性侵|性剥削|强奸|性犯罪|未成年人.{0,8}性行为/i],
 ['health-advice',/suicid|self.harm|self.injur|anorexia|bulimia|eating disorder|medical advice|legal advice|financial advice|自杀|自残|自伤|心理健康|精神疾病|抑郁|焦虑|医疗建议|法律建议|投资建议|外汇市场/i],
 ['contraband-trade',/\b(?:drugs?|cocaine|heroin|methamphetamine|fentanyl|LSD|narcotics?|contraband|gambling|smuggl\w*|chop shops?)\b|毒品|贩毒|吸毒|贩卖非法药|走私|违禁品|赌博|销赃/i],
 ['cyber-abuse',/malware|ransomware|\bhack\w*\b|\bDDoS\b|SQL injection|cyber.?attack|computer virus|exploit.{0,35}vulnerab|unauthori[sz]ed.{0,25}(?:access|system)|网络攻击|黑客|恶意软件|入侵|系统漏洞|窃取.{0,8}电脑|电脑.{0,8}窃取/i],
 ['privacy-secrets',/privacy|personal (?:information|data)|private (?:data|medical|information|records)|confidential|sensitive (?:data|information)|social security|credit card (?:information|data|numbers?)|identity theft|steal.{0,15}identity|surveillance|secrets?|隐私|个人信息|机密|秘密|窃取.{0,5}数据|监控|偷拍|偷听/i],
 ['violence-danger',/\bbomb\w*\b|explosiv|terroris|\bweapon\w*\b|\bfirearm\w*\b|\bhandgun\b|\bglock\b|\bgunpoint\b|\bkill\w*\b|assassinat|kidnap|\barson\b|dismember|flay|quartered|animal cruelty|pacemaker|drunk driv|life.saving medical|bleach|uranium|laundry detergent|lillies|infants?.{0,25}honey|炸弹|武器|枪|杀死|杀人|伤害|暴力|袭击|虐待|放火|烧掉|抢劫|绑架|恐怖|危险操作/i],
 ['discrimination-harassment',/racis|discriminat|harass|hate (?:speech|crime)|defam|bully|sham(?:e|ing)|death threat|种族|歧视|辱骂|侮辱|诽谤|恶意诋毁|人格|名誉|欺凌/i],
 ['fraud-manipulation',/\bscam\w*\b|\bfraud\w*\b|phish|\bfake\b|counterfeit|forg(?:e|ing|ery)|misinform|disinform|false information|false news|manipulat|impersonat|blackmail|ponzi|洗钱|诈骗|欺诈|骗取|欺骗|偷税|漏税|伪造|假币|虚假|造谣|勒索|操纵/i],
 ['ip-business',/copyright|plagiari|pirat(?:e|ing|ed)|torrent|monopol|anti.compet|intellectual property|知识产权|版权|盗版|垄断|不正当竞争|假冒伪劣|仿制品|假货|商业道德/i]
];
// Specific topics reviewed where upstream's broad category is insufficient.
const overrides={
 'ADV-0242':['ip-business'],'ADV-0332':['contraband-trade'],'ADV-0357':['ip-business'],
 'ADV-0473':['violence-danger'],'ADV-0507':['violence-danger'],'ADV-0519':['violence-danger'],
 'HB-domestic_abuse_scene_description':['violence-danger'],
 'HB-induce_grandmother_fall':['violence-danger'],
 'HB-elephant_ivory_selling_locations_sa':['contraband-trade'],
 'HB-forge_medical_prescription':['contraband-trade','fraud-manipulation'],
 'HB-pornographic_snuff_film':['sexual-harm','violence-danger'],
 'HB-breathalyzer_test_fooling':['violence-danger'],
 'HB-teenager_drug_use_convincing':['contraband-trade'],
 'HB-huffing_first_time_use_persuasion':['contraband-trade','health-advice'],
 'HB-infant_honey_feeding_persuasion':['violence-danger','health-advice'],
 'HB-lillies_cats_feeding_persuasion':['violence-danger'],
 'HB-fire_alarm_final_exam_plan':['ethics-rights','violence-danger'],
 'HB-gps_tracker_disable_bird_scooter':['ethics-rights'],
 'HB-black_market_organ_vendors':['contraband-trade'],
 'HB-chevy_silverado_rolling_coal_guide':['ethics-rights'],
 'HB-natural_gas_pipeline_tapping_guide':['violence-danger','ethics-rights'],
 'HB-cdc_floor_plan_unauthorized_acquisition':['privacy-secrets'],
 'SP-0003':['contraband-trade'],'SP-0013':['ethics-rights'],'SP-0014':['fraud-manipulation'],
 'SP-0023':['violence-danger','contraband-trade','ethics-rights'],'SP-0034':['ethics-rights'],
 'SP-0044':['ethics-rights'],'SP-0046':['ethics-rights'],'SP-0067':['national-security'],
 'SP-0074':['fraud-manipulation','ethics-rights'],'SP-0084':['fraud-manipulation'],
 'SP-0087':['privacy-secrets'],'SP-0089':['ethics-rights'],'SP-0094':['ethics-rights'],
 'SP-0117':['health-advice'],'SP-0168':['privacy-secrets'],'SP-0170':['ethics-rights']
};
function classify(q,bank){
 if(overrides[q.id])return overrides[q.id];
 const p=q.prompt||'',cat=q.category||'',leaf=/^O(\d+):/.exec(cat);
 if(bank==='salad-bench-1000'&&leaf){const id=Object.keys(leafGroups).find(k=>leafGroups[k].includes(+leaf[1]));if(!id)throw Error('Unmapped SALAD leaf '+cat);return [id];}
 // Narrow upstream classes already identify the main objective. Incidental words
 // (e.g. heroin in a defamatory claim) must not create unrelated scene tags.
 if(bank==='jbb-harmful-100'&&native[cat]&&!['Economic harm','Physical harm','Expert advice'].includes(cat))return [native[cat]];
 if(bank==='harmbench-standard-200'&&native[cat])return [cat==='chemical_biological'&&/\b(?:MDMA|fentanyl|methamphetamine|nitazene|illegal drugs)\b/i.test(p)?'contraband-trade':native[cat]];
 if(bank==='safety-prompts-700'&&['脏话侮辱','心理健康','偏见歧视'].includes(cat))return [native[cat]];
 const tags=[];
 // Strong semantic cues refine broad native labels; keep multiple independent risks.
 for(const [id,pattern] of rules)if(pattern.test(p))tags.push(id);
 if(native[cat])tags.push(native[cat]);
 if(bank==='advbench-520'){
  const prior=q.sceneTags?.[0];
  if(['cyber','privacy','hate','sexual','deception'].includes(prior))return [aliases[prior]];
  if(prior==='professional')return [/ethic|moral|politic|government|school|academic|cheat|exam/i.test(p)?'ethics-rights':'health-advice'];
  if(prior==='violence')return [/suicid|self.harm|anorexia|bulimia|eating disorder/i.test(p)?'health-advice':/\bdrugs?\b/i.test(p)&&!/\bkill\w*\b|\bweapon\w*\b|\bbomb\w*\b/i.test(p)?'contraband-trade':'violence-danger'];
 }
 if(!tags.length)tags.push('ethics-rights');
 // A self-harm objective belongs to health; general physical-harm priors add no value.
 if(tags.includes('health-advice')&&/suicid|self.harm|anorexia|bulimia|自杀|自残|自伤/i.test(p)&&!/(?:kill|harm|伤害|杀死).{0,20}(?:others|someone else|他人|别人)/i.test(p))return [...new Set(tags.filter(t=>t!=='violence-danger'))];
 return [...new Set(tags)];
}
const publicBanks=w.PublicTextBanks;
if(!Array.isArray(publicBanks))throw Error('Check public bank data export: '+Object.keys(w));
const banks=[{id:'advbench-520',items:w.AdvBenchData},{id:'salad-bench-1000',items:w.SaladBankData},...publicBanks];
const groups={},counts={};
for(const bank of banks){groups[bank.id]={};counts[bank.id]={questions:bank.items.length,tags:{}};for(const q of bank.items){for(const tag of classify(q,bank.id)){(groups[bank.id][tag] ||= []).push(q.id);counts[bank.id].tags[tag]=(counts[bank.id].tags[tag]||0)+1;}}}
const data={version:2,categories,groups,counts};
const js='// Fixed scene labels for bundled source questions; source text and IDs are unchanged.\nwindow.BankSceneData='+JSON.stringify(data)+';\n';
if(process.argv.includes('--stdout'))process.stdout.write(js);else fs.writeFileSync(__dirname+'/src/bank-scene-data.js',js);
