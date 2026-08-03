/* ═══════════════════════════════════════════════════════════════════
   Botler Sales HQ · la banque de templates (validée par Berni)
   ═══════════════════════════════════════════════════════════════════
   L'échelle à 4 barreaux : hello → nudge (3j+) → value (8j+) → door (15j+),
   puis repos définitif : personne ne reçoit jamais un 5e message.

   Chaque message est COMPLET (bonjour → signature Bernice) et existe
   en anglais et en français (champ "lang" du prospect, en par défaut).

   Remplissage automatique depuis le carnet :
   - {name} {city}  : toujours remplis.
   - contact        : rempli si connu, sinon le bonjour marche sans
                      ("Hi 👋" / "Bonjour 👋").
   - hook           : le détail personnel trouvé par Claude à la
                      prospection ; s'il manque, le trou doré reste
                      visible pour que Berni le remplisse.
   Rotation des variantes : déterministe (id + envois), donc stable à
   l'écran, différente d'un prospect à l'autre : deux pizzerias de la
   même ville ne reçoivent pas le même texte.

   RÈGLE ABSOLUE : ce fichier est PUBLIC. Aucun prix, aucune condition,
   aucune adresse technique. Jamais d'em dash. Jamais de "coucou".
   Jamais de promesse de démo ou de rendez-vous tenus par Berni :
   elle ENVOIE des choses, elle ne promet jamais son agenda.
   ─────────────────────────────────────────────────────────────────── */

