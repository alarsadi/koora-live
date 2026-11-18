
const translations = {
 ar: {
  nav_matches:"المباريات",nav_news:"الأخبار",nav_streams:"البث الرسمي",eyebrow:"منصة كرة القدم",
  hero_title:"كل المباريات، في مكان واحد.",hero_desc:"تابع النتائج والمواعيد وأخبار كرة القدم بتجربة سريعة وواضحة.",
  hero_cta:"استكشف المباريات",live_label:"مركز المباريات",matches_title:"المباريات والنتائج",refresh:"تحديث",
  filter_all:"الكل",filter_live:"مباشر",filter_scheduled:"قادمة",filter_finished:"انتهت",
  streams_label:"مشاهدة قانونية",streams_title:"البث المباشر",
  streams_desc:"اختر المباراة لفتح مشغل الفيديو.",
  streams_empty:"لا توجد مباريات بث مضافة حالياً.",
  news_label:"من الملعب",news_title:"آخر الأخبار والتحليلات",
  guide_tag:"دليل",analysis_tag:"تحليل",news_one_title:"كيف تقرأ إحصائيات المباراة؟",
  news_one_desc:"تعرف على الاستحواذ والتسديدات والفرص، ولماذا لا تكفي نتيجة المباراة وحدها لفهم الأداء.",
  news_two_title:"ما الذي يجعل الفريق منظماً؟",news_two_desc:"نظرة مبسطة إلى الضغط والتحولات والتمركز داخل الملعب.",
  read_more:"اقرأ المزيد ←",footer_desc:"معلومات كرة القدم والمحتوى الرياضي في مكان واحد.",
  about:"من نحن",privacy:"سياسة الخصوصية",terms:"شروط الاستخدام",contact:"اتصل بنا",
  demo:"وضع تجريبي: النتائج المعروضة أمثلة وليست بيانات مباشرة. اربط مزود البيانات لتفعيل التحديث الحقيقي.",
  no_matches:"لا توجد مباريات لعرضها.",loading:"جارٍ التحميل…",api_error:"تعذر جلب البيانات. تحقق من إعداد واجهة البيانات.",
  live:"مباشر",scheduled:"لم تبدأ",finished:"انتهت",minute:"دقيقة",demo_badge:"مثال تجريبي",
  stream_link:"مشاهدة المباراة",updated:"آخر تحديث",
  player_loading:"جارٍ تحميل البث...",
  player_error:"تعذر تشغيل البث. تحقق من الرابط وتوافقه مع مشغل الفيديو.",
  player_click:"اضغط زر التشغيل لبدء المشاهدة.",
  stream_upcoming:"قريباً",stream_finished:"انتهت",close:"إغلاق"
 },
 fr: {
  nav_matches:"Matchs",nav_news:"Actualités",nav_streams:"Diffusion officielle",eyebrow:"Plateforme football",
  hero_title:"Tous les matchs, au même endroit.",hero_desc:"Suivez les scores, les horaires et l’actualité du football simplement.",
  hero_cta:"Voir les matchs",live_label:"Centre des matchs",matches_title:"Matchs et résultats",refresh:"Actualiser",
  filter_all:"Tous",filter_live:"En direct",filter_scheduled:"À venir",filter_finished:"Terminés",
  streams_label:"Visionnage légal",streams_title:"Diffusion en direct",
  streams_desc:"Choisissez un match pour ouvrir le lecteur vidéo.",
  streams_empty:"Aucun match disponible pour le moment.",
  news_label:"Sur le terrain",news_title:"Actualités et analyses",
  guide_tag:"Guide",analysis_tag:"Analyse",news_one_title:"Comment lire les statistiques d’un match ?",
  news_one_desc:"Comprenez la possession, les tirs et les occasions, au-delà du score final.",
  news_two_title:"Qu’est-ce qu’une équipe bien organisée ?",news_two_desc:"Un aperçu simple du pressing, des transitions et du placement.",
  read_more:"Lire la suite →",footer_desc:"Actualités et informations football au même endroit.",
  about:"À propos",privacy:"Confidentialité",terms:"Conditions d’utilisation",contact:"Contact",
  demo:"Mode démo : les scores affichés sont fictifs et ne sont pas des données en direct. Connectez un fournisseur pour activer les mises à jour.",
  no_matches:"Aucun match à afficher.",loading:"Chargement…",api_error:"Impossible de charger les données. Vérifiez la configuration API.",
  live:"En direct",scheduled:"À venir",finished:"Terminé",minute:"min",demo_badge:"Démo",
  stream_link:"Regarder le match",updated:"Mis à jour",
  player_loading:"Chargement du direct...",
  player_error:"Impossible de lire ce flux. Vérifiez le lien et sa compatibilité.",
  player_click:"Appuyez sur lecture pour commencer.",
  stream_upcoming:"À venir",stream_finished:"Terminé",close:"Fermer"
 }
};

