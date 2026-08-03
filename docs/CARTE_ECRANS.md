# Sales HQ · Carte des écrans (v1, validée par Berni le 24 juillet 2026)

## État au 24 juillet 2026 · TOUTES les maquettes validées ✅
1. Home ✅ · 2. Quest mode ✅ · 3. My prospects ✅ · 4. Fiche prospect ✅ ·
5. Célébrations ✅ · Trophy Room 3D ✅ · Produits ⏳ (doc Maëva attendue)
Maquettes dans design/mockups/sales-hq/ · palette et règles dans design/CHARTE-SALES-HQ.md
Ajouts validés en cours de route : brain treats 🎁 (culture G), badge canal, champ
Website, boutons Move up explicites, PAS d'em dash, three.js en local (vendor/).

Le QG de vente personnel de Berni pour commercialiser les produits Botler 360.
Objectif n°1 : transformer la phobie de la vente en jeu · récompenser le **courage
et l'effort**, pas seulement les ventes.

## Le contexte en 5 points
- Berni vend via **LinkedIn et email uniquement** · aucune quête ne demandera jamais
  de passer un appel téléphonique.
- Usage **principalement sur ordinateur** (responsive quand même).
- Aucun système de suivi existant : le HQ part de zéro, à sa façon.
- Aucune connaissance vente/marketing : la connaissance vient du HQ
  (leçon du jour + scripts prêts à copier, toujours "vente avec cœur").
- Style : charte "Galerie × Blueprint" (`design/CHARTE.md`) + touches gaming 3D
  (three.js, en local dans le repo, pas de CDN).

## Les 6 écrans
1. **Home · "Today's mission"** : quête du jour (3 actions max, générées depuis le
   pipeline), un seul bouton jaune Start ▶, série 🔥 avec joker hebdo 🛡️, barre
   d'effort de la semaine, leçon du jour (1 idée de vente en 2 phrases).
2. **Mode quête (focus)** : une action à la fois, plein écran, avec le prospect
   concerné et un **script prêt à copier** (LinkedIn/email). Done ✅ → points +
   animation. Plus jamais la page blanche.
3. **Pipeline · "My prospects"** : niveaux Contacté → Intéressé → Démo → Client 🏆.
   Une carte par prospect, ajout en 30 secondes. Monter un niveau = points +
   mini-célébration ; Client = célébration plein écran.
4. **Fiche prospect** : où il en est, historique court, prochaine action suggérée
   avec son script. C'est de là que naissent les quêtes du jour.
5. **Trophy Room 🏆 (three.js)** : salle des trophées en 3D, un trophée par
   victoire, manipulable à la souris. Habillage charte (papier, blueprint, or).
6. **Rapport d'activité 📊** : `report.html` · l'activité du mois choisi, lue dans
   le journal d'événements. Effort d'abord, résultat ensuite.
   *(L'écran Produits a été retiré du menu à la demande de Berni.)*

## Le moteur de points (transversal)
- Points sur l'**effort** : message envoyé, relance, prospect ajouté…
- **"Non" reçu = points de courage 🦁** (un non = tu as osé demander).
- La série 🔥 ne dépend que de Berni, jamais des réponses clients.
- Les ventes déclenchent célébrations et trophées (jamais la seule source de points).

## Technique
- 100 % statique (HTML/CSS/JS), hébergé sur **GitHub Pages** · zéro API, zéro coût.
- Données (prospects, points, série) en **localStorage** + bouton export/sauvegarde.
- three.js vendorisé dans le repo (pas de CDN).
- Emplacements réservés : `media/music/` (musique de Berni + bouton son 🔊),
  `media/art/` (illustrations IA de Berni), `media/victory/` (vidéos de victoire).

## Méthode de travail (rappel)
Une page à la fois : explication des fonctionnalités → validation Berni →
maquette HTML interactive → itérations. Tout sur branche `claude/*`, Berni merge.
