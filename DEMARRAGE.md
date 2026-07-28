# Comment je commence · le mode d'emploi de Berni

Ton HQ est prêt. Ce fichier répond à une seule question : **le lundi matin, je fais quoi ?**

---

## Jour 0 · le rituel d'installation (20 minutes, une seule fois)

1. **Ouvre ton HQ** : https://berniceworkinai.github.io/LearnHowToSale_my-gaming-platform/
   (mets-le en favori : c'est ton bureau maintenant)
2. **Choisis ta légende** 🎭 Bernice ou Injection. Tu peux changer chaque jour.
3. **Plante 5 graines** : sur "My prospects", ajoute **5 commerces réels** que tu
   aimerais aider. Nom, métier, ville, et le lien LinkedIn ou l'email si tu l'as.
   **Laisse le champ Website vide s'ils n'ont pas de site : c'est ta meilleure
   porte d'entrée.**
   👉 Objectif : 5 noms. Pas 50. Cinq.
4. **Fais ta sauvegarde** : bouton 💾 Backup en bas de page.

C'est tout. Tu n'as encore contacté personne, et pourtant le jeu a commencé :
ton carnet existe, donc demain matin le HQ aura des quêtes à te donner.

---

## Chaque jour · la boucle (15 minutes, jamais plus)

1. Ouvre le HQ. Ta légende te dit bonjour, ta **mission du jour** est déjà écrite.
2. Clique **Start ▶**.
3. Pour chaque action : le script est prêt. Tu remplis les 2 trous, tu copies,
   tu envoies sur LinkedIn ou par email, tu cliques **"I sent it ✔"**.
4. Points, confettis, brain treat 🎁 Trois actions = journée gagnée. Tu fermes.

**Quand quelqu'un répond**, glisse sa carte dans la bonne colonne (ou clique le
bouton) : Interested → Demo → Client 🏆
**Quand quelqu'un dit non** : clique 🦁 **+15 points de courage**. Un non vaut plus
qu'un silence, parce que ça veut dire que tu as osé demander.

**Si un jour tu n'as pas le courage** : fais UNE action, une seule. Ta série 🔥 est
sauvée. Et si tu sautes un jour, le joker 🛡️ te pardonne une fois par semaine.

---

## Où Claude Code entre en jeu (le terminal)

Ouvre le terminal dans ton clone (`cd LearnHowToSale_my-gaming-platform` puis
`claude`). Il lit `CLAUDE.md` automatiquement, donc il connaît ton style, tes
règles et ton HQ. Voici les 5 demandes qui te feront gagner le plus de temps.

### 1. Trouver des prospects · LA boucle, en 3 gestes

**Geste 1 · dans le terminal**, tu colles ça (change le métier et la ville) :
```
Trouve-moi 10 pizzerias à Leeds qui n'ont pas de site de commande en ligne.
Réponds UNIQUEMENT par des lignes à ce format exact, une par prospect,
sans en-tête et sans commentaire :
nom ; métier ; ville ; site web ou "none" ; lien linkedin ; email
```
*(Astuce : si tu as choisi une marque dans les filtres du plateau avant de coller,
tous les prospects importés lui sont rattachés automatiquement. Sinon tu peux
ajouter une 7e colonne `; nom de la marque`.)*

**Geste 2 · il te répond** quelque chose comme :
```
Luigi's Pizzeria; pizzeria; Leeds; none; linkedin.com/company/luigis;
Nonna Rosa; pizzeria; Leeds; nonnarosa.co.uk; ; hello@nonnarosa.co.uk
```

**Geste 3 · dans ton HQ**, plateau des prospects, bouton **📋 Paste a list** :
tu colles le bloc, tu cliques "Add them all ✔", et tout entre d'un coup.
Les doublons sont ignorés, les trous ne posent aucun problème.

👉 **La structure à retenir : le terminal cherche, le HQ absorbe.**
Tu ne retapes jamais rien à la main.

### 2. Personnaliser un message
```
Voici mon script du jour pour [nom du commerce], [métier] à [ville].
Trouve un détail vrai et sympa sur ce commerce, et remplis les trous du script
dans mon style : court, chaleureux, une question à la fin, jamais d'em dash.
```

### 3. Répondre à un prospect qui a répondu
```
[Nom] m'a répondu ceci : "[colle sa réponse]".
Écris ma réponse dans mon style. Reste court, autorise toujours le non,
et propose une démo de 10 minutes si c'est le bon moment.
```

### 4. Préparer une démo ou une objection
```
J'ai une démo jeudi avec [nom], [métier]. Prépare-moi une fiche d'une page :
les 3 choses à leur montrer en priorité, les 3 questions à leur poser,
et les 2 objections les plus probables avec ma réponse.
```

### 5. Séparer tes campagnes par marque 🏷️
Chaque prospect a un champ **Brand** (libre : "Botler 360", "BFF Studio", une
enseigne…). Sur le plateau, des **filtres cliquables** en haut te montrent une
marque à la fois, avec ses propres compteurs. Rien ne se mélange jamais.
Le champ se modifie aussi depuis la fiche d'un prospect.

### 6. Vider ta tête dans le carnet 📓
Deux endroits pour écrire. Sur le **Home**, le bloc "05 · Quick note" attrape
une idée en deux secondes sans quitter la page (avec ses 2 dernières notes
affichées en dessous). Et le **carnet complet** (lien "My notebook") : capture rapide
(**Ctrl + Entrée** enregistre), étiquettes, recherche, épinglage. Une note peut
être rattachée à un prospect : elle apparaît alors directement sur sa fiche.
Tout part dans la sauvegarde 💾 et dans l'export Excel 📊.

Et bien sûr, Claude Code peut aussi **modifier le HQ** : "ajoute une réplique à
Injection", "change la couleur du bouton", "ajoute un champ téléphone".
Il travaille sur une branche `claude/*`, tu merges, le site se met à jour tout seul.

---

## Quand le catalogue de Maëva arrive

1. Dépose le fichier dans le dossier **`private/`** de ton clone local
   (ce dossier est invisible pour GitHub, rien ne sera publié).
2. Demande, dans Claude Code ou à moi :
```
Lis le catalogue dans private/ et mets à jour l'écran Produits :
les vrais prix, les vraies offres, et affine les scripts de vente par métier.
Reformule tout de façon publique-safe, aucune condition interne dans le code.
```
3. Tu relis, tu valides, tu merges. Tes fiches anti-panique deviennent exactes.

---

## La seule règle qui compte

**Trois petites actions par jour.** Pas de grande stratégie, pas de gros objectif.
Le HQ récompense le courage et l'effort, jamais le résultat. Les ventes, elles,
finissent par arriver toutes seules quand on montre son visage tous les jours.

*Sell with heart · one brave move a day.*