let lang = localStorage.getItem("koora-lang") || "ar";
let activeFilter = "all";

// البثوث القادمة من قاعدة البيانات
let availableStreams = [];

const $ = s => document.querySelector(s);
const t = key => translations[lang]?.[key] || key;

const API = () =>
 (window.KOORA_CONFIG?.apiBaseUrl || "").replace(/\/$/, "");

// توقيت جهاز الزائر
function getLocalTime(date) {
 return new Intl.DateTimeFormat(
  lang === "ar" ? "ar" : "fr-FR",
  {
   hour:"2-digit",
   minute:"2-digit",
   hour12:false
  }
 ).format(date);
}

// تاريخ اليوم حسب جهاز الزائر
function getLocalDate() {
 const parts = new Intl.DateTimeFormat("en-CA", {
  year:"numeric",
  month:"2-digit",
  day:"2-digit"
 }).formatToParts(new Date());

 const values = {};
 parts.forEach(p => values[p.type] = p.value);

 return `${values.year}-${values.month}-${values.day}`;
}

// المنطقة الزمنية حسب جهاز الزائر
function getLocalTimeZone() {
 return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
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

// توحيد أسماء الفرق لتسهيل المطابقة
function normalizeTeamName(name) {
 return String(name || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9\u0600-\u06FF]/g, "");
}

// البحث عن بث مطابق للمباراة
function findMatchStream(match) {
 const home = normalizeTeamName(match.home);
 const away = normalizeTeamName(match.away);

 if (!home || !away) return null;

 return availableStreams.find(s => {
  const streamHome = normalizeTeamName(s.home_team);
  const streamAway = normalizeTeamName(s.away_team);

  if (!streamHome || !streamAway) return false;

  return (
   (home === streamHome && away === streamAway) ||
   (home === streamAway && away === streamHome)
  );
 }) || null;
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

 const langButton = $("#langToggle");
 if (langButton) {
  langButton.textContent = lang === "ar" ? "FR" : "ع";
 }

 if ($("#matchesGrid")) {
  renderMatches(window.kooraMatches || demoMatches);
 }

 renderStreams();
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
    id:x.fixture?.id || null,
    league:x.league?.name || "Football",
    leagueLogo:x.league?.logo || "",
    home:x.teams?.home?.name || "Home",
    homeLogo:x.teams?.home?.logo || "",
    away:x.teams?.away?.name || "Away",
    awayLogo:x.teams?.away?.logo || "",
    homeScore:x.goals?.home,
    awayScore:x.goals?.away,
    status:x.fixture?.status?.short || "NS",
    elapsed:x.fixture?.status?.elapsed,
    timestamp:fixtureDate && !isNaN(fixtureDate)
     ? fixtureDate.getTime()
     : 0,
    time:fixtureDate && !isNaN(fixtureDate)
     ? getLocalTime(fixtureDate)
     : ""
   };
  });
}

