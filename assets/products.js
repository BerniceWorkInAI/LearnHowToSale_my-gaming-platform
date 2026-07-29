/* ═══════════════════════════════════════════════════════════════════
   Botler Sales HQ · le vrai catalogue (fiches anti-panique)
   ═══════════════════════════════════════════════════════════════════
   RÈGLE ABSOLUE · ce fichier est PUBLIC (le repo est public) :
   - AUCUN prix, AUCUNE condition commerciale, AUCUNE note interne ici.
     Les prix vivent dans le navigateur de Berni (bouton "✏️ My prices
     & links" de l'écran Products), jamais dans le repo.
   - AUCUNE adresse technique (.web.app, .run.app) : elles ne sont pas
     publiques et elles font "bricolage" chez un prospect. Uniquement
     les liens propres (vrai domaine ou fiche App Store).
   - Aucun argument inventé : tout vient de ce que le produit fait
     vraiment. Quand une info manque, on pose une question au prospect
     au lieu de promettre quelque chose.
   ─────────────────────────────────────────────────────────────────── */

window.PRODUCTS = [
  {
    key: 'Yousic',                          // valeur du champ "Brand" d'un prospect
    order: 1,
    em: '🎵',
    name: 'Yousic',
    ready: true,
    start: true,                            // ton produit d'échauffement
    what: 'A label that composes personalized songs on demand. You send the story, Yousic writes and produces the song, with an AI version or a human-finished version.',
    who: 'Businesses that already sell emotional moments, and can offer a song to their own clients.',
    targets: [
      'Wedding planners, reception venues, wedding DJs and photographers',
      'Bars and restaurants',
      'Works councils and staff committees (retirement, anniversaries, gifts)',
      'Event and team building agencies',
      'Florists, gift shops, concept stores',
      'Care homes and their activity leaders',
      'Schools, clubs and associations',
    ],
    proof: 'Live and already selling on yousic.ai',
    link: 'https://yousic.ai/',
    linkLabel: 'Open yousic.ai',
    args: [
      'You are not asking them to spend, you are handing them something to offer their own clients',
      'It lands on a moment they already sell: a wedding, a retirement, a birthday',
      'It is live and already selling, so there is nothing to wait for',
      'Two levels of finish, so there is an option for every budget',
    ],
    objections: [
      { they: 'My clients would never pay for that.', you: 'Some will not, and that is fine. The ones who cry at the first chorus are the ones who tell everyone where it came from.' },
      { they: 'I do not have time for an extra service.', you: 'You mention it once, that is all. Nothing changes in your own work.' },
      { they: 'Is it a real song?', you: 'Yes, written for their story, and there is a version finished by a human if they want that extra polish.' },
    ],
    script: {
      hookWhy: 'A song is a warm, low pressure conversation. Nobody gets defensive about music, so this is the gentlest door in your whole book.',
      lines: [
        'I work with Yousic, a small label that composes personalized songs on demand.',
        'I keep thinking a song written for [their clients] would land beautifully in what you already create for them.',
        'Would your clients love that, or is it not their style at all?',
      ],
    },
  },

  {
    key: 'Botler Pizza',
    order: 2,
    em: '🍕',
    name: 'Botler Pizza',
    ready: true,
    what: 'A ready-made website for pizzerias, with an assistant called Marco who answers customers in writing and by voice.',
    who: 'Pizzerias and independent restaurants, above all those with no website yet.',
    targets: [
      'Pizzerias with no website at all (your best opening)',
      'Pizzerias with only a social media page',
      'Independent restaurants taking every order by phone',
    ],
    proof: 'Live and ready to show at pizza.botler360.com',
    link: 'https://pizza.botler360.com/',
    linkLabel: 'Open the demo site',
    args: [
      'The easiest thing to show in your whole book: their future site, next to the one they have today',
      'Marco answers customers in writing and by voice, so the phone rings less in the middle of the rush',
      'The site is already built, they only have to look and say yes or no',
    ],
    objections: [
      { they: 'We already have Instagram.', you: 'Perfect, keep it. Instagram shows the food, the site takes the order. They do two different jobs.' },
      { they: 'I have no time for a website.', you: 'That is exactly the point. It is already built. You look at it once, that is your whole effort.' },
      { they: 'My customers like to call.', you: 'They still can. This just catches the ones who hang up when the line is busy.' },
    ],
    script: {
      hookWhy: 'You are not describing anything, you are showing. Their future site next to their current one does the selling for you.',
      lines: [
        'I work at Botler, we build ready-made sites for pizzerias with an assistant that answers customers in writing and by voice.',
        'I can show you what yours would look like, next to the one you have today. Two minutes to look at.',
        'Want me to send it over?',
      ],
    },
  },

  {
    key: 'Botler Ville',
    order: 3,
    em: '🏛️',
    name: 'Botler Ville · app for towns',
    ready: true,
    what: 'Websites and mobile apps for towns: practical information, events, local shops, and a local news journal.',
    who: 'Town halls. Inside them, three people to know: the communications officer, the DGS (directeur general des services, the senior civil servant who runs the administration day to day), and the mayor.',
    targets: [
      'Town halls with no mobile app',
      'Towns whose website is hard to use on a phone',
      'Neighbouring towns of a reference town (they compare each other constantly)',
    ],
    proof: 'Already live for Carpentras and Entraigues. The Carpentras app is in the App Store, so anyone can check it in ten seconds.',
    link: 'https://apps.apple.com/fr/app/carpentras-notre-ville/id6784992443',
    linkLabel: 'Carpentras in the App Store',
    args: [
      'You are not selling an idea, you are showing a finished app two towns already use',
      'It covers what residents actually ask about: practical info, events, local shops, local news',
      'It exists as a website and as a mobile app, so a town can start where it feels comfortable',
    ],
    objections: [
      { they: 'We already have a website.', you: 'Most towns do. The real question is whether residents open it on their phone. An app is what stays in their pocket.' },
      { they: 'This has to go through a public procurement process.', you: 'Very likely, and that is completely normal. My only goal today is that you have seen it, so you recognize it when the moment comes.' },
      { they: 'We are a small town.', you: 'Entraigues is not a big city either. Small towns often get the most out of it, because one app replaces five scattered channels.' },
    ],
    script: {
      hookWhy: 'Public sector answers slowly, so your job is not to close. Your job is to be remembered when the budget opens.',
      lines: [
        'I work at Botler. We build sites and mobile apps for towns: practical info, events, local shops, local news.',
        'Carpentras and Entraigues already use ours, and the Carpentras app is in the App Store if you want to see it in ten seconds.',
        'Would it help if I sent you the link?',
      ],
    },
  },

  {
    key: 'Botler Agent IA',
    order: 4,
    em: '🤖',
    name: 'Agent IA chat & voice',
    ready: true,
    what: 'An AI agent that talks with your customers in writing and by voice, connected to an admin dashboard where you see every conversation.',
    who: 'Any business drowning in the same repeated questions, by chat or by phone.',
    targets: [
      'Businesses whose phone rings all day for the same three questions',
      'Businesses with a contact form and no one to answer it fast',
      'Teams who lose requests between email, phone and social messages',
    ],
    proof: 'Three clients are already live. One of them you can show: cavalngo.botler360.com',
    link: 'https://cavalngo.botler360.com/',
    linkLabel: 'Open the Caval&Go example',
    args: [
      'It answers in writing AND by voice, so it covers the chat box and the phone habit at once',
      'Every conversation lands in one admin dashboard, so nothing gets lost',
      'Three clients already use it, and one is public, so you have something real to show',
    ],
    objections: [
      { they: 'People hate talking to robots.', you: 'They hate waiting more. This one actually answers, at 9pm, in writing or out loud.' },
      { they: 'What if it says something wrong?', you: 'It answers from the information you approve. And if they push further into how it works, say you will come back with the exact answer. Never guess, it costs more than it wins.' },
      { they: 'We are too small for AI.', you: 'Small teams feel it most. When you are three, one less interruption per hour changes your day.' },
    ],
    script: {
      hookWhy: 'Ask before you pitch. Once they tell you who answers the repetitive questions today, they have described their own problem out loud.',
      lines: [
        'I work at Botler. We set up an AI agent that answers your customers in writing and by voice, with one dashboard where you see every conversation.',
        'One of our clients has it live, so I can show you a real one rather than a slideshow.',
        'Out of curiosity, who handles the repetitive questions at your place today?',
      ],
    },
  },

  {
    key: 'Botler Travel',
    order: 5,
    em: '✈️',
    name: 'App for travel agencies, DMC & TO',
    ready: true,
    discovery: true,                        // pas de démo publique : on interroge, on ne promet rien
    what: 'An application built specifically for the travel trade: travel agencies, tour operators, and DMCs.',
    who: 'Three jobs worth knowing apart: a travel agency sells the trip to the traveller, a tour operator (TO) assembles the trip and often sells it through agencies, and a DMC or receptive is the company in the destination country that organizes things on the ground, hotels, guides, transfers.',
    targets: [
      'Independent travel agencies',
      'Tour operators building their own packages',
      'DMCs and receptives (the local operator in the destination)',
    ],
    proof: 'One travel client is already using it daily.',
    link: null,
    linkLabel: null,
    args: [
      'It was built for the travel trade specifically, not a generic tool bent into shape',
      'A real travel client already uses it every day',
      'You are talking to people whose job you can ask about honestly, and that is your strongest position',
    ],
    discoveryQ: [
      'How do you put a quote together today, and how long does it usually take?',
      'When a request lands at night, or from another time zone, what happens to it?',
      'What do you end up re-typing by hand more than once?',
    ],
    objections: [],
    script: {
      hookWhy: 'There is no public demo for this one yet, so do not describe features. Ask how they work today, and offer to show it live. Curiosity is honest, and it opens more doors than a pitch.',
      lines: [
        'I work at Botler. We built an application specifically for travel agencies, tour operators and DMCs, and one of them already uses it daily.',
        'Before I tell you anything about it: how do you put a quote together today, and how long does that usually take?',
        'Genuinely curious, and happy to show you the app live if it sounds relevant.',
      ],
    },
  },

  {
    key: 'BFF',
    order: 6,
    em: '🎁',
    name: 'BFF · funny formats',
    ready: false,
    what: 'A studio that turns one photo into funny images and texts: a fake book cover, a movie poster, a diploma, and more. 13 formats, available in 5 languages.',
    who: 'Not open for prospecting yet.',
    targets: [],
    proof: 'Online at bff.botler360.com. Have a look, do not send it to anyone yet.',
    link: 'https://bff.botler360.com/fr',
    linkLabel: 'Have a look (do not send)',
    args: [],
    objections: [],
    notReadyWhy: 'This one is not open for prospecting yet. Selling something before it is fully ready puts you in a position you do not deserve. It will come, and you will be told when.',
    script: null,
  },
];

/* ── retrouver le produit d'un prospect à partir de son champ "Brand" ── */
window.productByKey = function (brand) {
  const b = String(brand || '').trim().toLowerCase();
  if (!b) return null;
  return window.PRODUCTS.find(p => p.key.toLowerCase() === b) || null;
};
