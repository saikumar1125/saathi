// Saathi: voice-first government scheme finder.
const $ = id => document.getElementById(id);

const UI = {
  hi: {
    tagline: "बोलिए, और अपनी सरकारी योजनाएँ जानिए",
    langBtn: "English",
    placeholder: "अपना जवाब लिखें…",
    countLabel: "मिली योजनाएँ", valueLabel: "अनुमानित सालाना नकद लाभ",
    sendLabel: "मेरे फ़ोन पर भेजें", restartLabel: "फिर से शुरू करें",
    listen: "सुन रहा हूँ… बोलिए", speaking: "बोल रहा हूँ…",
    hello: "नमस्ते! मैं साथी हूँ। कुछ आसान सवाल पूछूँगा और बताऊँगा कि आपको कौन-कौन सी सरकारी योजनाएँ मिल सकती हैं। माइक दबाकर बोलिए, या नीचे से चुनिए।",
    notUnderstood: "माफ़ कीजिए, समझ नहीं आया। फिर से बोलिए, या नीचे से चुनिए।",
    found: n => `बहुत बढ़िया! आप ${n} योजनाओं के लिए पात्र हो सकते हैं।`,
    none: "अभी कोई योजना मेल नहीं खाई। नज़दीकी CSC केंद्र पर संपर्क करें।",
    listen2: "सुनें", docs: "दस्तावेज़", where: "कहाँ आवेदन करें",
    sent: "भेज दिया! आपको जल्द संदेश मिलेगा।", sendFail: "भेजने में दिक्कत आई। सेटिंग्स में n8n URL जाँचें।",
    noWebhook: "पहले ⚙️ सेटिंग्स में n8n webhook URL डालें।",
    disclaimer: "राशि अनुमानित है। आवेदन से पहले आधिकारिक पोर्टल पर पुष्टि करें।",
    noMic: "इस ब्राउज़र में आवाज़ पहचान नहीं है — Chrome या Edge इस्तेमाल करें, या लिखकर जवाब दें।",
  },
  en: {
    tagline: "Speak, and discover the government schemes you deserve",
    langBtn: "हिंदी",
    placeholder: "Type your answer…",
    countLabel: "Schemes found", valueLabel: "Est. yearly cash benefit",
    sendLabel: "Send to my phone", restartLabel: "Start again",
    listen: "Listening… speak now", speaking: "Speaking…",
    hello: "Namaste! I'm Saathi. I'll ask a few simple questions and tell you which government schemes you may be eligible for. Tap the mic and speak, or pick an option below.",
    notUnderstood: "Sorry, I didn't catch that. Please try again or pick an option below.",
    found: n => `Great news! You may be eligible for ${n} schemes.`,
    none: "No schemes matched right now. Please visit your nearest CSC centre.",
    listen2: "Listen", docs: "Documents", where: "Where to apply",
    sent: "Sent! You'll receive a message shortly.", sendFail: "Couldn't send. Check the n8n URL in settings.",
    noWebhook: "Add your n8n webhook URL in ⚙️ settings first.",
    disclaimer: "Amounts are estimates. Verify on the official portal before applying.",
    noMic: "Speech recognition isn't supported here — use Chrome or Edge, or type your answer.",
  },
};

const YES = ["haan", "han", "ha", "haa", "ji", "yes", "yeah", "hai", "हाँ", "हां", "हा", "जी", "है"];
const NO = ["nahi", "nahin", "na", "no", "nope", "नहीं", "नही", "ना"];
const yesNoOpts = [
  { value: true, hi: "हाँ", en: "Yes", keys: YES },
  { value: false, hi: "नहीं", en: "No", keys: NO },
];