function sortMatches(matches) {
 const order = {live:0,scheduled:1,finished:2};

 return [...matches].sort((a,b) => {
  const groupA = order[statusGroup(a)];
  const groupB = order[statusGroup(b)];

  if (groupA !== groupB) return groupA - groupB;

  if (groupA === 1) {
   return (a.timestamp || 0) - (b.timestamp || 0);
  }

  if (groupA === 2) {
   return (b.timestamp || 0) - (a.timestamp || 0);
  }

  return 0;
 });
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

function renderLogo(url,className,name) {
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

// عرض المباريات وربط البطاقة بمشغل الفيديو
function renderMatches(matches) {
 const grid = $("#matchesGrid");
 if (!grid) return;

 const sorted = sortMatches(matches);

 const filtered = sorted.filter(m =>
  activeFilter === "all" || statusGroup(m) === activeFilter
 );

 if (!filtered.length) {
  grid.innerHTML = `<div class="empty-state">${t("no_matches")}</div>`;
  return;
 }

 grid.innerHTML = filtered.map(m => {
  const group = statusGroup(m);
  const live = group === "live";
  const finished = group === "finished";

  // هل توجد مباراة بث مطابقة؟
  const linkedStream = findMatchStream(m);

  const score = (m.homeScore ?? "-") + " : " + (m.awayScore ?? "-");

  const status = live
   ? `${t("live")} ${m.elapsed ?? ""}${m.elapsed ? "′" : ""}`
   : finished
    ? t("finished")
    : (m.time || t("scheduled"));

  return `
   <article
    class="match-card ${linkedStream ? "has-stream" : ""}"
    ${linkedStream ? `data-stream-id="${Number(linkedStream.id)}" role="button" tabindex="0" aria-label="${escapeHtml(t("stream_link"))}"` : ""}
   >
    <div class="match-meta">
     <span class="match-league">
      ${renderLogo(m.leagueLogo,"league-logo",m.league)}
      ${escapeHtml(m.league)}
     </span>

     <span class="status ${live ? "is-live" : ""}">
      ${live ? "● " : ""}${escapeHtml(status)}
     </span>
    </div>

    <div class="teams">
     <div class="team">
      ${renderLogo(m.homeLogo,"team-logo",m.home)}
      <span class="team-name">${escapeHtml(m.home)}</span>
     </div>

     <strong class="score">${escapeHtml(score)}</strong>

     <div class="team">
      ${renderLogo(m.awayLogo,"team-logo",m.away)}
      <span class="team-name">${escapeHtml(m.away)}</span>
     </div>
    </div>

    <div class="match-foot">
     <span>${live ? t("live") : finished ? t("finished") : t("scheduled")}</span>

     <span class="${!live && !finished ? "match-time" : ""}">
      ${!live && !finished ? escapeHtml(m.time || "") : ""}
     </span>
    </div>

    ${linkedStream ? `
     <div class="match-watch-hint">
      ▶ ${t("stream_link")}
     </div>
    ` : ""}
   </article>
  `;
 }).join("");

 // الضغط على بطاقة المباراة يفتح نافذة البث
 grid.querySelectorAll(".match-card.has-stream").forEach(card => {
  const open = () => openStream(card.dataset.streamId);

  card.addEventListener("click", open);

  card.addEventListener("keydown", e => {
   if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    open();
   }
  });
 });
}

// تحميل المباريات من API-Football
async function loadMatches() {
 const base = API();

 if (!base) {
  window.kooraMatches = demoMatches;
  renderMatches(demoMatches);

  const notice = $("#dataNotice");
  const status = $("#matchesStatus");

  if (notice) notice.textContent = t("demo");
  if (status) status.textContent = t("demo_badge");

  return;
 }

 const status = $("#matchesStatus");
 if (status) status.textContent = t("loading");

 try {
  const params = new URLSearchParams({
   date:getLocalDate(),
   timezone:getLocalTimeZone()
  });

  const response = await fetch(
   `${base}/api/matches?${params.toString()}`,
   {method:"GET",cache:"no-store"}
  );

  if (!response.ok) throw new Error("API " + response.status);

  const data = await response.json();

  if (data.errors && Object.keys(data.errors).length) {
   throw new Error("API returned errors");
  }

  window.kooraMatches = normalizeApi(data);
  renderMatches(window.kooraMatches);

  const notice = $("#dataNotice");
  if (notice) notice.textContent = "";

  if (status) {
   status.textContent = t("updated") + ": " + getLocalTime(new Date());
  }

 } catch (error) {
  console.error("Koora API error:",error);

  if (status) status.textContent = t("api_error");

  if (!window.kooraMatches) {
   renderMatches(demoMatches);
  }
 }
}

// إنشاء مشغل الفيديو
function createPlayer() {
 let modal = $("#streamPlayerModal");
 if (modal) return modal;

 modal = document.createElement("div");
 modal.id = "streamPlayerModal";

 modal.innerHTML = `
  <div class="player-overlay">
   <div class="player-window">
    <button class="player-close" type="button">✕ ${t("close")}</button>
    <div class="player-screen">
     <video id="streamVideo" controls playsinline preload="none"></video>
     <p id="playerMessage"></p>
    </div>
   </div>
  </div>
 `;

 document.body.appendChild(modal);

 modal.querySelector(".player-close").addEventListener("click",closeStream);

 modal.querySelector(".player-overlay").addEventListener("click",e => {
  if (e.target.classList.contains("player-overlay")) {
   closeStream();
  }
 });

 return modal;
}

// فتح البث داخل نافذة منبثقة
async function openStream(id) {
 const base = API();
 if (!base) return;

 const modal = createPlayer();
 const video = $("#streamVideo");
 const message = $("#playerMessage");

 modal.style.display = "block";
 message.textContent = t("player_loading");

 if (window.currentHls) {
  window.currentHls.destroy();
  window.currentHls = null;
 }

 video.pause();
 video.removeAttribute("src");
 video.load();

 try {
  const response = await fetch(
   `${base}/api/streams/${encodeURIComponent(id)}`,
   {cache:"no-store"}
  );

  if (!response.ok) throw new Error("Stream unavailable");

  const data = await response.json();
  const streamUrl = data.stream_url;

  if (!streamUrl) throw new Error("No stream URL");

  const parsed = new URL(streamUrl);

  if (!["http:","https:"].includes(parsed.protocol)) {
   throw new Error("Invalid video URL");
  }

  const isHls = /\.m3u8($|\?)/i.test(parsed.pathname + parsed.search);

  if (isHls && video.canPlayType("application/vnd.apple.mpegurl")) {
   video.src = streamUrl;
  } else if (isHls) {
   if (!window.Hls) {
    await new Promise((resolve,reject) => {
     const script = document.createElement("script");
     script.src = "https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js";
     script.onload = resolve;
     script.onerror = reject;
     document.head.appendChild(script);
    });
   }

   if (!window.Hls.isSupported()) {
    throw new Error("HLS not supported");
   }

   window.currentHls = new window.Hls();
   window.currentHls.loadSource(streamUrl);
   window.currentHls.attachMedia(video);

  } else {
   video.src = streamUrl;
  }

  message.textContent = "";

  video.play().catch(() => {
   message.textContent = t("player_click");
  });

 } catch (error) {
  console.error("Stream player error:",error);
  message.textContent = t("player_error");
 }
}

// إغلاق المشغل
function closeStream() {
 const modal = $("#streamPlayerModal");
 const video = $("#streamVideo");

 if (video) {
  video.pause();
  video.removeAttribute("src");
  video.load();
 }

 if (window.currentHls) {
  window.currentHls.destroy();
  window.currentHls = null;
 }

 if (modal) modal.style.display = "none";
}

// جلب بطاقات البث من قاعدة البيانات
async function renderStreams() {
 const box = $("#streamsList");
 const base = API();

 if (!base) {
  availableStreams = [];
  if (box) box.innerHTML = `<p>${t("streams_empty")}</p>`;
  if (window.kooraMatches) renderMatches(window.kooraMatches);
  return;
 }

 if (box) box.innerHTML = `<p>${t("loading")}</p>`;

 try {
  const response = await fetch(
   `${base}/api/streams`,
   {cache:"no-store"}
  );

  if (!response.ok) throw new Error("Streams error");

  const streams = await response.json();

  availableStreams = Array.isArray(streams) ? streams : [];

  // إعادة رسم المباريات بعد تحميل روابط البث
  if (window.kooraMatches) {
   renderMatches(window.kooraMatches);
  }

  if (!box) return;

  if (!availableStreams.length) {
   box.innerHTML =
    `<div class="empty-icon">▶</div><p>${t("streams_empty")}</p>`;
   return;
  }

  box.innerHTML = availableStreams.map(s => {
   const statusText =
    s.status === "live" ? t("live") :
    s.status === "finished" ? t("stream_finished") :
    t("stream_upcoming");

   return `
    <article class="stream-card"
     data-stream-id="${Number(s.id)}"
     role="button"
     tabindex="0">

     <div class="stream-card-top">
      <span class="stream-channel">${escapeHtml(s.channel)}</span>
      <span class="status ${s.status === "live" ? "is-live" : ""}">
       ${escapeHtml(statusText)}
      </span>
     </div>

     <div class="stream-teams">
      <strong>${escapeHtml(s.home_team)}</strong>
      <span>VS</span>
      <strong>${escapeHtml(s.away_team)}</strong>
     </div>

     <div class="stream-card-bottom">
      <span>${escapeHtml(s.competition)}</span>
      <span>${escapeHtml(s.match_time || "")}</span>
     </div>

     <div class="watch-button">
      ▶ ${t("stream_link")}
     </div>
    </article>
   `;
  }).join("");

  box.querySelectorAll(".stream-card").forEach(card => {
   const open = () => openStream(card.dataset.streamId);

   card.addEventListener("click",open);

   card.addEventListener("keydown",e => {
    if (e.key === "Enter" || e.key === " ") {
     e.preventDefault();
     open();
    }
   });
  });

 } catch (error) {
  console.error("Streams error:",error);

  if (box) box.innerHTML = `<p>${t("api_error")}</p>`;
 }
}

// أزرار تصفية المباريات
document.querySelectorAll(".filter").forEach(btn => {
 btn.addEventListener("click",() => {
  document.querySelectorAll(".filter").forEach(x =>
   x.classList.remove("active")
  );

  btn.classList.add("active");
  activeFilter = btn.dataset.filter;

  renderMatches(window.kooraMatches || demoMatches);
 });
});

// تغيير اللغة
const langToggle = $("#langToggle");

if (langToggle) {
 langToggle.addEventListener("click",() => {
  setLanguage(lang === "ar" ? "fr" : "ar");
 });
}

// زر تحديث المباريات
const refreshBtn = $("#refreshBtn");

if (refreshBtn) {
 refreshBtn.addEventListener("click",loadMatches);
}

// السنة الحالية
const year = $("#year");
if (year) year.textContent = new Date().getFullYear();

// بدء الموقع
setLanguage(lang);
loadMatches();
renderStreams();

// تحديث النتائج كل 15 دقيقة
setInterval(loadMatches,15 * 60 * 1000);

// تحديث قائمة البث كل دقيقة
setInterval(renderStreams,60 * 1000);
