const translations = {
 ar: {
  nav_matches:"المباريات",nav_news:"الأخبار",nav_streams:"البث الرسمي",eyebrow:"منصة كرة القدم",
  hero_title:"كل المباريات، في مكان واحد.",hero_desc:"تابع النتائج والمواعيد وأخبار كرة القدم بتجربة سريعة وواضحة.",
  hero_cta:"استكشف المباريات",live_label:"مركز المباريات",matches_title:"المباريات والنتائج",refresh:"تحديث",
  filter_all:"الكل",filter_live:"مباشر",filter_scheduled:"قادمة",filter_finished:"انتهت",
  streams_label:"مشاهدة قانونية",streams_title:"البث الرسمي",
  streams_desc:"ستظهر هنا روابط أو مشغلات الجهات المالكة لحقوق البث، بعد التحقق من إذن استخدامها. لا نوفر روابط بث غير مرخصة.",
  streams_empty:"لا توجد روابط بث رسمية مضافة حالياً.",news_label:"من الملعب",news_title:"آخر الأخبار والتحليلات",
  guide_tag:"دليل",analysis_tag:"تحليل",news_one_title:"كيف تقرأ إحصائيات المباراة؟",
  news_one_desc:"تعرف على الاستحواذ والتسديدات والفرص، ولماذا لا تكفي نتيجة المباراة وحدها لفهم الأداء.",
  news_two_title:"ما الذي يجعل الفريق منظماً؟",news_two_desc:"نظرة مبسطة إلى الضغط والتحولات والتمركز داخل الملعب.",
  read_more:"اقرأ المزيد ←",footer_desc:"معلومات كرة القدم والمحتوى الرياضي في مكان واحد.",
  about:"من نحن",privacy:"سياسة الخصوصية",terms:"شروط الاستخدام",contact:"اتصل بنا",
  demo:"وضع تجريبي: النتائج المعروضة أمثلة وليست بيانات مباشرة. اربط مزود البيانات لتفعيل التحديث الحقيقي.",
  no_matches:"لا توجد مباريات لعرضها.",loading:"جارٍ تحميل المباريات…",api_error:"تعذر جلب البيانات. تحقق من إعداد واجهة البيانات.",
  live:"مباشر",scheduled:"لم تبدأ",finished:"انتهت",minute:"دقيقة",demo_badge:"مثال تجريبي",
  stream_link:"زيارة المصدر الرسمي",updated:"آخر تحديث"
 },
 fr: {
  nav_matches:"Matchs",nav_news:"Actualités",nav_streams:"Diffusion officielle",eyebrow:"Plateforme football",
  hero_title:"Tous les matchs, au même endroit.",hero_desc:"Suivez les scores, les horaires et l’actualité du football simplement.",
  hero_cta:"Voir les matchs",live_label:"Centre des matchs",matches_title:"Matchs et résultats",refresh:"Actualiser",
  filter_all:"Tous",filter_live:"En direct",filter_scheduled:"À venir",filter_finished:"Terminés",
  streams_label:"Visionnage légal",streams_title:"Diffusion officielle",
  streams_desc:"Les liens et lecteurs des diffuseurs autorisés seront affichés ici après vérification des droits. Aucun flux non autorisé n’est proposé.",
  streams_empty:"Aucun lien officiel n’a encore été ajouté.",news_label:"Sur le terrain",news_title:"Actualités et analyses",
  guide_tag:"Guide",analysis_tag:"Analyse",news_one_title:"Comment lire les statistiques d’un match ?",
  news_one_desc:"Comprenez la possession, les tirs et les occasions, au-delà du score final.",
  news_two_title:"Qu’est-ce qu’une équipe bien organisée ?",news_two_desc:"Un aperçu simple du pressing, des transitions et du placement.",
  read_more:"Lire la suite →",footer_desc:"Actualités et informations football au même endroit.",
  about:"À propos",privacy:"Confidentialité",terms:"Conditions d’utilisation",contact:"Contact",
  demo:"Mode démo : les scores affichés sont fictifs et ne sont pas des données en direct. Connectez un fournisseur pour activer les mises à jour.",
  no_matches:"Aucun match à afficher.",loading:"Chargement des matchs…",api_error:"Impossible de charger les données. Vérifiez la configuration API.",
  live:"En direct",scheduled:"À venir",finished:"Terminé",minute:"min",demo_badge:"Démo",
  stream_link:"Visiter la source officielle",updated:"Mis à jour"
 }
};
let lang = localStorage.getItem("koora-lang") || "ar";
let activeFilter = "all";
const $ = s => document.querySelector(s);
const t = key => translations[lang][key] || key;

