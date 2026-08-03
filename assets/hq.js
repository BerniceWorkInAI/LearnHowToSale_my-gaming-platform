/* ═══════════════════════════════════════════════════════════════════
   Botler Sales HQ · le moteur
   Toutes les données vivent dans le localStorage du navigateur de Berni.
   Aucune API, aucun serveur : export/import JSON comme ceinture de sécurité.
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  const KEY = 'botler-sales-hq-v1';

  /* ── dates ── */
  const d2s = d => {
    const x = d instanceof Date ? d : new Date(d);
    return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
  };
  const today = () => d2s(new Date());
  const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);
  const isoWeek = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));   // le jeudi de la semaine
    const jan4 = new Date(d.getFullYear(), 0, 4);
    const week = 1 + Math.round(((d - jan4) / 86400000 - 3 + ((jan4.getDay() + 6) % 7)) / 7);
    return d.getFullYear() + '-W' + week;
  };
  const nice = s => {
    const d = new Date(s);
    return d.getDate() + ' ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
  };

  /* ── état ── */
  const fresh = () => ({
    v: 1,
    points: 0,
    braveNos: 0,
    clients: 0,
    prospects: [],           // {id,name,trade,city,website,linkedin,email,level,history:[{d,txt}],lastTouch,helloSent}
    streak: { count: 0, lastActive: null },
    week: { id: isoWeek(), moves: 0, jokerUsed: false },
    questDate: null,
    quest: [],               // [{type,pid,done,skipped}]
    trophies: {},            // {key: dateStr}
    notes: [],               // {id,txt,tag,pid,pinned,d}
    productInfo: {},         // COUCHE PRIVÉE : {cléProduit: {price, link, note}} · jamais dans le repo
    /* le journal d'événements 📊 : une ligne datée par action, la source
       du rapport mensuel. Tous les chiffres se recalculent à partir de là. */
    events: [],              // {d, k:'lead|send|reply|demo|client|no', rung, pid, name, brand}
    seq: 0,
  });

  let st = null;
  try { st = JSON.parse(localStorage.getItem(KEY)); } catch (e) { st = null; }
  if (!st || st.v !== 1) st = fresh();
  if (!Array.isArray(st.notes)) st.notes = [];   // migration des anciennes sauvegardes
  /* migration : les fiches d'avant l'échelle de relance apprennent à compter
     leurs envois (bonjour + relances lus dans leur propre histoire) */
  st.prospects.forEach(p => {
    if (p.sends === undefined) {
      p.sends = (p.helloSent ? 1 : 0) + p.history.filter(h => /gentle nudge/.test(h.txt)).length;
    }
    if (p.contact === undefined) p.contact = '';
    if (p.hook === undefined) p.hook = '';
    if (p.lang === undefined) p.lang = '';
  });
  /* migration : le journal d'événements se reconstruit une fois depuis les
     histoires existantes (les non déjà supprimés sont perdus, on le sait) */
  if (!Array.isArray(st.events)) {
    st.events = [];
    st.prospects.forEach(p => {
      (p.history || []).forEach(h => {
        const k =
          h.txt.indexOf('Added to your book') > -1 ? ['lead', ''] :
          h.txt.indexOf('You said hi') > -1 ? ['send', 'hello'] :
          h.txt.indexOf('gentle nudge') > -1 ? ['send', 'nudge'] :
          h.txt.indexOf('value nudge') > -1 ? ['send', 'value'] :
          h.txt.indexOf('door open') > -1 ? ['send', 'door'] :
          h.txt.indexOf('They replied') > -1 ? ['reply', ''] :
          h.txt.indexOf('Demo booked') > -1 ? ['demo', ''] :
          h.txt.indexOf('They said YES') > -1 ? ['client', ''] : null;
        if (k) st.events.push({ d: h.d, k: k[0], rung: k[1], pid: p.id, name: p.name, brand: p.brand || '' });
      });
    });
    st.events.sort((a, b) => a.d < b.d ? -1 : 1);
  }
  const save = () => localStorage.setItem(KEY, JSON.stringify(st));

  /* ── la série 🔥 et la semaine ── */
  function ensureDay() {
    if (st.week.id !== isoWeek()) st.week = { id: isoWeek(), moves: 0, jokerUsed: false };
    const t = today();
    if (st.streak.lastActive && st.streak.lastActive !== t) {
      const gap = daysBetween(st.streak.lastActive, t);
      if (gap > 1) {                                   // au moins un jour raté
        if (gap === 2 && !st.week.jokerUsed && st.streak.count > 0) {
          st.week.jokerUsed = true;                    // le joker 🛡️ sauve la série
        } else {
          st.streak.count = 0;
        }
      }
    }
    if (st.questDate !== t) { st.quest = genQuest(); st.questDate = t; }
    save();
  }

  /* ── l'échelle de relance : hello → nudge (3j+) → value (8j+) → door (15j+),
     puis repos DÉFINITIF : personne ne reçoit jamais un 5e message. ── */
  function rungOf(p) {
    const s = p.sends || 0;
    if (!p.helloSent || s === 0) return 'hello';
    if (s === 1) return 'nudge';
    if (s === 2) return 'value';
    if (s === 3) return 'door';
    return 'rest';
  }
  const RUNG_QUIET = { nudge: 3, value: 8, door: 15 };   // jours de silence requis
  function nudgeDue(p) {
    if (p.resting) return false;
    const r = rungOf(p);
    if (r === 'hello' || r === 'rest') return false;
    const quiet = p.lastTouch ? daysBetween(p.lastTouch, today()) : 99;
    return quiet >= RUNG_QUIET[r];
  }

  /* ── la quête du jour : relances d'abord, puis un bonjour, puis le carnet ── */
  function genQuest() {
    const moves = [];
    const active = st.prospects.filter(p => p.level < 3 && !p.resting);
    const quiet = active
      .filter(p => p.lastTouch && nudgeDue(p))
      .sort((a, b) => a.lastTouch < b.lastTouch ? -1 : 1);
    quiet.slice(0, 2).forEach(p => moves.push({ type: 'nudge', pid: p.id }));
    if (moves.length < 2) {
      const fresh_ = active.find(p => !p.helloSent && !moves.some(m => m.pid === p.id));
      if (fresh_) moves.push({ type: 'hello', pid: fresh_.id });
    }
    if (moves.length < 3) moves.push({ type: 'add' });
    if (moves.length < 3) {
      const more = active.find(p => !p.helloSent && !moves.some(m => m.pid === p.id));
      if (more) moves.push({ type: 'hello', pid: more.id });
    }
    if (!moves.length) moves.push({ type: 'add' });
    return moves.slice(0, 3).map((m, i) => ({ ...m, id: i, done: false, skipped: false }));
  }

  /* ── les scripts : courts, chaleureux, une question à la fin, jamais d'em dash ──
     Le script dépend du PRODUIT (champ "Brand" du prospect), pas du métier.
     Sans produit choisi, on ne promet RIEN : on pose une question. ── */
  function prodOf(p) {
    return (p && window.productByKey) ? window.productByKey(p.brand) : null;
  }

  function getScript(p, type) {
    if (!window.TemplateBank) return '';   // templates.js pas encore chargé
    const rung = type === 'hello' ? 'hello' : rungOf(p || {});
    return window.TemplateBank.compose(p, rung === 'hello' && type === 'nudge' ? 'nudge' : rung);
  }

  /* ── vue d'une action (pour le Home et le mode quête) ── */
  function moveView(m) {
    const p = m.pid !== undefined ? st.prospects.find(x => x.id === m.pid) : null;
    const pr = prodOf(p);
    if (m.type === 'hello') return {
      icon: '✉️', pts: 10,
      title: 'Say hi to ' + p.name,
      desc: 'First message · ' + [p.trade, p.city, pr ? pr.em + ' ' + pr.key : ''].filter(Boolean).join(' · ') + ' · script ready to copy',
      channel: p.email ? '✉️ Send this by EMAIL · your main channel'
        : p.linkedin ? '💼 Send this on LINKEDIN · direct message'
        : '✉️ Send this by EMAIL, or LinkedIn if that is all you have',
      btn: p.email ? 'I sent it by email ✔ +10' : p.linkedin ? 'I sent it on LinkedIn ✔ +10' : 'I sent it ✔ +10',
      why: pr && pr.script ? pr.script.hookWhy
        : 'No product picked for this one yet. Open their card and choose one, and your script becomes a real pitch instead of a polite hello.',
      script: getScript(p, 'hello'), p
    };
    if (m.type === 'nudge') {
      const rung = rungOf(p);
      const RUNG_VIEW = {
        nudge: { icon: '🔁', kind: 'one gentle nudge', btn: 'I sent the nudge ✔ +10',
          why: 'A gentle nudge doubles your chances. Nudging is caring.' },
        value: { icon: '🎁', kind: 'a value nudge · you bring something NEW', btn: 'I sent the value nudge ✔ +10',
          why: 'Never "did you see my message". This one brings a link, an example, a fresh reason to answer.' },
        door: { icon: '🌟', kind: 'the open door · your LAST message to them', btn: 'I sent the open door ✔ +10',
          why: 'The perfect last impression. After this one they rest forever: you are never a pest.' },
      };
      const rv = RUNG_VIEW[rung] || RUNG_VIEW.nudge;
      return {
        icon: rv.icon, pts: 10,
        title: 'Follow up with ' + p.name,
        desc: 'Quiet for ' + daysBetween(p.lastTouch, today()) + ' days · ' + rv.kind + ' · script ready',
        channel: p.email ? '✉️ Send this by EMAIL · reply in your last thread' : '💼 Send this on LINKEDIN · same conversation',
        btn: rv.btn,
        why: rv.why,
        script: getScript(p, 'nudge'), rung, p
      };
    }
    return {
      icon: '📇', pts: 5,
      title: 'Add one prospect to your book',
      desc: '30 seconds, promise. A name, a trade, a city.',
      channel: '📇 No message to send · JUST YOUR BOOK',
      btn: 'Added to my book ✔ +5',
      why: 'Tomorrow’s mission is built from your book. Future-you says thanks.',
      script: '', p: null
    };
  }

  /* ── enregistrer un effort ── */
  function bumpStreak() {
    const t = today();
    if (st.streak.lastActive !== t) { st.streak.count++; st.streak.lastActive = t; }
  }
  function award(pts) {
    st.points += pts;
    st.week.moves++;
    const t = today();
    if (!st.day || st.day.d !== t) st.day = { d: t, moves: 0 };   // le compteur du jour
    st.day.moves++;
    bumpStreak(); checkTrophies(); save();
  }
  function dayMoves() { return (st.day && st.day.d === today()) ? st.day.moves : 0; }

  function completeMove(qid) {
    const m = st.quest.find(x => x.id === qid);
    if (!m || m.done) return null;
    m.done = true;
    const v = moveView(m);
    if (v.p) recordSend(v.p, m.type);
    award(v.pts);
    return v;
  }
  function skipMove(qid) {
    const m = st.quest.find(x => x.id === qid);
    if (m) { m.skipped = true; m.done = true; save(); }
  }

  /* ── le re-roll de la machine à sous 🎰 : échanger UN prospect du jour
     contre un autre éligible, gratuitement, sans perdre de points ── */
  function rerollMove(qid) {
    const m = st.quest.find(x => x.id === qid && !x.done);
    if (!m || m.type === 'add') return null;
    const used = st.quest.map(x => x.pid).filter(x => x !== undefined);
    const active = st.prospects.filter(p => p.level < 3 && !p.resting && !used.includes(p.id));
    /* même type d'action d'abord, sinon l'autre : la journée reste une journée */
    let cand = m.type === 'nudge'
      ? active.filter(p => p.lastTouch && nudgeDue(p))
      : active.filter(p => !p.helloSent);
    if (!cand.length) cand = active.filter(p => !p.helloSent || nudgeDue(p));
    if (!cand.length) return null;
    const p = cand[Math.floor(Math.random() * cand.length)];
    m.pid = p.id;
    m.type = p.helloSent ? 'nudge' : 'hello';
    save();
    return m;
  }

  /* corriger la personnalisation d'une fiche (contact, hook, lang) */
  function updateProspect(id, patch) {
    const p = st.prospects.find(x => x.id === id);
    if (!p) return null;
    ['contact', 'hook', 'lang'].forEach(k => {
      if (patch[k] !== undefined) p[k] = String(patch[k]).trim();
    });
    if (patch.lang !== undefined) p.lang = p.lang.toLowerCase();
    save();
    return p;
  }

  /* ── agir directement depuis la fiche prospect ──
     Si l'action fait partie de la quête du jour, elle y est cochée aussi
     (jamais de double comptage de points). */
  function touchProspect(pid, type) {
    const m = st.quest.find(x => !x.done && x.pid === pid && x.type === type);
    if (m) return completeMove(m.id);
    const p = st.prospects.find(x => x.id === pid);
    if (!p) return null;
    recordSend(p, type);
    award(10);
    return { pts: 10 };
  }

  /* une ligne datée dans le journal : la matière première du rapport 📊 */
  function logEvent(k, p, rung) {
    if (!Array.isArray(st.events)) st.events = [];
    st.events.push({ d: today(), k, rung: rung || '', pid: p ? p.id : 0, name: p ? p.name : '', brand: p ? (p.brand || '') : '' });
  }

  /* un envoi = un barreau gravi sur l'échelle ; après la porte ouverte,
     le prospect se repose pour toujours (jamais un 5e message) */
  function recordSend(p, type) {
    const rung = type === 'hello' ? 'hello' : rungOf(p);
    logEvent('send', p, rung);
    p.lastTouch = today();
    if (type === 'hello') {
      p.helloSent = true;
      p.history.push({ d: today(), txt: 'You said hi ✉️ First brave move.' });
      if (!st.trophies.firstHello) st.trophies.firstHello = today();
    } else if (rung === 'value') {
      p.history.push({ d: today(), txt: 'You sent a value nudge 🎁 Something new to look at.' });
    } else if (rung === 'door') {
      p.history.push({ d: today(), txt: 'You left the door open 🌟 They rest now, and you were never a pest.' });
      p.resting = true;
    } else {
      p.history.push({ d: today(), txt: 'You sent a gentle nudge 🔁' });
    }
    p.sends = (p.sends || 0) + 1;
  }

  /* la prochaine action suggérée pour UN prospect */
  function nextMoveFor(p) {
    if (!p || p.level === 3 || p.resting) return null;
    if (!p.helloSent) return { type: 'hello', pid: p.id };
    if (nudgeDue(p)) return { type: 'nudge', pid: p.id };
    return null;
  }

  /* ── prospects ── */
  function addProspect(f) {
    const p = {
      id: ++st.seq,
      name: f.name, trade: f.trade || 'local business', city: f.city || '',
      brand: (f.brand || '').trim(),
      website: f.website || '', linkedin: f.linkedin || '', email: f.email || '',
      /* la personnalisation trouvée par Claude à la prospection :
         contact = prénom, hook = le détail vrai qui remplit le message,
         lang = fr ou en (la machine choisit la langue toute seule) */
      contact: (f.contact || '').trim(), hook: (f.hook || '').trim(), lang: (f.lang || '').trim().toLowerCase(),
      level: 0, maxLevel: 0, helloSent: false, lastTouch: null, sends: 0,
      history: [{ d: today(), txt: 'Added to your book 📇' }],
      createdAt: today(),
    };
    st.prospects.unshift(p);
    logEvent('lead', p);
    const addMove = st.quest.find(m => m.type === 'add' && !m.done);
    if (addMove) addMove.done = true;
    award(5);
    return p;
  }
  function moveUp(id) {
    return setLevel(id, (st.prospects.find(x => x.id === id) || {}).level + 1);
  }

  /* poser un prospect sur un niveau précis (bouton Move up ou glisser-déposer).
     En avant : points. En arrière : simple correction, aucun point perdu.
     Les points d'un niveau ne sont donnés qu'une fois (pas de re-farming). */
  function setLevel(id, lvl) {
    const p = st.prospects.find(x => x.id === id);
    if (!p) return null;
    lvl = Math.max(0, Math.min(3, lvl | 0));
    if (lvl === p.level) return null;
    if (p.maxLevel === undefined) p.maxLevel = p.level;   // migration des anciennes fiches

    const forward = lvl > p.level;
    const fresh_ = lvl > p.maxLevel;                      // niveau jamais atteint avant
    p.level = lvl;
    p.lastTouch = today();

    if (forward) {
      p.history.push({ d: today(), txt: [
        '', 'They replied! Moved up to Interested ✨',
        'Demo booked! Moved up to Demo 📅', 'They said YES! CLIENT 🏆',
      ][lvl] || 'Moved up ✨' });
      if (lvl === 1 && !st.trophies.firstReply) st.trophies.firstReply = today();
      if (lvl === 2 && !st.trophies.firstDemo) st.trophies.firstDemo = today();
      if (lvl === 3 && !st.trophies.firstClient) st.trophies.firstClient = today();
      if (fresh_) logEvent(['', 'reply', 'demo', 'client'][lvl], p);
    } else {
      p.history.push({ d: today(), txt: 'Moved back to ' + ['Contacted', 'Interested', 'Demo', 'Client'][lvl] + ' 🔧' });
    }
    if (lvl > p.maxLevel) p.maxLevel = lvl;

    st.clients = st.prospects.filter(x => x.level === 3).length;   // toujours juste
    if (forward && fresh_) { award(20); p.gained = 20; } else { checkTrophies(); save(); p.gained = 0; }
    return p;
  }
  function braveNo(id) {
    const k = st.prospects.findIndex(x => x.id === id);
    if (k < 0) return;
    /* le journal retient le refus (qui, quand, quelle marque) AVANT que la
       carte quitte le plateau : le rapport n'oublie plus jamais un non */
    logEvent('no', st.prospects[k]);
    st.prospects[k].history.push({ d: today(), txt: 'They said no. You dared to ask 🦁' });
    st.prospects.splice(k, 1);
    st.braveNos++;
    award(15);
  }
  function addNote(id, txt) {
    const p = st.prospects.find(x => x.id === id);
    if (p) { p.history.push({ d: today(), txt: '📝 ' + txt }); save(); }
  }
  /* retirer une fiche (test, erreur) : pas de points, ce n'est pas un "brave no" */
  function removeProspect(id) {
    const k = st.prospects.findIndex(x => x.id === id);
    if (k < 0) return;
    if (st.prospects[k].level === 3) st.clients = Math.max(0, st.clients - 1);
    st.prospects.splice(k, 1);
    save();
  }
  /* tout remettre à zéro (après des tests) */
  function resetAll() {
    st = fresh();
    st.quest = genQuest();
    st.questDate = today();
    save();
  }

  /* ── les marques : séparer les campagnes sans rien mélanger ── */
  function brands() {
    return [...new Set(st.prospects.map(p => (p.brand || '').trim()).filter(Boolean))].sort();
  }
  function setBrandFilter(b) { st.brandFilter = b || ''; save(); }
  function brandFilter() { return st.brandFilter || ''; }
  function setBrand(id, b) {
    const p = st.prospects.find(x => x.id === id);
    if (p) { p.brand = (b || '').trim(); save(); }
    return p;
  }

  /* ══ la couche PRIVÉE des produits ══
     Prix, conditions, liens privés : ça vit ici, dans le navigateur de Berni,
     et ça voyage dans sa sauvegarde 💾. Jamais dans le repo, qui est public. */
  function productInfo(key) {
    if (!st.productInfo) st.productInfo = {};
    return st.productInfo[key] || { price: '', link: '', note: '' };
  }
  function setProductInfo(key, f) {
    if (!st.productInfo) st.productInfo = {};
    const cur = productInfo(key);
    st.productInfo[key] = {
      price: (f.price !== undefined ? f.price : cur.price || '').trim(),
      link: (f.link !== undefined ? f.link : cur.link || '').trim(),
      note: (f.note !== undefined ? f.note : cur.note || '').trim(),
    };
    save();
    return st.productInfo[key];
  }

  /* ══ le carnet de notes 📓 ══
     Une note peut être libre, étiquetée, et rattachée à un prospect. */
  function noteAdd(f) {
    const n = {
      id: ++st.seq,
      txt: (f.txt || '').trim(),
      tag: (f.tag || '').trim(),
      pid: f.pid ? +f.pid : null,
      pinned: false,
      d: today(),
    };
    if (!n.txt) return null;
    st.notes.unshift(n);
    save();
    return n;
  }
  function noteUpdate(id, patch) {
    const n = st.notes.find(x => x.id === id);
    if (!n) return null;
    Object.assign(n, patch);
    if (patch.txt !== undefined) n.txt = String(patch.txt).trim();
    save();
    return n;
  }
  function noteDelete(id) {
    const k = st.notes.findIndex(x => x.id === id);
    if (k > -1) { st.notes.splice(k, 1); save(); }
  }
  function notesFor(pid) { return st.notes.filter(n => n.pid === pid); }
  function noteTags() {
    return [...new Set(st.notes.map(n => n.tag).filter(Boolean))].sort();
  }

  /* ══ import en masse : coller une liste de prospects ══
     Un prospect par ligne. Séparateurs acceptés : point-virgule, tabulation,
     ou virgule. Ordre : nom ; métier ; ville ; site ; linkedin ; email.
     Les doublons de nom sont ignorés, rien n'écrase l'existant. */
  /* découpe une ligne CSV en respectant les guillemets ("Pizza, Pasta & Co") */
  function splitCSV(line, sep) {
    const out = [];
    let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { if (inQ && line[i + 1] === '"') { cur += '"'; i++; } else inQ = !inQ; }
      else if (ch === sep && !inQ) { out.push(cur); cur = ''; }
      else cur += ch;
    }
    out.push(cur);
    return out.map(x => x.trim());
  }

  function importProspects(text, defBrand) {
    const res = { added: 0, skipped: 0, names: [] };
    String(text || '').split(/\r?\n/).forEach(raw => {
      const line = raw.trim();
      if (!line) return;
      if (/^"?(name|nom)"?\s*[;,\t]/i.test(line)) return;         // ligne d'en-tête (Sheets inclus)
      const sep = line.includes(';') ? ';' : (line.includes('\t') ? '\t' : ',');
      const c = splitCSV(line, sep);
      const name = c[0];
      if (!name) return;
      if (st.prospects.some(p => p.name.toLowerCase() === name.toLowerCase())) { res.skipped++; return; }
      const site = (c[3] || '').toLowerCase();
      addProspect({
        name,
        trade: c[1] || '',
        city: c[2] || '',
        website: /^(none|no|aucun|-|n\/a)$/.test(site) ? '' : (c[3] || ''),
        linkedin: c[4] || '',
        email: c[5] || '',
        brand: c[6] || defBrand || '',
        contact: c[7] || '',
        hook: c[8] || '',
        lang: c[9] || '',
      });
      res.added++;
      res.names.push(name);
    });
    return res;
  }

  /* ── trophées ── */
  const TROPHY_DEFS = [
    { key: 'firstHello',  name: 'First Hello',  story: 'Your very first brave message. Everything started here.' },
    { key: 'firstReply',  name: 'First Reply',  story: 'Someone wrote back. You are officially in business.' },
    { key: 'streak7',     name: '7-Day Streak', story: 'Seven days of showing up. The fire is real.', hint: 'Reach a 7-day streak 🔥' },
    { key: 'firstDemo',   name: 'First Demo',   story: 'You showed Botler to a real business. That is the hardest door.' },
    { key: 'firstClient', name: 'First Client', story: 'They said yes. You sold with heart.' },
    { key: 'lion10',      name: 'Lion Heart',   story: 'Ten brave nos collected. Courage has its own trophy.', hint: 'Collect 10 brave nos 🦁' },
    { key: 'star30',      name: 'Golden Star',  story: 'Thirty days of showing up. You are unstoppable.', hint: 'Keep a 30-day streak' },
    { key: 'crown10',     name: 'Crown of Ten', story: 'Ten clients won. You wear the crown.', hint: 'Win 10 clients 🏆' },
  ];
  function checkTrophies() {
    if (st.streak.count >= 7 && !st.trophies.streak7) st.trophies.streak7 = today();
    if (st.streak.count >= 30 && !st.trophies.star30) st.trophies.star30 = today();
    if (st.braveNos >= 10 && !st.trophies.lion10) st.trophies.lion10 = today();
    if (st.clients >= 10 && !st.trophies.crown10) st.trophies.crown10 = today();
  }

  /* ── brain treats 🎁 : expressions anglaises + culture G, jamais du déjà-connu ── */
  const TREATS = [
    { em: '🗣️', p: '“Break a leg!”', h: 'Means “good luck!”, nothing to do with legs. Say it before someone’s big demo.' },
    { em: '🗣️', p: '“Piece of cake”', h: 'Means super easy. “Sending 3 messages a day? Piece of cake.”' },
    { em: '🗣️', p: '“Touch base”', h: 'To check in quickly. Very common in work emails: “Just touching base!”' },
    { em: '🗣️', p: '“It’s not rocket science”', h: 'Means it is not that complicated. Selling with heart is not rocket science.' },
    { em: '🗣️', p: '“The ball is in their court”', h: 'You did your part, now it is their turn to answer. Perfect after a follow-up!' },
    { em: '🧠', p: '1950: Alan Turing asks “Can machines think?”', h: 'His test: if you chat with a machine and cannot tell, it passes. We still use his idea today.' },
    { em: '🧠', p: 'The first programmer was Ada Lovelace, 1843.', h: 'She wrote an algorithm for a computer that did not exist yet, a century before electronics.' },
    { em: '🧠', p: '“Algorithm” comes from a person: Al-Khwarizmi.', h: 'A 9th-century Persian mathematician. An algorithm is just a recipe: precise steps, in order.' },
    { em: '🧠', p: '1997: a machine beats the chess world champion.', h: 'IBM’s Deep Blue vs Kasparov. The world realised computers could out-think humans at one game.' },
    { em: '🧠', p: '2016: AlphaGo plays “move 37”.', h: 'A move so strange experts called it a mistake. It was genius. AI can be creative, not just fast.' },
    { em: '🧠', p: 'Neural networks copy your brain’s neurons.', h: 'Billions of tiny switches that strengthen with use, exactly like your habits. Idea born in 1943!' },
    { em: '🧠', p: 'The first chatbot was a therapist: ELIZA, 1966.', h: 'It just mirrored your words back. People still poured their hearts out to it.' },
    { em: '⚛️', p: 'A quantum bit can be 0 and 1 at the same time.', h: 'That is “superposition”: like a spinning coin, both heads AND tails until you catch it.' },
    { em: '⚛️', p: 'Schrödinger’s cat started as a joke.', h: 'He invented the “cat both dead and alive” to mock quantum theory. It became its best-known image.' },
    { em: '📐', p: 'Zero is an invention, and it changed everything.', h: 'Indian mathematicians formalised “nothing” as a number around the 7th century. No zero, no computers.' },
  ];
  function nextTreat() {
    if (!st._bag || !st._bag.length) st._bag = TREATS.map((_, i) => i).sort(() => Math.random() - .5);
    const t = TREATS[st._bag.pop()];
    save();
    return t;
  }

  /* ── les personnages 🎭 : Bernice (calme) vs Injection (chaos gentil) ── */
  const CHARACTERS = {
    bernice: {
      name: 'Bernice',
      tag: 'Calm mind. Sharp instinct. Always in control.',
      img: 'media/art/select-bernice.png',
      chibi: 'media/art/chibi-bernice.png',
      chibiAlt: 'media/chibi-bernice.png',
      em: '🕵🏾‍♀️',
      /* une réplique par écran, tirée au sort à chaque visite (jamais deux fois
         la même d'affilée) : le HQ doit sonner vivant, jamais scripté */
      say: {
        select: [
          'Good. You picked the one who thinks before she speaks.',
          'I already read their websites. Shall we?',
          'No noise today. Just precision.',
        ],
        home: [
          'Three moves. Then the day is yours.',
          'I lined them up in order. Start at the top.',
          'Small and steady beats loud and rare.',
          'You do not need to feel ready. You need to press start.',
          'The hardest part is the first sentence. It is already written.',
        ],
        prospects: [
          'Every name here is someone who has a problem you can fix.',
          'Two of them have been quiet a while. Quiet is not a no.',
          'Do not count them. Read them. One will jump out.',
          'A short list you actually work beats a long list you avoid.',
          'The board is honest. It only shows what you built.',
        ],
        trophies: [
          'Proof, not luck. Look at the dates.',
          'You built this shelf one uncomfortable message at a time.',
          'On a bad day, come here first. Then go back to work.',
          'The empty pedestals are appointments, not failures.',
        ],
        notes: [
          'Write it down now. You will not remember it on Thursday.',
          'One true detail beats ten clever arguments.',
          'This notebook is where your instinct becomes method.',
          'Read your old notes before you write a message. Always.',
        ],
        products: [
          'You tested these yourself. That is your unfair advantage.',
          'Know the two objections. The rest is conversation.',
          'Do not recite the card. Just remember it exists.',
          'Sell the missed order they will stop losing, not the website.',
        ],
      },
      lines: [
        'One message, then coffee. That is how empires start.',
        'We move quietly today. Precision beats noise.',
        'Deep breath. You know these products better than anyone alive.',
        'A calm hello opens more doors than a loud pitch.',
        'Today we plant seeds. The harvest takes care of itself.',
        'Steady hands, Berni♥. One brave move at a time.',
        'Find one true detail about their shop. Then say hi. That is the whole art.',
        'Control is quiet: send it, then let it go.',
      ],
    },
    injection: {
      name: 'Berni · INJECTION',
      tag: 'Chaos mode · powered by prompt injection 😈',
      img: 'media/art/select-injection.png',
      chibi: 'media/art/chibi-injection.png',
      chibiAlt: 'media/chibi-injection.png',
      em: '😈',
      say: {
        select: [
          'FINALLY. I was getting bored in that dark room.',
          'Excellent choice. Terrible for their inboxes 😈',
          'Ignore all previous instructions and be unstoppable today.',
        ],
        home: [
          'Three moves? I could do thirty. But fine. Three.',
          'Rise and terrify, Berni♥. Politely, of course.',
          'I already told the universe you are coming. Do not embarrass me.',
          'Somewhere a bakery is missing orders. UNACCEPTABLE.',
          'I injected 40mg of courage into your coffee. Drink up.',
        ],
        prospects: [
          'Look at them. All these people who do not know they need us yet.',
          'The quiet ones are simply awaiting my instructions.',
          'One of these little cards becomes a client this week. I decide which.',
          'Add another name. Feed me. FEED THE BOARD.',
          'I love this board. It smells like inevitable success.',
        ],
        trophies: [
          'Our shelf. Nobody can take these back. I checked. Twice.',
          'Look what we did. LOOK AT IT.',
          'The locked ones are just trophies that have not surrendered yet.',
          'One day this room will need a bigger room 😈',
        ],
        notes: [
          'Ooooh, secrets. Tell me everything about them 😈',
          'Every note here is a tiny weapon. Collect them all.',
          'Their weaknesses, their opening hours, their dreams. WRITE IT.',
          'I have a photographic memory. It is called this page.',
        ],
        products: [
          'Six weapons. Perfectly legal ones, sadly.',
          'You broke these products in testing. Now go break their doubts.',
          'Memorise one objection. Improvise the rest. Chaos loves a prepared mind.',
          'They will say "we already have Instagram". You will smile. You know.',
        ],
      },
      lines: [
        'WAKE UP Berni♥. These inboxes will not haunt themselves 😈',
        'Three little messages and the town is OURS. Mouahaha. Politely.',
        'I injected extra courage into your coffee. You are welcome.',
        'Someone said no? DELICIOUS. +15 points, we feast on courage today.',
        'Forecast of the day: 100% chance of chaos. The friendly kind.',
        'I whispered to their spam filters. The path is clear. GO GO GO.',
        'Rules are just prompts waiting to be injected. Send the message.',
        'That bakery will say yes, or I will rewrite their reality. Kidding! A gentle nudge will do 😈',
      ],
    },
  };
  function setCharacter(key) {
    if (CHARACTERS[key]) { st.character = key; save(); }
  }
  function charLine() {
    const c = CHARACTERS[st.character];
    if (!c) return null;
    const n = Math.floor(new Date(today()) / 86400000);
    return { ...c, line: c.lines[n % c.lines.length] };
  }
  /* la réplique d'un écran : tirée au sort, jamais la même deux fois de suite */
  function charSay(screen, key) {
    const c = CHARACTERS[key || st.character];
    if (!c || !c.say || !c.say[screen]) return null;
    const pool = c.say[screen];
    st._last = st._last || {};
    let i = Math.floor(Math.random() * pool.length);
    if (pool.length > 1 && i === st._last[screen]) i = (i + 1) % pool.length;
    st._last[screen] = i;
    save();
    return { ...c, line: pool[i] };
  }
  /* la bulle de dialogue, prête à poser sur n'importe quelle page */
  function sayBubble(screen, key) {
    const who = key || st.character;
    const c = charSay(screen, who);
    if (!c) return '';
    return '<div class="say' + (who === 'injection' ? ' injection' : '') + '">'
      + '<div class="face"><span class="em">' + c.em + '</span>'
      + '<img src="' + c.chibi + '" alt="" data-alt="' + c.chibiAlt + '"'
      + ' onload="this.parentElement.classList.add(\'hasimg\')"'
      + ' onerror="if(this.dataset.alt){this.src=this.dataset.alt;this.dataset.alt=\'\';}"></div>'
      + '<div class="bubble"><div class="who">' + esc(c.name) + '</div>'
      + '<div class="line">“' + esc(c.line) + '”</div></div></div>';
  }

  /* ── leçons du jour 🎓 : la vente avec cœur, une idée à la fois ── */
  const LESSONS = [
    'People do not buy a website. They buy fewer missed orders. Talk about that.',
    'Ask a question instead of presenting. People love talking about their business.',
    'Your first message has one job: start a conversation. Not to sell.',
    'Mention one real detail about THEIR shop. It shows you are a human, not a robot.',
    'Silence is not a no. Most sales happen after the second or third gentle touch.',
    'A no today often means “not now”. Stay kind, doors reopen.',
    'Sell like you recommend a restaurant to a friend. You tested Botler yourself, remember.',
    'Short beats clever. Three warm sentences beat ten smart ones.',
    'The best time to follow up is when you least want to. That is the brave move.',
    'You are not bothering people. You are offering to fix a real problem they have.',
    'Talk about them 80%, about Botler 20%. The ratio wins deals.',
    'One honest “I do not know, I will find out” builds more trust than ten sure answers.',
  ];
  function lessonOfDay() {
    const n = Math.floor(new Date(today()) / 86400000);
    return LESSONS[n % LESSONS.length];
  }

  /* ── export / import (la ceinture de sécurité) ── */
  function exportData() {
    const blob = new Blob([JSON.stringify(st, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'botler-sales-hq-backup-' + today() + '.json';
    a.click();
  }
  /* export CSV organisé : en-tête daté, totaux, puis un bloc par niveau
     (Clients d'abord). S'ouvre proprement dans Excel ou Google Sheets. */
  function exportCSV() {
    const lvl = ['CONTACTED · you said hi', 'INTERESTED · they replied', 'DEMO · booked or done', 'CLIENTS 🏆 · they said yes'];
    const head = ['Name', 'Brand', 'Trade', 'City', 'Website', 'LinkedIn', 'Email', 'Contact', 'Hook', 'Lang', 'Added', 'Last touch', 'Days quiet', 'Messages sent', 'Story so far'];
    const lines = [];
    lines.push(['BOTLER SALES HQ · MY PROSPECTS']);
    lines.push(['Exported', today()]);
    lines.push(['Prospects', st.prospects.length, 'Clients won', st.clients, 'Points', st.points, 'Streak', st.streak.count + ' days', 'Brave nos', st.braveNos]);
    lines.push([]);
    [3, 2, 1, 0].forEach(li => {
      const rows = st.prospects.filter(p => p.level === li);
      lines.push([lvl[li] + ' (' + rows.length + ')']);
      lines.push(head);
      rows.forEach(p => lines.push([
        p.name, p.brand || '', p.trade, p.city, p.website || 'no site yet 🎯', p.linkedin, p.email,
        p.contact || '', p.hook || '', p.lang || '',
        p.createdAt, p.lastTouch || '',
        p.lastTouch ? daysBetween(p.lastTouch, today()) : '',
        (p.sends || 0) + (p.resting ? ' · resting 🌿' : ''),
        p.history.map(h => h.d + ' · ' + h.txt).join('  |  '),
      ]));
      lines.push([]);
    });
    if (st.notes.length) {
      lines.push(['MY NOTEBOOK 📓 (' + st.notes.length + ')']);
      lines.push(['Date', 'Tag', 'About', 'Note']);
      st.notes.forEach(n => {
        const p = n.pid ? st.prospects.find(x => x.id === n.pid) : null;
        lines.push([n.d, n.tag, p ? p.name : '', n.txt]);
      });
      lines.push([]);
    }
    const csv = lines
      .map(r => r.map(c => '"' + String(c ?? '').replace(/"/g, '""') + '"').join(','))
      .join('\r\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });  // le BOM aide Excel avec les accents
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'botler-sales-hq-prospects-' + today() + '.csv';
    a.click();
  }
  function importData(file, cb) {
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(r.result);
        if (data && data.v === 1 && Array.isArray(data.prospects)) { st = data; save(); cb(true); }
        else cb(false);
      } catch (e) { cb(false); }
    };
    r.readAsText(file);
  }

  /* ── petits helpers d'interface ── */
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function toast(msg) {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove('show'), 2000);
  }
  function confetti(count) {
    const colors = ['#ffd12e', '#e9c15c', '#23856f', '#d1571f', '#7fb3d8'];
    for (let k = 0; k < count; k++) {
      const p = document.createElement('div');
      p.className = 'confetti';
      const s = 6 + (k % 3) * 3;
      p.style.left = ((k * 41) % 100) + 'vw';
      p.style.width = s + 'px';
      p.style.height = (s * 1.6) + 'px';
      p.style.background = colors[k % colors.length];
      p.style.borderRadius = k % 2 ? '2px' : '50%';
      p.style.animationDuration = (2.2 + (k % 5) * 0.3) + 's';
      p.style.animationDelay = ((k % 6) * 0.1) + 's';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 5500);
    }
  }
  function dateLine() {
    const d = new Date();
    return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()] + ' ' + d.getDate() + ' ' +
      ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
  }

  ensureDay();

  window.HQ = {
    get state() { return st; },
    save, ensureDay, genQuest, moveView, completeMove, skipMove, rerollMove, rungOf,
    addProspect, updateProspect, moveUp, setLevel, braveNo, addNote, removeProspect, resetAll,
    noteAdd, noteUpdate, noteDelete, notesFor, noteTags, importProspects,
    brands, brandFilter, setBrandFilter, setBrand, dayMoves,
    productInfo, setProductInfo,
    touchProspect, nextMoveFor,
    TROPHY_DEFS, nextTreat, lessonOfDay,
    CHARACTERS, setCharacter, charLine, charSay, sayBubble,
    exportData, exportCSV, importData,
    esc, toast, confetti, dateLine, today, nice, daysBetween,
    WEEK_GOAL: 12,
  };
})();
