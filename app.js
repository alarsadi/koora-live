
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

// توقيت وتاريخ جهاز الزائر تلقائياً
function getLocalTime(date) {
 return new Intl.DateTimeFormat(
  lang === "ar" ? "ar" : "fr-FR",
  {
   hour: "2-digit",
   minute: "2-digit",
   hour12: false
  }
 ).format(date);
}

// تاريخ اليوم حسب جهاز الزائر
function getLocalDate() {
 const parts = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
 }).formatToParts(new Date());

 const values = {};
 parts.forEach(p => values[p.type] = p.value);

 return `${values.year}-${values.month}-${values.day}`;
}

// المنطقة الزمنية حسب جهاز الزائر
function getLocalTimeZone() {
 return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

function setLanguage(next) {
 lang = next;
 localStorage.setItem("koora-lang", lang);

 document.documentElement.lang = lang;
 document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

 document.querySelectorAll("[data-i18n]").forEach(el => {
  el.textContent = t(el.dataset.i18n);
 });

 const frPages = {
  "about.html":"about-fr.html",
  "privacy.html":"privacy-fr.html",
  "terms.html":"terms-fr.html",
  "contact.html":"contact-fr.html",
  "article-stats.html":"article-stats-fr.html",
  "article-tactics.html":"article-tactics-fr.html"
 };

 document.querySelectorAll(".footer-links a, .news-body a").forEach(a => {
  const base = a.getAttribute("href");

  if (base && frPages[base]) {
   a.setAttribute("href", lang === "fr" ? frPages[base] : base);
  }
 });

 $("#langToggle").textContent = lang === "ar" ? "FR" : "ع";

 renderMatches(window.kooraMatches || demoMatches);
 renderStreams();
}

const demoMatches = [
 {
  league:"Champions League",
  home:"Real Madrid",
  away:"Manchester City",
  homeScore:1,
  awayScore:1,
  status:"LIVE",
  elapsed:62
 },
 {
  league:"Premier League",
  home:"Arsenal",
  away:"Liverpool",
  homeScore:null,
  awayScore:null,
  status:"NS",
  time:"20:00"
 },
 {
  league:"La Liga",
  home:"Barcelona",
  away:"Atlético Madrid",
  homeScore:2,
  awayScore:0,
  status:"FT"
 }
];

function statusGroup(m) {
 const s = m.status;

 if (["1H","2H","HT","ET","BT","P","LIVE","SUSP","INT"].includes(s)) {
  return "live";
 }

 if (["FT","AET","PEN"].includes(s)) {
  return "finished";
 }

 return "scheduled";
}

function normalizeApi(data) {
 const seen = new Set();

 return (data.response || [])
  .filter(x => {
   const id = x.fixture?.id;

   if (id && seen.has(id)) return false;
   if (id) seen.add(id);

   return true;
  })
  .map(x => {
   const fixtureDate = x.fixture?.date
    ? new Date(x.fixture.date)
    : null;

   return {
    id: x.fixture?.id || null,

    league: x.league?.name || "Football",
    leagueLogo: x.league?.logo || "",

    home: x.teams?.home?.name || "Home",
    homeLogo: x.teams?.home?.logo || "",

    away: x.teams?.away?.name || "Away",
    awayLogo: x.teams?.away?.logo || "",

    homeScore: x.goals?.home,
    awayScore: x.goals?.away,

    status: x.fixture?.status?.short || "NS",
    elapsed: x.fixture?.status?.elapsed,

    timestamp: fixtureDate && !isNaN(fixtureDate)
     ? fixtureDate.getTime()
     : 0,

    time: fixtureDate && !isNaN(fixtureDate)
     ? getLocalTime(fixtureDate)
     : ""
   };
  });
}

function sortMatches(matches) {
 const order = {
  live: 0,
  scheduled: 1,
  finished: 2
 };

 return [...matches].sort((a, b) => {
  const groupA = order[statusGroup(a)];
  const groupB = order[statusGroup(b)];

  if (groupA !== groupB) {
   return groupA - groupB;
  }

  if (groupA === 1) {
   return (a.timestamp || 0) - (b.timestamp || 0);
  }

  if (groupA === 2) {
   return (b.timestamp || 0) - (a.timestamp || 0);
  }

  return 0;
 });
}

function renderLogo(url, className, name) {
 if (!url) return "";

 return `<img
  class="${className}"
  src="${escapeHtml(url)}"
  alt="${escapeHtml(name)}"
  loading="lazy"
  referrerpolicy="no-referrer"
  onerror="this.style.display='none'"
 >`;
}

function renderMatches(matches) {
 const sorted = sortMatches(matches);

 const filtered = sorted.filter(m =>
  activeFilter === "all" || statusGroup(m) === activeFilter
 );

 const grid = $("#matchesGrid");

 if (!filtered.length) {
  grid.innerHTML = `<div class="empty-state">${t("no_matches")}</div>`;
  return;
 }

 grid.innerHTML = filtered.map(m => {
  const group = statusGroup(m);
  const live = group === "live";
  const finished = group === "finished";

  const score =
   (m.homeScore ?? "-") + " : " + (m.awayScore ?? "-");

  const status = live
   ? `${t("live")} ${m.elapsed ?? ""}${m.elapsed ? "′" : ""}`
   : finished
    ? t("finished")
    : (m.time || t("scheduled"));

  return `
   <article class="match-card">

    <div class="match-meta">
     <span class="match-league">
      ${renderLogo(m.leagueLogo, "league-logo", m.league)}
      ${escapeHtml(m.league)}
     </span>

     <span class="status ${live ? "is-live" : ""}">
      ${live ? "● " : ""}
      ${escapeHtml(status)}
     </span>
    </div>

    <div class="teams">

     <div class="team">
      ${renderLogo(m.homeLogo, "team-logo", m.home)}
      <span class="team-name">${escapeHtml(m.home)}</span>
     </div>

     <strong class="score">${escapeHtml(score)}</strong>

     <div class="team">
      ${renderLogo(m.awayLogo, "team-logo", m.away)}
      <span class="team-name">${escapeHtml(m.away)}</span>
     </div>

    </div>

    <div class="match-foot">
     <span>
      ${live ? t("live") : finished ? t("finished") : t("scheduled")}
     </span>

     <span class="${!live && !finished ? "match-time" : ""}">
      ${!live && !finished ? escapeHtml(m.time || "") : ""}
     </span>
    </div>

   </article>
  `;
 }).join("");
}

function escapeHtml(s) {
 return String(s ?? "").replace(/[&<>"']/g, c => ({
  "&":"&amp;",
  "<":"&lt;",
  ">":"&gt;",
  '"':"&quot;",
  "'":"&#39;"
 }[c]));
}