function setLanguage(next) {
  lang = next; localStorage.setItem("koora-lang", lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t(el.dataset.i18n));
  const frPages = {"about.html":"about-fr.html","privacy.html":"privacy-fr.html","terms.html":"terms-fr.html","contact.html":"contact-fr.html","article-stats.html":"article-stats-fr.html","article-tactics.html":"article-tactics-fr.html"};
  document.querySelectorAll(".footer-links a, .news-body a").forEach(a => {
    const base = a.getAttribute("href");
    if (base && frPages[base]) a.setAttribute("href", lang === "fr" ? frPages[base] : base);
  });
  $("#langToggle").textContent = lang === "ar" ? "FR" : "ع";
  renderMatches(window.kooraMatches || demoMatches);
  renderStreams();
}
const demoMatches = [
 {league:"Champions League",home:"Real Madrid",away:"Manchester City",homeScore:1,awayScore:1,status:"LIVE",elapsed:62},
 {league:"Premier League",home:"Arsenal",away:"Liverpool",homeScore:null,awayScore:null,status:"NS",time:"20:00"},
 {league:"La Liga",home:"Barcelona",away:"Atlético Madrid",homeScore:2,awayScore:0,status:"FT"}
];
function statusGroup(m) {
 const s=m.fixture?.status?.short || m.status;
 if(["1H","2H","HT","ET","BT","P","LIVE"].includes(s)) return "live";
 if(["FT","AET","PEN"].includes(s)) return "finished";
 return "scheduled";
}
function normalizeApi(data) {
 return (data.response || []).map(x => ({
  league:x.league?.name || "Football", home:x.teams?.home?.name || "Home",
  away:x.teams?.away?.name || "Away", homeScore:x.goals?.home, awayScore:x.goals?.away,
  status:x.fixture?.status?.short || "NS", elapsed:x.fixture?.status?.elapsed,
  time:x.fixture?.date ? new Date(x.fixture.date).toLocaleTimeString(lang==="ar"?"ar":"fr-FR",{hour:"2-digit",minute:"2-digit"}) : ""
 }));
}
function renderMatches(matches) {
 const filtered = matches.filter(m => activeFilter==="all" || statusGroup(m)===activeFilter);
 const grid=$("#matchesGrid");
 if(!filtered.length){grid.innerHTML=`<div class="empty-state">${t("no_matches")}</div>`;return;}
 grid.innerHTML=filtered.map(m=>{
  const group=statusGroup(m), live=group==="live", finished=group==="finished";
  const score=(m.homeScore ?? "-")+" : "+(m.awayScore ?? "-");
  const status=live ? `${t("live")} ${m.elapsed ?? ""}${m.elapsed ? "′" : ""}` : finished ? t("finished") : (m.time || t("scheduled"));
  return `<article class="match-card">
   <div class="match-meta"><span>${escapeHtml(m.league)}</span><span class="status ${live?"is-live":""}">${live?"● ":""}${escapeHtml(status)}</span></div>
   <div class="teams"><span>${escapeHtml(m.home)}</span><strong class="score">${score}</strong><span>${escapeHtml(m.away)}</span></div>
   <div class="match-foot">${live ? t("live") : finished ? t("finished") : t("scheduled")}</div>
  </article>`;
 }).join("");
}
function escapeHtml(s){return String(s ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
async function loadMatches() {
 const base=window.KOORA_CONFIG?.apiBaseUrl;
 if(!base){window.kooraMatches=demoMatches;renderMatches(demoMatches);$("#dataNotice").textContent=t("demo");$("#matchesStatus").textContent=t("demo_badge");return;}
 $("#matchesStatus").textContent=t("loading");
 try{
  const r=await fetch(base.replace(/\/$/,"")+"/api/matches?date="+new Date().toISOString().slice(0,10));
  if(!r.ok) throw new Error("API "+r.status);
  const data=await r.json(); window.kooraMatches=normalizeApi(data); renderMatches(window.kooraMatches);
  $("#dataNotice").textContent=""; $("#matchesStatus").textContent=t("updated")+": "+new Date().toLocaleTimeString();
 }catch(e){$("#matchesStatus").textContent=t("api_error");renderMatches(demoMatches);}
}
function renderStreams(){
 const box=$("#streamsList"), streams=window.KOORA_CONFIG?.officialStreams || [];
 if(!streams.length){box.innerHTML=`<div class="empty-icon">▶</div><p>${t("streams_empty")}</p>`;return;}
 box.innerHTML=streams.map(s=>`<div class="stream-row"><b>${escapeHtml(s.title)}</b><a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer">${t("stream_link")}</a></div>`).join("");
}
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
 document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
 activeFilter=btn.dataset.filter;renderMatches(window.kooraMatches||demoMatches);
}));
$("#langToggle").addEventListener("click",()=>setLanguage(lang==="ar"?"fr":"ar"));
$("#refreshBtn").addEventListener("click",loadMatches);
$("#year").textContent=new Date().getFullYear();
setLanguage(lang);loadMatches();renderStreams();
// Refresh scores once per minute. The Worker/API provider's quota and terms still apply.
setInterval(loadMatches,60000);