// skip(a) => true hides the question for this person.
const QUESTIONS = [
  { id: "age", type: "number", q: { hi: "आपकी उम्र कितनी है?", en: "How old are you?" },
    chips: [18, 25, 35, 45, 60, 70] },
  { id: "gender", type: "choice", q: { hi: "आप पुरुष हैं या महिला?", en: "Are you male or female?" },
    options: [
      { value: "male", hi: "पुरुष", en: "Male", keys: ["purush", "male", "man", "aadmi", "पुरुष", "आदमी", "लड़का"] },
      { value: "female", hi: "महिला", en: "Female", keys: ["mahila", "female", "woman", "aurat", "lady", "महिला", "औरत", "लड़की", "स्त्री"] },
      { value: "other", hi: "अन्य", en: "Other", keys: ["other", "anya", "अन्य"] },
    ] },
  { id: "occupation", type: "choice", q: { hi: "आप क्या काम करते हैं? किसान, मज़दूर, विद्यार्थी, या कुछ और?", en: "What do you do? Farmer, labourer, student, or something else?" },
    options: [
      { value: "farmer", hi: "किसान", en: "Farmer", keys: ["kisan", "farmer", "kheti", "farming", "किसान", "खेती"] },
      { value: "labourer", hi: "मज़दूर", en: "Labourer", keys: ["mazdoor", "majdoor", "labour", "labor", "worker", "मजदूर", "मज़दूर", "रोजी", "कारीगर"] },
      { value: "student", hi: "विद्यार्थी", en: "Student", keys: ["student", "padhai", "vidyarthi", "chhatra", "विद्यार्थी", "छात्र", "पढ़ाई", "कॉलेज"] },
      { value: "other", hi: "अन्य", en: "Other", keys: ["other", "anya", "naukri", "job", "business", "dukan", "अन्य", "नौकरी", "दुकान", "गृहिणी"] },
    ] },
  { id: "ownsLand", type: "choice", q: { hi: "क्या आपके नाम पर खेती की ज़मीन है?", en: "Do you own farmland in your name?" },
    options: yesNoOpts, skip: a => a.occupation !== "farmer" },
  { id: "income", type: "number", q: { hi: "आपके परिवार की महीने की कुल कमाई लगभग कितनी है? रुपये में बताइए।", en: "Roughly how much does your family earn per month, in rupees?" },
    chips: [3000, 8000, 15000, 25000, 50000] },
  { id: "category", type: "choice", q: { hi: "आपकी श्रेणी क्या है? सामान्य, ओबीसी, एससी या एसटी?", en: "What is your category? General, OBC, SC or ST?" },
    options: [
      { value: "general", hi: "सामान्य", en: "General", keys: ["general", "samanya", "सामान्य", "जनरल"] },
      { value: "obc", hi: "ओबीसी", en: "OBC", keys: ["obc", "o b c", "pichda", "ओबीसी", "पिछड़ा"] },
      { value: "sc", hi: "एससी", en: "SC", keys: ["sc", "s c", "anusuchit jati", "एससी", "अनुसूचित जाति"] },
      { value: "st", hi: "एसटी", en: "ST", keys: ["st", "s t", "adivasi", "janjati", "tribal", "एसटी", "आदिवासी", "जनजाति"] },
    ] },
  { id: "bpl", type: "choice", q: { hi: "क्या आपके पास बीपीएल या अंत्योदय राशन कार्ड है?", en: "Do you have a BPL or Antyodaya ration card?" }, options: yesNoOpts },
  { id: "puccaHouse", type: "choice", q: { hi: "क्या आपके पास पक्का घर है?", en: "Do you live in a pucca (concrete) house?" }, options: yesNoOpts },
  { id: "married", type: "choice", q: { hi: "क्या आप विवाहित हैं?", en: "Are you married?" }, options: yesNoOpts,
    skip: a => a.gender !== "female" },
  { id: "pregnant", type: "choice", q: { hi: "क्या आप अभी गर्भवती हैं?", en: "Are you currently pregnant?" }, options: yesNoOpts,
    skip: a => a.gender !== "female" || a.age < 18 || a.age > 45 },
];

// ---------- state ----------
let lang = localStorage.getItem("saathi.lang") || "hi";
let answers = {};
let step = -1;
let matched = [];
const settings = {
  get key() { return localStorage.getItem("saathi.elKey") || ""; },
  get voice() { return localStorage.getItem("saathi.elVoice") || "21m00Tcm4TlvDq8ikWAM"; },
  get webhook() { return localStorage.getItem("saathi.n8n") || ""; },
};
const t = k => UI[lang][k];

