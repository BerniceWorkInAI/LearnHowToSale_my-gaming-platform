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
    seq: 0,
  });

  let st = null;
  try { st = JSON.parse(localStorage.getItem(KEY)); } catch (e) { st = null; }
  if (!st || st.v !== 1) st = fresh();
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

  /* ── la quête du jour : relances d'abord, puis un bonjour, puis le carnet ── */
  function genQuest() {
    const moves = [];
    const active = st.prospects.filter(p => p.level < 3);
    const quiet = active
      .filter(p => p.lastTouch && daysBetween(p.lastTouch, today()) >= 3)
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

  /* ── les scripts : courts, chaleureux, une question à la fin, jamais d'em dash ── */
  const TRADE = t => {
    t = (t || '').toLowerCase();
    if (/pizz|resto|restaurant/.test(t)) return { em: '🍕', pitch: 'we build simple ordering sites for restaurants' };
    if (/boulang|bak|pâtiss|patiss/.test(t)) return { em: '🥐', pitch: 'we build simple sites with click and collect for bakeries' };
    if (/bouch|butch|traiteur/.test(t)) return { em: '🥩', pitch: 'we build simple order-ahead sites for butchers' };
    if (/club|asso|pta|school/.test(t)) return { em: '🏛️', pitch: 'we build simple sites for clubs and associations' };
    if (/coiff|barb|salon|hair/.test(t)) return { em: '💈', pitch: 'we build simple booking sites for salons' };
    if (/dent|cabinet|avocat|solicitor|practice|libr/.test(t)) return { em: '☎️', pitch: 'we set up an AI phone receptionist for practices' };
    return { em: '📇', pitch: 'we build simple websites with an AI assistant for local businesses' };
  };

  function getScript(p, type) {
    const tr = TRADE(p && p.trade);
    if (type === 'hello') {
      const hook = p && !p.website
        ? 'I noticed you do not seem to have a website yet'
        : 'I had a look at your online presence';
      return 'Hi [first name] 👋 I came across ' + (p ? p.name : 'your business') + ' while browsing ' + (p ? p.city : 'your city') + ' businesses, [something you liked]!\n'
        + 'Quick question: ' + hook + '. When a customer wants to find or order from you, how do they do it today?\n'
        + 'I work at Botler, ' + tr.pitch + '. One-off price, no monthly fees.\n'
        + 'Worth a 10-minute look?';
    }
    if (type === 'nudge') {
      return 'Hi [first name], just a gentle nudge on my last message 🙂\n'
        + 'No rush at all. Happy to answer any question, or show you a quick 10-minute demo whenever suits.\n'
        + 'And if it is a no for now, that is completely fine too. Just say so and I will stop nudging.';
    }
    return '';
  }

  /* ── vue d'une action (pour le Home et le mode quête) ── */
  function moveView(m) {
    const p = m.pid !== undefined ? st.prospects.find(x => x.id === m.pid) : null;
    const tr = p ? TRADE(p.trade) : null;
    if (m.type === 'hello') return {
      icon: '✉️', pts: 10,
      title: 'Say hi to ' + p.name,
      desc: 'First message · ' + p.trade + ' · ' + p.city + ' · script ready to copy',
      channel: p.linkedin ? '💼 Send this on LINKEDIN · direct message' : '✉️ Send this by EMAIL',
      btn: p.linkedin ? 'I sent it on LinkedIn ✔ +10' : 'I sent it by email ✔ +10',
      why: (p.website ? 'They have a site, but no AI assistant. ' : 'No website found. That is your best opening. ') + tr.em + ' Exactly what Botler fixes.',
      script: getScript(p, 'hello'), p
    };
    if (m.type === 'nudge') return {
      icon: '🔁', pts: 10,
      title: 'Follow up with ' + p.name,
      desc: 'Quiet for ' + daysBetween(p.lastTouch, today()) + ' days · one gentle nudge · script ready',
      channel: p.email ? '✉️ Send this by EMAIL · reply to your last thread' : '💼 Send this on LINKEDIN · same conversation',
      btn: 'I sent the nudge ✔ +10',
      why: 'A gentle nudge doubles your chances. Nudging is caring.',
      script: getScript(p, 'nudge'), p
    };
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
  function award(pts) { st.points += pts; st.week.moves++; bumpStreak(); checkTrophies(); save(); }

  function completeMove(qid) {
    const m = st.quest.find(x => x.id === qid);
    if (!m || m.done) return null;
    m.done = true;
    const v = moveView(m);
    if (v.p) {
      v.p.lastTouch = today();
      if (m.type === 'hello') v.p.helloSent = true;
      v.p.history.push({ d: today(), txt: m.type === 'hello' ? 'You said hi ✉️ First brave move.' : 'You sent a gentle nudge 🔁' });
      if (!st.trophies.firstHello) st.trophies.firstHello = today();
    }
    award(v.pts);
    return v;
  }
  function skipMove(qid) {
    const m = st.quest.find(x => x.id === qid);
    if (m) { m.skipped = true; m.done = true; save(); }
  }

  /* ── agir directement depuis la fiche prospect ──
     Si l'action fait partie de la quête du jour, elle y est cochée aussi
     (jamais de double comptage de points). */
  function touchProspect(pid, type) {
    const m = st.quest.find(x => !x.done && x.pid === pid && x.type === type);
    if (m) return completeMove(m.id);
    const p = st.prospects.find(x => x.id === pid);
    if (!p) return null;
    p.lastTouch = today();
    if (type === 'hello') {
      p.helloSent = true;
      p.history.push({ d: today(), txt: 'You said hi ✉️ First brave move.' });
      if (!st.trophies.firstHello) st.trophies.firstHello = today();
    } else {
      p.history.push({ d: today(), txt: 'You sent a gentle nudge 🔁' });
    }
    award(10);
    return { pts: 10 };
  }

  /* la prochaine action suggérée pour UN prospect */
  function nextMoveFor(p) {
    if (!p || p.level === 3) return null;
    if (!p.helloSent) return { type: 'hello', pid: p.id };
    const quiet = p.lastTouch ? daysBetween(p.lastTouch, today()) : 99;
    if (quiet >= 3) return { type: 'nudge', pid: p.id };
    return null;
  }

  /* ── prospects ── */
  function addProspect(f) {
    const p = {
      id: ++st.seq,
      name: f.name, trade: f.trade || 'local business', city: f.city || '',
      website: f.website || '', linkedin: f.linkedin || '', email: f.email || '',
      level: 0, helloSent: false, lastTouch: null,
      history: [{ d: today(), txt: 'Added to your book 📇' }],
      createdAt: today(),
    };
    st.prospects.unshift(p);
    const addMove = st.quest.find(m => m.type === 'add' && !m.done);
    if (addMove) addMove.done = true;
    award(5);
    return p;
  }
  function moveUp(id) {
    const p = st.prospects.find(x => x.id === id);
    if (!p || p.level >= 3) return null;
    p.level++;
    p.lastTouch = today();
    const label = ['', 'They replied! Moved up to Interested ✨', 'Demo booked! Moved up to Demo 📅', 'They said YES! CLIENT 🏆'][p.level];
    p.history.push({ d: today(), txt: label });
    if (p.level === 1 && !st.trophies.firstReply) st.trophies.firstReply = today();
    if (p.level === 2 && !st.trophies.firstDemo) st.trophies.firstDemo = today();
    if (p.level === 3) { st.clients++; if (!st.trophies.firstClient) st.trophies.firstClient = today(); }
    award(20);
    return p;
  }
  function braveNo(id) {
    const k = st.prospects.findIndex(x => x.id === id);
    if (k < 0) return;
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
  function charSay(screen) {
    const c = CHARACTERS[st.character];
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
  function sayBubble(screen) {
    const c = charSay(screen);
    if (!c) return '';
    return '<div class="say' + (st.character === 'injection' ? ' injection' : '') + '">'
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
    const head = ['Name', 'Trade', 'City', 'Website', 'LinkedIn', 'Email', 'Added', 'Last touch', 'Days quiet', 'Story so far'];
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
        p.name, p.trade, p.city, p.website || 'no site yet 🎯', p.linkedin, p.email,
        p.createdAt, p.lastTouch || '',
        p.lastTouch ? daysBetween(p.lastTouch, today()) : '',
        p.history.map(h => h.d + ' · ' + h.txt).join('  |  '),
      ]));
      lines.push([]);
    });
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
    save, ensureDay, genQuest, moveView, completeMove, skipMove,
    addProspect, moveUp, braveNo, addNote, removeProspect, resetAll,
    touchProspect, nextMoveFor,
    TROPHY_DEFS, nextTreat, lessonOfDay,
    CHARACTERS, setCharacter, charLine, charSay, sayBubble,
    exportData, exportCSV, importData,
    esc, toast, confetti, dateLine, today, nice, daysBetween,
    WEEK_GOAL: 12,
  };
})();
