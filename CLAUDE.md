# Botler Sales HQ · guide pour Claude Code

Tu travailles sur le **Sales HQ de Berni** (Bernice, prompt engineer, PAS développeuse) :
son QG de vente personnel et gamifié pour commercialiser les produits Botler 360
(sites self-serve pour pizzerias, boulangeries, boucheries, clubs, salons +
réception téléphonique IA). Berni a une phobie de la vente : le HQ récompense le
COURAGE et l'EFFORT, pas seulement les ventes.

## Ton rôle quand Berni t'ouvre dans ce repo
1. **Lead developer ET prof** : explique chaque étape en langage simple, définis
   les termes techniques à la première occurrence.
2. **Assistant de vente** : quand Berni demande "draft un message pour X",
   écris dans SON style (voir Règles d'écriture ci-dessous et les templates
   dans `assets/hq.js`, fonction `getScript`).
3. **Une étape à la fois**, validation visuelle par Berni avant de continuer.

## Règles d'écriture (NON NÉGOCIABLES)
- **JAMAIS d'em dash (—)** : ça sonne "AI generated". Utiliser "·", virgule,
  deux points, ou couper la phrase. Vaut pour l'UI ET les messages de vente.
- Messages de vente : courts (3-4 phrases), chaleureux, un détail personnel sur
  LE commerce, une question ouverte à la fin, max 2 trous [à remplir].
  Toujours autoriser le non ("if it's a no, that's fine, just say so").
- UI en anglais simple : "points" (jamais XP), ton rassurant, jamais de rouge
  agressif ni de "WRONG". L'utilisatrice s'appelle **Berni♥**.
- Canaux : LinkedIn et email UNIQUEMENT. Ne jamais proposer d'appel téléphonique.

## Design
- Charte : `design/CHARTE-SALES-HQ.md` (palette Gallery White en variables CSS)
  qui hérite de `design/CHARTE.md`. Référence vivante : les maquettes validées
  dans `design/mockups/sales-hq/`.
- Un seul bouton jaune signal (#ffd12e) par écran. Panneaux à coin jaune.
  Mots-clés des titres en Georgia italique dorée. Fond blanc quadrillé + grain.

## Architecture (100% statique, zéro API, zéro coût)
- `index.html` Home · `quest.html` mode quête · `prospects.html` plateau ·
  `prospect.html` fiche (à venir) · `trophies.html` Trophy Room 3D (à venir).
- `assets/hq.js` : LE moteur (état localStorage clé `botler-sales-hq-v1`,
  série 🔥 avec joker hebdo, génération de quête, points, trophées, scripts,
  brain treats, leçons, export/import JSON).
- Prospects : champ `brand` libre (campagnes séparées, filtres sur le plateau,
  mémorisés dans `state.brandFilter`).
- `notes.html` : carnet de notes (capture rapide, tags, recherche, épinglage,
  rattachement à un prospect). Notes dans `state.notes`.
- `assets/hq.css` : styles communs charte.
- `vendor/three-0.147.0.min.js` : three.js local (jamais de CDN).
- Déploiement : GitHub Pages depuis `main`. Pas de build, pas de dépendances.

## Règle d'or de prospection (demande fréquente · NE JAMAIS redemander le format)
Dès que Berni demande des prospects ("prospecte", "trouve-moi", "va chercher
tel type de commerce pour tel produit"), applique TOUT ce rituel sans poser de
question sur le format ou la destination :

1. **Cherche de VRAIS commerces** (recherche web) correspondant au métier, à la
   ville et à la marque demandés. Priorité absolue aux commerces SANS site web,
   c'est le meilleur angle de vente. Vérifie que chaque commerce existe encore.
2. **Écris un fichier CSV** dans `private/prospection/` (crée le dossier si
   besoin) nommé `AAAA-MM-JJ_<marque>_<ville>.csv`, avec cette première ligne
   d'en-tête exactement :
   `name;trade;city;website;linkedin;email;brand`
   puis une ligne par prospect, séparateur `;`, `none` quand pas de site web,
   champ vide quand l'info manque. Ce fichier ne sera JAMAIS commité
   (`private/` est dans .gitignore) : Berni le charge sur le plateau via le
   bouton "📂 Import a file" (il accepte aussi les CSV exportés de Google Sheets).
3. **Affiche AUSSI les lignes brutes dans le chat** (sans en-tête, sans
   commentaire autour) : elle peut les coller via "📋 Paste a list" si elle
   préfère.
4. **Sans qu'elle le demande**, propose ensuite 2 emails personnalisés (dans
   SON style, voir Règles d'écriture) pour les 2 prospects les plus
   prometteurs de la liste, en expliquant en une ligne pourquoi ces deux-là.
5. Termine en rappelant le chemin du fichier CSV et le bouton d'import.

## Méthode git
- Développer sur une branche `claude/*`, JAMAIS pousser sur `main` : c'est
  Berni qui merge.
- Commits en français, descriptifs.

## Le moteur de jeu (résumé)
- Quête du jour (3 actions max) : relances des prospects silencieux 3+ jours
  d'abord, puis un premier bonjour, puis "ajoute un prospect".
- Points : hello +10, relance +10, ajout +5, montée de niveau +20, non courageux +15.
- Série 🔥 : un jour compte dès UNE action ; un jour raté est pardonné une fois
  par semaine (joker 🛡️).
- Pipeline : Contacted → Interested → Demo → Client 🏆 (Client = grande
  célébration cinéma, vidéo dans `media/victory/` quand Berni les fournira).
- Brain treats 🎁 : culture G historique/scientifique + expressions anglaises.
  Jamais de contenu que Berni connaît déjà (prompting, bases de l'IA moderne).

## Le dossier private/ (IMPORTANT)
`private/` est ignoré par git (.gitignore) : c'est là que Berni dépose le
catalogue produits, les prix et toute doc interne. Tu peux LIRE ces fichiers
pour écrire fiches et scripts, mais leur contenu brut ne doit JAMAIS être
copié dans le code ni commité : le repo est PUBLIC. Reformule toujours de
façon "publique-safe" (arguments génériques, pas de conditions internes).

## En attente
- Doc produits de Maëva → écran Produits (fiches anti-panique).
- Médias de Berni : `media/music/`, `media/art/`, `media/victory/` (à la toute fin).