async function loadMatches() {
 const base = window.KOORA_CONFIG?.apiBaseUrl;

 if (!base) {
  window.kooraMatches = demoMatches;
  renderMatches(demoMatches);

  $("#dataNotice").textContent = t("demo");
  $("#matchesStatus").textContent = t("demo_badge");

  return;
 }

 $("#matchesStatus").textContent = t("loading");

 try {
  const today = getLocalDate();
  const timezone = getLocalTimeZone();

  // إرسال التاريخ والمنطقة الزمنية إلى Cloudflare Worker
  const params = new URLSearchParams({
   date: today,
   timezone: timezone
  });

  const url =
   base.replace(/\/$/, "") +
   "/api/matches?" + params.toString();

  const response = await fetch(url, {
   method: "GET",
   cache: "no-store"
  });

  if (!response.ok) {
   throw new Error("API " + response.status);
  }

  const data = await response.json();

  if (data.errors && Object.keys(data.errors).length) {
   throw new Error("API returned errors");
  }

  window.kooraMatches = normalizeApi(data);

  renderMatches(window.kooraMatches);

  $("#dataNotice").textContent = "";

  $("#matchesStatus").textContent =
   t("updated") + ": " + getLocalTime(new Date());

 } catch (error) {
  console.error("Koora API error:", error);

  $("#matchesStatus").textContent = t("api_error");

  if (!window.kooraMatches) {
   renderMatches(demoMatches);
  }
 }
}

function renderStreams() {
 const box = $("#streamsList");
 const streams = window.KOORA_CONFIG?.officialStreams || [];

 if (!streams.length) {
  box.innerHTML =
   `<div class="empty-icon">▶</div><p>${t("streams_empty")}</p>`;
  return;
 }

 box.innerHTML = streams.map(s => `
  <div class="stream-row">
   <b>${escapeHtml(s.title)}</b>
   <a href="${escapeHtml(s.url)}"
      target="_blank"
      rel="noopener noreferrer">
    ${t("stream_link")}
   </a>
  </div>
 `).join("");
}

document.querySelectorAll(".filter").forEach(btn => {
 btn.addEventListener("click", () => {
  document.querySelectorAll(".filter").forEach(x =>
   x.classList.remove("active")
  );

  btn.classList.add("active");
  activeFilter = btn.dataset.filter;

  renderMatches(window.kooraMatches || demoMatches);
 });
});

$("#langToggle").addEventListener("click", () => {
 setLanguage(lang === "ar" ? "fr" : "ar");
});

$("#refreshBtn").addEventListener("click", loadMatches);

$("#year").textContent = new Date().getFullYear();

setLanguage(lang);
loadMatches();
renderStreams();

// تحديث البيانات كل 15 دقيقة
setInterval(loadMatches, 15 * 60 * 1000);