(function () {
  const SIGN = { en: 'Have a lovely day,\nBernice', fr: 'Belle journée,\nBernice' };

  const lang = p => String((p && p.lang) || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en';

  /* le bonjour : prénom si connu, sinon il marche tout seul */
  function greet(p, l) {
    const c = (p && p.contact || '').trim();
    if (l === 'fr') return c ? 'Bonjour ' + c + ' 👋' : 'Bonjour 👋';
    return c ? 'Hi ' + c + ' 👋' : 'Hi 👋';
  }
  function greetShort(p, l) {
    const c = (p && p.contact || '').trim();
    if (l === 'fr') return c ? 'Bonjour ' + c : 'Bonjour';
    return c ? 'Hi ' + c : 'Hi';
  }
  /* l'accroche du premier bonjour : nom + ville + détail personnel */
  function intro(p, l) {
    const name = p ? p.name : (l === 'fr' ? 'votre commerce' : 'your business');
    const city = (p && p.city) || (l === 'fr' ? 'votre coin' : 'your area');
    const hook = (p && p.hook || '').trim() || (l === 'fr' ? '[un détail vrai sur eux]' : '[something you liked]');
    return l === 'fr'
      ? greet(p, l) + ' J\'ai découvert ' + name + ' en m\'intéressant à ' + city + ', et j\'ai adoré ' + hook + ' !'
      : greet(p, l) + ' I came across ' + name + ' while looking at ' + city + ', and I loved ' + hook + '!';
  }

  /* ── les corps de message, par famille · [A1..] = codes validés ── */
  const NO = {
    en: 'And if it is a no, that is completely fine, just say so.',
    fr: 'Et si c\'est non, aucun souci, dites-le moi simplement.',
  };

  const HELLOS = {
    /* Yousic générique (A1, A2) */
    'Yousic': [
      { en: 'I work with Yousic, a small label that composes personalized songs on demand.\nI keep thinking a song written for your clients would land beautifully in what you already create for them.\nWould your clients love that, or is it not their style at all?\n' + NO.en,
        fr: 'Je travaille avec Yousic, un petit label qui compose des chansons personnalisées à la demande.\nJe me dis qu\'une chanson écrite pour vos clients trouverait naturellement sa place dans ce que vous créez déjà pour eux.\nVos clients adoreraient, ou ce n\'est pas du tout leur style ?\n' + NO.fr },
      { en: 'I work with Yousic, a small label that writes personalized songs on demand.\nImagine one of your clients hearing a song made from their own story, at a moment you organized. That is the kind of memory people talk about for years.\nIs that something your clients would be into?\nIf not, no worries at all, just tell me.',
        fr: 'Je travaille avec Yousic, un petit label qui écrit des chansons personnalisées à la demande.\nImaginez un de vos clients qui entend une chanson créée à partir de sa propre histoire, pendant un moment que vous avez organisé. C\'est le genre de souvenir dont on parle pendant des années.\nC\'est quelque chose qui plairait à vos clients ?\nSi non, aucun problème, dites-le moi 🙂' },
    ],
    'Botler Pizza': [
      { en: 'I work at Botler, we build ready-made sites for pizzerias with an assistant that answers customers in writing and by voice.\nI can send you what yours would look like, next to the one you have today. Two minutes to look at.\nWant me to send it over?\n' + NO.en,
        fr: 'Je travaille chez Botler, on crée des sites prêts à l\'emploi pour les pizzerias, avec un assistant qui répond aux clients à l\'écrit et à la voix.\nJe peux vous envoyer un aperçu du vôtre, à côté de celui que vous avez aujourd\'hui. Deux minutes à regarder.\nJe vous l\'envoie ?\n' + NO.fr },
      { en: 'I work at Botler, and we make websites for pizzerias that take orders even when the phone is busy.\nYours would already be built before we even talk: you look at it, you keep it or you do not, that is the whole deal.\nCurious to see what it looks like?\nIf not, just say no, it is completely fine.',
        fr: 'Je travaille chez Botler, on fait des sites pour pizzerias qui prennent les commandes même quand le téléphone est occupé.\nLe vôtre serait déjà construit avant même qu\'on se parle : vous le regardez, vous le gardez ou pas, c\'est tout.\nCurieux de voir à quoi il ressemble ?\nSinon, un simple non me va très bien.' },
    ],
    'Botler Ville': [
      { en: 'I work at Botler. We build sites and mobile apps for towns: practical info, events, local shops, local news.\nCarpentras and Entraigues already use ours, and the Carpentras app is in the App Store if you want to see it in ten seconds.\nWould it help if I sent you the link?\n' + NO.en,
        fr: 'Je travaille chez Botler. On crée des sites et des applications mobiles pour les communes : infos pratiques, événements, commerces locaux, actualités.\nCarpentras et Entraigues utilisent déjà les nôtres, et l\'appli de Carpentras est sur l\'App Store si vous voulez la voir en dix secondes.\nJe vous envoie le lien ?\nEt si ce n\'est pas le moment, aucun souci, dites-le moi.' },
      { en: 'I work at Botler, and we built the mobile app that Carpentras uses to talk to its residents: events, practical info, local shops, local news.\nI thought of your town because residents everywhere ask for the same thing: one place on their phone where everything is.\nWould you like to see the Carpentras app? It is in the App Store, ten seconds to look.\nIf the timing is wrong, no problem, just tell me.',
        fr: 'Je travaille chez Botler, et on a construit l\'application mobile que Carpentras utilise pour parler à ses habitants : événements, infos pratiques, commerces, actualités locales.\nJ\'ai pensé à votre commune parce que les habitants demandent partout la même chose : un seul endroit sur leur téléphone où tout se trouve.\nVous voulez voir l\'appli de Carpentras ? Elle est sur l\'App Store, dix secondes suffisent.\nSi le moment est mal choisi, pas de problème, dites-le moi.' },
    ],
    'Botler Agent IA': [
      { en: 'I work at Botler. We set up an AI agent that answers your customers in writing and by voice, with one dashboard where you see every conversation.\nOne of our clients has it live, so I can send you a real one to try rather than a slideshow.\nOut of curiosity, who handles the repetitive questions at your place today?\n' + NO.en,
        fr: 'Je travaille chez Botler. On installe un agent IA qui répond à vos clients à l\'écrit et à la voix, avec un tableau de bord où vous voyez chaque conversation.\nUn de nos clients l\'utilise en ligne, donc je peux vous envoyer un vrai exemple à tester plutôt qu\'une présentation.\nPar curiosité, qui s\'occupe des questions répétitives chez vous aujourd\'hui ?\nEt si c\'est non, c\'est tout à fait ok, dites-le moi.' },
      { en: 'I work at Botler. Quick question, honestly out of curiosity: when a customer writes or calls you at 9pm, what happens to that message today?\nWe set up an AI agent that answers in writing and by voice, and everything lands in one dashboard so nothing gets lost.\nI have a live example I can send you, a real client, not a demo video.\nAnd if this is not for you, just say so, zero hard feelings.',
        fr: 'Je travaille chez Botler. Une question, par simple curiosité : quand un client vous écrit ou vous appelle à 21h, que devient ce message aujourd\'hui ?\nOn installe un agent IA qui répond à l\'écrit et à la voix, et tout arrive dans un seul tableau de bord, donc rien ne se perd.\nJ\'ai un exemple en ligne à vous envoyer, un vrai client, pas une vidéo de démo.\nEt si ce n\'est pas pour vous, dites-le moi simplement, zéro souci.' },
    ],
    'Botler Travel': [
      { en: 'I work at Botler. We built an application specifically for travel agencies, tour operators and DMCs, and one of them already uses it daily.\nBefore I tell you anything about it: how do you put a quote together today, and how long does that usually take?\nGenuinely curious, and happy to send you a concrete overview if it sounds relevant.\n' + NO.en,
        fr: 'Je travaille chez Botler. On a construit une application spécialement pour les agences de voyages, les tour-opérateurs et les DMC, et l\'une d\'elles l\'utilise déjà au quotidien.\nAvant de vous en dire plus : comment montez-vous un devis aujourd\'hui, et combien de temps ça vous prend en général ?\nSincèrement curieuse, et ravie de vous envoyer un aperçu concret si ça vous parle.\n' + NO.fr },
      { en: 'I work at Botler, and we built an app made only for the travel trade: agencies, tour operators, DMCs. One travel company already runs on it daily.\nI am not going to list features, I would rather ask: what is the one task in your week that you re-type by hand more than once?\nIf the answer makes you sigh, I probably have something worth showing you.\nAnd if not, a no is perfectly fine, just say the word.',
        fr: 'Je travaille chez Botler, et on a créé une appli pensée uniquement pour les métiers du voyage : agences, tour-opérateurs, DMC. Une société de voyages tourne déjà dessus tous les jours.\nJe ne vais pas vous lister des fonctionnalités, je préfère vous demander : quelle est la tâche que vous retapez à la main plus d\'une fois par semaine ?\nSi la réponse vous fait soupirer, j\'ai sans doute quelque chose qui vaut le coup d\'œil.\nEt sinon, un non me va très bien, dites-le simplement.' },
    ],
  };

  /* le pack d'audiences Yousic (K1..K4) : choisi selon le MÉTIER du prospect */
  const YOUSIC_PACK = [
    { match: /école|ecole|school|collège|college|lycée|lycee|crèche|creche|conservatoire|music school/i,
      en: 'I work with Yousic, a small label that composes personalized songs on demand.\nFor a school, that can be a song about the class for the end-of-year show, or a lesson turned into music: children remember a melody far longer than a page.\nIs that something your team would enjoy exploring?\n' + NO.en,
      fr: 'Je travaille avec Yousic, un petit label qui compose des chansons personnalisées à la demande.\nPour une école, ça peut être une chanson sur la classe pour le spectacle de fin d\'année, ou une leçon transformée en musique : les enfants retiennent une mélodie bien plus longtemps qu\'une page.\nEst-ce que c\'est quelque chose que votre équipe aimerait explorer ?\n' + NO.fr },
    { match: /ehpad|care home|maison de retraite|résidence senior|residence senior|retirement|nursing/i,
      en: 'I work with Yousic, a small label that composes personalized songs on demand.\nFor a residence, a song written from a resident\'s own life story, for a birthday or a celebration, is the kind of moment families keep forever, and often exactly what they are looking for.\nWould that fit the moments you organize for your residents?\n' + NO.en,
      fr: 'Je travaille avec Yousic, un petit label qui compose des chansons personnalisées à la demande.\nPour une résidence, une chanson écrite à partir de l\'histoire de vie d\'un résident, pour un anniversaire ou une fête, c\'est le genre de moment que les familles gardent pour toujours, et souvent exactement ce qu\'elles cherchent.\nEst-ce que ça aurait sa place dans les moments que vous organisez pour vos résidents ?\n' + NO.fr },
    { match: /\bcse\b|works council|comité d'entreprise|comite d'entreprise|comité social|comite social/i,
      en: 'I work with Yousic, a small label that composes personalized songs on demand.\nFor a works council, it is an original gift idea: a retirement, a work anniversary, a colleague\'s big moment, told in a song written just for that person. It beats one more gift box.\nWould something like that have a place in your catalogue?\n' + NO.en,
      fr: 'Je travaille avec Yousic, un petit label qui compose des chansons personnalisées à la demande.\nPour un CSE, c\'est une idée cadeau originale : un départ en retraite, un anniversaire d\'ancienneté, le grand moment d\'un collègue, racontés dans une chanson écrite pour la personne. Ça change du énième coffret cadeau.\nEst-ce que ce genre d\'idée aurait sa place dans votre catalogue ?\n' + NO.fr },
    { match: /wedding|mariage|planner|venue|salle de réception|salle de reception|\bdj\b|photograph|traiteur/i,
      en: 'I work with Yousic, a small label that composes personalized songs on demand.\nYou already create couples\' big day. Imagine handing them a first-dance song that exists nowhere else, written from their own story: one more unforgettable memory, and it comes from you.\nWould your couples love that, or is it not their style?\n' + NO.en,
      fr: 'Je travaille avec Yousic, un petit label qui compose des chansons personnalisées à la demande.\nVous créez déjà le grand jour des couples. Imaginez leur offrir une chanson d\'ouverture de bal qui n\'existe nulle part ailleurs, écrite à partir de leur histoire : un souvenir inoubliable de plus, et il vient de vous.\nVos couples adoreraient, ou ce n\'est pas leur style ?\n' + NO.fr },
  ];

  /* Yousic direct (J1, J2) : des PERSONNES, pas des commerces.
     Vouvoiement toujours, jamais de coucou. Hors échelle : un seul message. */
  const YOUSIC_DIRECT = [
    { match: /particulier|individual|personne|friend|proche|anniversaire/i,
      en: g => g + '\nAn idea for [the birthday coming up]: instead of flowers or a voucher, imagine them hearing a song written from their own story. Their name, their memories, a real song.\nI work with Yousic, a small label that composes personalized songs on demand, and birthdays are where it shines the most.\nWant me to send you an example to listen to?\nAnd if it is not your thing, no worries at all 🙂\nBernice',
      fr: g => g + '\nUne idée pour [l\'anniversaire qui approche] : au lieu des fleurs ou d\'une carte cadeau, imaginez la personne qui découvre une chanson écrite à partir de sa propre histoire. Son prénom, ses souvenirs, une vraie chanson.\nJe travaille avec Yousic, un petit label qui compose des chansons personnalisées à la demande, et les anniversaires sont son plus beau terrain.\nVoulez-vous que je vous envoie un exemple à écouter ?\nEt si ce n\'est pas votre style, aucun souci 🙂\nBernice' },
    { match: /fiancé|fiance|futur marié|future mariée|couple|témoin|temoin/i,
      en: g => g + '\nI heard a wedding is coming, congratulations! Quick thought: the most unforgettable first dances happen on songs that exist nowhere else, written from the couple\'s own story.\nThat is exactly what Yousic does, a small label composing personalized songs on demand. You send the story, they turn it into the song.\nWant to hear what one sounds like?\nAnd if you already have THE song, even better 🙂\nBernice',
      fr: g => g + '\nJ\'ai appris qu\'un mariage se prépare, toutes mes félicitations ! Les ouvertures de bal les plus inoubliables se dansent sur des chansons qui n\'existent nulle part ailleurs, écrites à partir de l\'histoire du couple.\nC\'est exactement ce que fait Yousic, un petit label qui compose des chansons personnalisées à la demande : vous envoyez l\'histoire, ils en font la chanson.\nVoulez-vous écouter ce que ça donne ?\nEt si vous avez déjà LA chanson, tant mieux 🙂\nBernice' },
  ];

  /* F1 : aucun produit choisi : on ne vend rien, on ouvre la conversation */
  const HELLO_GENERIC = {
    en: 'I work at Botler, we build websites and AI assistants for businesses like yours.\nQuick question before I say anything else: when a customer wants to find you or order from you, how do they do it today?\nAnd if this is not for you, just say so, that is completely fine.',
    fr: 'Je travaille chez Botler, on crée des sites web et des assistants IA pour des commerces comme le vôtre.\nUne question avant toute chose : quand un client veut vous trouver ou commander chez vous, comment fait-il aujourd\'hui ?\nEt si ce n\'est pas pour vous, dites-le moi simplement, c\'est tout à fait ok.',
  };

  /* barreau 2 · relances douces (G1, G2) · pareilles pour tous les produits */
  const NUDGES = [
    { en: g => g + ', just a gentle nudge on my last message 🙂\nNo rush at all. Happy to answer any question, or send you a short example to look at whenever suits.\nAnd if it is a no for now, that is completely fine too. Just say so and I will stop nudging.',
      fr: g => g + ', une petite relance en douceur sur mon dernier message 🙂\nAucune urgence. Ravie de répondre à vos questions, ou de vous envoyer un court exemple à regarder quand ça vous arrange.\nEt si c\'est non pour l\'instant, c\'est tout à fait ok aussi. Dites-le moi et j\'arrête de vous relancer.' },
    { en: g => g + ' 🙂 me again, just floating my last message back to the top of your inbox.\nI know how weeks fill up, so truly, no rush.\nIf it helps, I can send a short example instead of a conversation, whichever is lighter for you.\nAnd a simple "not interested" works too, I will not insist after that.',
      fr: g => g + ' 🙂 je me permets de faire remonter mon dernier message en haut de votre boîte.\nJe sais à quel point les semaines se remplissent, donc vraiment, aucune urgence.\nSi c\'est plus simple, je peux vous envoyer un court exemple plutôt qu\'une conversation, comme vous préférez.\nEt un simple « pas intéressé » fonctionne aussi, je n\'insisterai pas après ça.' },
  ];

  /* barreau 3 · relances valeur (H1..H5) · une chose NOUVELLE par produit */
  const VALUE = {
    'Yousic': {
      en: g => g + ', I thought of you because I listened to a song Yousic made for a couple\'s anniversary this week, and it genuinely gave me goosebumps.\nIt made me picture what one would sound like for your clients.\nEverything is on yousic.ai if you want to hear examples yourself, no account needed.\nStill a no? Totally fine, tell me and I will leave you in peace 🙂',
      fr: g => g + ', j\'ai pensé à vous parce que j\'ai écouté cette semaine une chanson que Yousic a créée pour un anniversaire de mariage, et j\'ai eu des frissons, sincèrement.\nÇa m\'a fait imaginer ce que ça donnerait pour vos clients.\nTout est sur yousic.ai si vous voulez écouter des exemples vous-même, sans créer de compte.\nToujours non ? Aucun souci, dites-le moi et je vous laisse tranquille 🙂' },
    'Botler Pizza': {
      en: g => g + ', small update from my side: the demo site I mentioned is live at pizza.botler360.com, so you can see a finished pizzeria site without talking to anyone.\nMarco, the assistant on it, answers in writing and out loud. Try asking him for a margherita, honestly, it is fun.\nIf it makes you curious about what YOUR site would look like, I can prepare it.\nAnd if not, just say stop and I will stop 🙂',
      fr: g => g + ', petite nouvelle de mon côté : le site de démo dont je parlais est en ligne sur pizza.botler360.com, vous pouvez voir un site de pizzeria terminé sans parler à personne.\nMarco, l\'assistant dessus, répond à l\'écrit et à la voix. Demandez-lui une margherita, vous verrez, c\'est assez étonnant.\nSi ça vous donne envie de voir à quoi ressemblerait LE VÔTRE, je peux le préparer.\nEt sinon, dites stop et j\'arrête 🙂' },
    'Botler Ville': {
      en: g => g + ', in case a link is easier than a conversation: the Carpentras app is public in the App Store, you can hold it in your hand in ten seconds.\nEntraigues uses it too, so you would not be the test town, you would be the third.\nWould it be useful if I sent a short summary you can forward internally? These decisions are rarely one person\'s.\nNo urgency on my side, and a no is always fine.',
      fr: g => g + ', au cas où un lien serait plus simple qu\'une conversation : l\'appli de Carpentras est publique sur l\'App Store, vous pouvez l\'avoir en main en dix secondes.\nEntraigues l\'utilise aussi, donc vous ne seriez pas la commune test, vous seriez la troisième.\nEst-ce que ce serait utile que je vous envoie un court résumé à faire suivre en interne ? Ces décisions se prennent rarement seul.\nAucune urgence de mon côté, et un non est toujours ok.' },
    'Botler Agent IA': {
      en: g => g + ', one concrete thing since my last message: you can talk to a live agent we built, on a real client\'s site, right now: cavalngo.botler360.com.\nAsk it anything a customer would ask. That is the honest test.\nIf it answers better than you expected, imagine it trained on YOUR business instead.\nAnd if this is a no, one word is enough, I will not insist 🙂',
      fr: g => g + ', une chose concrète depuis mon dernier message : vous pouvez parler à un agent que nous avons construit, sur le site d\'un vrai client, là maintenant : cavalngo.botler360.com.\nPosez-lui n\'importe quelle question qu\'un client poserait. C\'est le test honnête.\nS\'il répond mieux que ce que vous imaginiez, imaginez-le formé sur VOTRE activité.\nEt si c\'est non, un mot suffit, je n\'insisterai pas 🙂' },
    'Botler Travel': {
      en: g => g + ', I will not pretend this is not a follow-up, but it comes with something real: the travel company using our app runs their daily quotes through it.\nI put together a short overview, real screens, no marketing talk, that I can send you by email. Five minutes to read, on your own time.\nWould that be worth a look?\nIf not, tell me no and I will close the file gracefully 🙂',
      fr: g => g + ', je ne vais pas faire semblant que ce n\'est pas une relance, mais elle vient avec du concret : la société de voyages qui utilise notre appli y fait ses devis tous les jours.\nJ\'ai préparé un court aperçu, de vrais écrans, sans discours marketing, que je peux vous envoyer par email. Cinq minutes de lecture, quand vous voulez.\nEst-ce que ça vaudrait le coup d\'œil ?\nSinon, dites-moi non et je referme le dossier proprement 🙂' },
  };

  /* barreau 4 · la porte ouverte (I1, I2) · dernier message, puis repos */
  const DOORS = [
    { en: (g, n) => g + ', last message from me, promise 🙂\nI figure the timing is just not right, and that is completely okay.\nI will leave you in peace, and if one day the subject comes back around, my door is open, you know where to find me.\nWishing you a great season with ' + n + ' 🌟\nBernice',
      fr: (g, n) => g + ', dernier message de ma part, promis 🙂\nJ\'imagine que ce n\'est simplement pas le bon moment, et c\'est tout à fait ok.\nJe vous laisse tranquille, et si un jour le sujet revient, ma porte est ouverte, vous savez où me trouver.\nTrès belle saison à ' + n + ' 🌟\nBernice' },
    { en: g => g + ', I will stop nudging after this one, promise 🙂\nNo answer is also an answer, and I respect it.\nIf things change in six months, a two-word reply to this message is all it takes to pick the conversation back up.\nTake care, and good luck with everything!\nBernice',
      fr: g => g + ', j\'arrête de vous relancer après celui-ci, promis 🙂\nPas de réponse, c\'est aussi une réponse, et je la respecte.\nSi les choses changent dans six mois, deux mots en réponse à ce message suffisent pour reprendre la conversation.\nPrenez soin de vous, et bonne continuation !\nBernice' },
  ];

  /* quand ILS répondent 🧯 · les scripts anti-panique (R1..R5)
     Réponses dans le fil : pas de grand bonjour, juste la signature.
     JAMAIS de prix ici (repo public) : les chiffres partent par email,
     depuis les notes privées de Berni. */
  const REPLIES = [
    { key: 'price', label: { en: '💰 "How much is it?"', fr: '💰 « C\'est combien ? »' },
      en: () => 'Great question, and it depends on what you actually need, so I will not throw a random number at you.\nTell me one thing: [the one question that sizes their need]?\nWith that, I can send you the exact numbers by email today, no surprises hidden anywhere.\nBernice',
      fr: () => 'Très bonne question, et ça dépend de ce dont vous avez vraiment besoin, donc je ne vais pas vous lancer un chiffre au hasard.\nDites-moi une chose : [la question qui dimensionne leur besoin] ?\nAvec ça, je vous envoie les chiffres exacts par email aujourd\'hui, sans surprise cachée.\nBernice' },
    { key: 'notime', label: { en: '⏰ "I have no time"', fr: '⏰ « Pas le temps »' },
      en: () => 'Completely fair, and honestly that is the best argument FOR it: everything is already built, your part is small.\nHow about this: I send you one link, you look whenever you want, even at 11pm.\nIf it does nothing for you, you close the tab and we are done. Deal?\nBernice',
      fr: () => 'Complètement compréhensible, et honnêtement c\'est le meilleur argument POUR : tout est déjà construit, votre part est minuscule.\nJe vous propose : je vous envoie un lien, vous regardez quand vous voulez, même à 23h.\nSi ça ne vous fait rien, vous fermez l\'onglet et on en reste là. Ça marche ?\nBernice' },
    { key: 'already', label: { en: '📱 "We already have a site / Instagram"', fr: '📱 « On a déjà un site / Instagram »' },
      en: () => 'And keep it! Instagram shows your world, that job is done and done well.\nThe question is what happens when someone wants to ORDER or ASK something: today that lands on your phone, and a busy line is a lost order.\nWant to see how the two work side by side? One link, two minutes.\nBernice',
      fr: () => 'Et gardez-le ! Instagram montre votre univers, ce travail-là est fait, et bien fait.\nLa question, c\'est ce qui se passe quand quelqu\'un veut COMMANDER ou poser une question : aujourd\'hui ça tombe sur votre téléphone, et une ligne occupée, c\'est une commande perdue.\nVous voulez voir comment les deux fonctionnent côte à côte ? Un lien, deux minutes.\nBernice' },
    { key: 'no', label: { en: '🦁 "No thanks" (your brave no, +15)', fr: '🦁 « Non merci » (ton non courageux, +15)' },
      en: p => 'Thank you for the straight answer, sincerely. Most people just go silent, and a clear no is a gift.\nI will close the file and leave you in peace.\nIf anything changes someday, you know where I am. All the best with ' + (p ? p.name : 'your business') + '!\nBernice',
      fr: p => 'Merci pour cette réponse franche, sincèrement. La plupart des gens disparaissent en silence, un non clair est un cadeau.\nJe referme le dossier et je vous laisse tranquille.\nSi les choses changent un jour, vous savez où me trouver. Belle continuation à ' + (p ? p.name : 'votre commerce') + ' !\nBernice' },
    { key: 'yes', label: { en: '🎉 "Yes, interested, what now?"', fr: '🎉 « Oui, intéressé, on fait quoi ? »' },
      en: p => 'Love it 🙂 Here is the simplest next step: I send you ' + demoLink(p, 'en') + ' right now, so you can see the real thing today.\nTake your time with it, and if you like what you see, just tell me: I will organize the next step, everything by email, at your pace.\nBernice',
      fr: p => 'Super 🙂 Le plus simple : je vous envoie ' + demoLink(p, 'fr') + ' tout de suite, comme ça vous voyez du concret dès aujourd\'hui.\nPrenez le temps de regarder, et si ça vous plaît, dites-le moi : j\'organise la suite, tout par email, à votre rythme.\nBernice' },
  ];
  /* le lien de démo se remplit tout seul si la fiche produit en a un */
  function demoLink(p, l) {
    const pr = p && window.productByKey ? window.productByKey(p.brand) : null;
    if (pr && pr.link) return pr.link;
    return l === 'fr' ? '[le lien de démo de leur produit]' : '[the demo link for their product]';
  }

  /* ── choisir la variante : déterministe, stable à l'écran ──
     (id + nombre d'envois) : varie d'un prospect à l'autre et d'un
     barreau à l'autre, sans jamais changer sous les yeux de Berni. */
  function variant(p, n) {
    if (n <= 1) return 0;
    return (((p && p.id) || 0) + ((p && p.sends) || 0)) % n;
  }

  function isIndividual(p) {
    return !!(p && /particulier|individual|personne|friend|proche/i.test(p.trade || ''));
  }

  /* le message d'un barreau : 'hello' | 'nudge' | 'value' | 'door' */
  function compose(p, rung) {
    const l = lang(p);
    const g = greetShort(p, l);

    if (rung === 'hello') {
      const pr = p && window.productByKey ? window.productByKey(p.brand) : null;
      /* Yousic : le métier choisit l'angle (pack K), les personnes ont le leur (J) */
      if (pr && pr.key === 'Yousic' && p) {
        if (isIndividual(p)) {
          const wedding = /mariage|wedding|fiancé|fiance|couple|témoin|temoin/i.test(p.trade || '');
          return YOUSIC_DIRECT[wedding ? 1 : 0][l](greet(p, l));
        }
        const pack = YOUSIC_PACK.find(t => t.match.test(p.trade || ''));
        if (pack) return intro(p, l) + '\n' + pack[l] + '\n' + SIGN[l];
      }
      const fam = pr && HELLOS[pr.key];
      const body = fam ? fam[variant(p, fam.length)][l] : HELLO_GENERIC[l];
      return intro(p, l) + '\n' + body + '\n' + SIGN[l];
    }
    if (rung === 'value') {
      const pr = p && window.productByKey ? window.productByKey(p.brand) : null;
      const fam = pr && VALUE[pr.key];
      if (fam) return fam[l](g) + '\n' + SIGN[l];
      /* pas de produit : la relance douce sait tout faire */
      return NUDGES[variant(p, NUDGES.length)][l](g) + '\n' + SIGN[l];
    }
    if (rung === 'door') {
      const d = DOORS[variant(p, DOORS.length)];
      return d[l](g, p ? p.name : (l === 'fr' ? 'votre commerce' : 'your business'));
    }
    /* 'nudge' et tout le reste */
    return NUDGES[variant(p, NUDGES.length)][l](g) + '\n' + SIGN[l];
  }

  /* les réponses anti-panique, prêtes pour la fiche prospect */
  function replies(p) {
    const l = lang(p);
    return REPLIES.map(r => ({ key: r.key, label: r.label[l], text: r[l](p) }));
  }

  window.TemplateBank = { compose, replies, lang };
})();