// ---------- speech output ----------
let currentAudio = null;
async function speak(text) {
  stopSpeaking();
  $("status").textContent = t("speaking");
  try {
    if (settings.key) await speakEleven(text);
    else await speakBrowser(text);
  } catch (e) {
    console.warn("TTS failed, falling back", e);
    await speakBrowser(text);
  }
  $("status").textContent = "";
}
async function speakEleven(text) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${settings.voice}`, {
    method: "POST",
    headers: { "xi-api-key": settings.key, "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({ text, model_id: "eleven_multilingual_v2" }),
  });
  if (!res.ok) throw new Error("ElevenLabs " + res.status);
  const url = URL.createObjectURL(await res.blob());
  currentAudio = new Audio(url);
  await new Promise(r => { currentAudio.onended = r; currentAudio.onerror = r; currentAudio.play().catch(r); });
}
function speakBrowser(text) {
  return new Promise(resolve => {
    if (!("speechSynthesis" in window)) return resolve();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "hi" ? "hi-IN" : "en-IN";
    const v = speechSynthesis.getVoices().find(v => v.lang === u.lang);
    if (v) u.voice = v;
    u.rate = 0.95;
    u.onend = u.onerror = resolve;
    speechSynthesis.speak(u);
  });
}
function stopSpeaking() {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  if ("speechSynthesis" in window) speechSynthesis.cancel();
}

// ---------- speech input ----------
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null;
function listen() {
  if (!SR) { $("status").textContent = t("noMic"); return; }
  stopSpeaking();
  rec = new SR();
  rec.lang = lang === "hi" ? "hi-IN" : "en-IN";
  rec.interimResults = false;
  rec.maxAlternatives = 3;
  rec.onstart = () => { $("micBtn").classList.add("listening"); $("status").textContent = t("listen"); };
  rec.onend = () => { $("micBtn").classList.remove("listening"); if ($("status").textContent === t("listen")) $("status").textContent = ""; };
  rec.onerror = e => { $("status").textContent = e.error === "not-allowed" ? t("noMic") : ""; };
  rec.onresult = e => {
    const alts = [...e.results[0]].map(r => r.transcript);
    handleAnswer(alts[0], alts);
  };
  rec.start();
}

// ---------- parsing ----------
const NUM_WORDS = {
  ek: 1, do: 2, teen: 3, char: 4, chaar: 4, paanch: 5, panch: 5, chhe: 6, che: 6, saat: 7, aath: 8, nau: 9, das: 10,
  bees: 20, tees: 30, chalis: 40, pachas: 50, pachaas: 50, saath: 60, sattar: 70, assi: 80, nabbe: 90,
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
  "एक": 1, "दो": 2, "तीन": 3, "चार": 4, "पांच": 5, "पाँच": 5, "छह": 6, "सात": 7, "आठ": 8, "नौ": 9, "दस": 10,
  "बीस": 20, "तीस": 30, "चालीस": 40, "पचास": 50, "साठ": 60, "सत्तर": 70, "अस्सी": 80, "नब्बे": 90,
};
const MULT = { sau: 100, hundred: 100, "सौ": 100, hazaar: 1000, hazar: 1000, thousand: 1000, "हज़ार": 1000, "हजार": 1000, lakh: 100000, "लाख": 100000 };

function parseNumber(text) {
  const s = text.toLowerCase().replace(/[,₹]/g, "").replace(/[०-९]/g, d => "०१२३४५६७८९".indexOf(d));
  const tokens = s.split(/\s+/);
  let total = 0, cur = 0, seen = false;
  for (const tok of tokens) {
    const n = /^\d+(\.\d+)?$/.test(tok) ? parseFloat(tok) : NUM_WORDS[tok];
    if (n !== undefined) { cur += n; seen = true; continue; }
    const m = /^(\d+)(k)$/.exec(tok);
    if (m) { total += +m[1] * 1000; seen = true; continue; }
    if (MULT[tok]) { total += (cur || 1) * MULT[tok]; cur = 0; seen = true; }
  }
  return seen ? Math.round(total + cur) : null;
}
function parseChoice(text, options) {
  const s = " " + text.toLowerCase().replace(/[.,!?।]/g, " ") + " ";
  // check "no" before "yes" because "nahi hai" contains "hai"
  const ordered = options.some(o => o.value === false) ? [...options].reverse() : options;
  for (const o of ordered) {
    if (o.keys.some(k => s.includes(" " + k + " ")) || s.includes(" " + o.en.toLowerCase() + " ") || s.includes(o.hi)) return o.value;
  }
  return undefined;
}

// ---------- conversation ----------
function addMsg(text, who) {
  const d = document.createElement("div");
  d.className = "msg " + who;
  d.textContent = text;
  $("chat").appendChild(d);
  $("chat").scrollTop = $("chat").scrollHeight;
}
function renderChips(q) {
  const box = $("chips");
  box.innerHTML = "";
  if (!q) return;
  const items = q.type === "number"
    ? q.chips.map(n => ({ label: q.id === "income" ? "₹" + n.toLocaleString("en-IN") : String(n), say: String(n) }))
    : q.options.map(o => ({ label: o[lang], say: o[lang] }));
  for (const it of items) {
    const b = document.createElement("button");
    b.className = "chip";
    b.textContent = it.label;
    b.onclick = () => handleAnswer(it.say);
    box.appendChild(b);
  }
}
function nextStep(prefix = "") {
  step++;
  while (step < QUESTIONS.length && QUESTIONS[step].skip?.(answers)) step++;
  const visible = QUESTIONS.filter(q => !q.skip?.(answers)).length;
  const done = QUESTIONS.slice(0, step).filter(q => answers[q.id] !== undefined).length;
  $("progressBar").style.width = Math.min(100, (done / visible) * 100) + "%";
  if (step >= QUESTIONS.length) return finish();
  const q = QUESTIONS[step];
  addMsg(q.q[lang], "bot");
  renderChips(q);
  speak((prefix ? prefix + " " : "") + q.q[lang]);
}
function handleAnswer(text, alts = [text]) {
  const q = QUESTIONS[step];
  if (!q || !text.trim()) return;
  addMsg(text, "user");
  let value;
  for (const a of alts) {
    value = q.type === "number" ? parseNumber(a) : parseChoice(a, q.options);
    if (value !== null && value !== undefined) break;
  }
  if (value === null || value === undefined) {
    addMsg(t("notUnderstood"), "bot");
    speak(t("notUnderstood"));
    return;
  }
  answers[q.id] = value;
  nextStep();
}

function finish() {
  renderChips(null);
  matched = SCHEMES.filter(s => s.eligible(answers));
  const total = matched.reduce((sum, s) => sum + s.annualValue, 0);
  $("schemeCount").textContent = matched.length;
  $("annualValue").textContent = "₹" + total.toLocaleString("en-IN");
  $("cards").innerHTML = "";
  for (const s of matched) {
    const c = document.createElement("div");
    c.className = "card";
    c.innerHTML = `<h3></h3><p class="benefit"></p><p><b>${t("docs")}:</b> <span class="d"></span></p><p><b>${t("where")}:</b> <span class="w"></span></p><button>🔊 ${t("listen2")}</button>`;
    c.querySelector("h3").textContent = s.name[lang];
    c.querySelector(".benefit").textContent = s.benefit[lang];
    c.querySelector(".d").textContent = s.docs[lang];
    c.querySelector(".w").textContent = s.where;
    c.querySelector("button").onclick = () => speak(`${s.name[lang]}. ${s.benefit[lang]}. ${t("docs")}: ${s.docs[lang]}`);
    $("cards").appendChild(c);
  }
  $("results").classList.remove("hidden");
  document.querySelector("main").classList.add("has-results");
  const summary = matched.length
    ? `${t("found")(matched.length)} ${matched.slice(0, 3).map(s => s.name[lang] + ": " + s.benefit[lang]).join(". ")}.`
    : t("none");
  addMsg(summary, "bot");
  speak(summary);
}

async function sendToPhone() {
  const phone = $("phone").value.replace(/\D/g, "");
  if (!settings.webhook) { $("status").textContent = t("noWebhook"); return; }
  if (phone.length < 10) { $("phone").focus(); return; }
  try {
    const res = await fetch(settings.webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone, language: lang, answers,
        schemes: matched.map(s => ({ id: s.id, name: s.name[lang], benefit: s.benefit[lang], docs: s.docs[lang], where: s.where })),
        submittedAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) throw new Error(res.status);
    $("status").textContent = t("sent");
    speak(t("sent"));
  } catch {
    $("status").textContent = t("sendFail");
  }
}

function applyLang() {
  document.documentElement.lang = lang;
  $("tagline").textContent = t("tagline");
  $("langBtn").textContent = t("langBtn");
  $("textInput").placeholder = t("placeholder");
  for (const k of ["countLabel", "valueLabel", "sendLabel", "restartLabel", "disclaimer"]) $(k).textContent = t(k);
}
function start() {
  stopSpeaking();
  answers = {}; step = -1; matched = [];
  $("chat").innerHTML = "";
  $("results").classList.add("hidden");
  document.querySelector("main").classList.remove("has-results");
  applyLang();
  addMsg(t("hello"), "bot");
  nextStep(t("hello"));
}

// ---------- wiring ----------
$("micBtn").onclick = listen;
$("textForm").onsubmit = e => { e.preventDefault(); handleAnswer($("textInput").value); $("textInput").value = ""; };
$("langBtn").onclick = () => { lang = lang === "hi" ? "en" : "hi"; localStorage.setItem("saathi.lang", lang); start(); };
$("restartBtn").onclick = start;
$("sendBtn").onclick = sendToPhone;
$("settingsBtn").onclick = () => {
  $("elKey").value = settings.key; $("elVoice").value = localStorage.getItem("saathi.elVoice") || ""; $("n8nUrl").value = settings.webhook;
  $("settings").showModal();
};
$("saveSettings").onclick = () => {
  localStorage.setItem("saathi.elKey", $("elKey").value.trim());
  localStorage.setItem("saathi.elVoice", $("elVoice").value.trim());
  localStorage.setItem("saathi.n8n", $("n8nUrl").value.trim());
};
if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = () => {};
start();
