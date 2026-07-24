# Charte visuelle — Botler Sales HQ
*Adaptation du style "Galerie × Blueprint" pour le Sales HQ de Berni.*
*Papier **Gallery White** validé par Berni le 24 juillet 2026.*
*Référence vivante : `design/mockups/sales-hq/01-home.html` — en cas de doute, ouvrir ce fichier.*

Hérite de `design/CHARTE.md` (l'âme du style, typo, matières, animations, règles
d'or). Ce fichier ne liste que ce qui **change** pour le Sales HQ.

## Le papier : Gallery White (remplace le beige #f6f4ef)
| Rôle | Variable CSS | Valeur |
|---|---|---|
| Fond papier | `--paper` | `#ffffff` |
| Quadrillage (44px) | `--grid` | `rgba(29,27,23,.05)` |
| Encre | `--ink` / `--ink-strong` | `#1d1b17` / `#14120e` |
| Surfaces (nœuds, chips) | `--panel` | `#fafaf7` |
| Filets doux / trait fort | `--rule` / `--rule-strong` | `#e7e5df` / `#1d1b17` |
| Texte secondaire / discret | `--grey` / `--faint` | `#8f8b81` / `#c2beb3` |
| Doré (serif italique) | `--gold` | `#b8860b` |
| **Jaune signal (invariant)** | `--signal` | `#ffd12e` |
| Vert progression | `--green` | `#23856f` |
| Orange série 🔥 | `--orange` | `#d1571f` |
| Fond de barre | `--bar-bg` | `#efede8` |
| Ombre franche / bordures | `--shadow` / `--border` | `#1d1b17` |

Toujours utiliser ces **variables CSS** (`:root`) — jamais de couleurs en dur.

## Compositions propres au Sales HQ (validées sur l'écran 1)
- **Desktop d'abord** (Berni travaille sur ordinateur) : scène `max-width: 1020px`,
  grille 2 colonnes (mission 1.55fr | tableau de bord 1fr, gap 64px), empilement
  en une colonne sous 760px.
- **Pas de panneau-carte copié de l'Academy.** La mission du jour est un
  **parcours de quête** : étapes numérotées dans des nœuds ronds (36px, bordure
  encre), reliées par un tracé vertical en pointillés, station finale 🎁 en
  pointillés qui s'allume en jaune à la victoire.
- États des nœuds : `current` = halo vert qui pulse · `done` = fond vert, ✓ ·
  `goal.won` = fond jaune signal + pop.
- Sections = en-têtes éditoriaux (`shead`) : trait encre au-dessus, label mono
  numéroté parlant ("01 · Today's mission — your only job today").
- Chaque bloc porte une **ligne d'explication claire** (`explain`) — Berni doit
  toujours comprendre de quoi ça traite sans réfléchir.

## Ton & vocabulaire (spécifique vente)
- Anglais simple. L'utilisatrice s'appelle **Berni♥** (avec le cœur).
- L'effort compte, pas les réponses : "brave moves", "Effort counts, answers don't."
- Jamais d'action téléphonique. Jamais de pression ("You're free — see you tomorrow 🌿").
- Pied de page : "Sell with heart · one brave move a day".

## Interdits d'écriture (règles de Berni)
- **JAMAIS d'em dash (—)** dans les textes visibles : ça sonne "AI generated".
  Utiliser le point médian "·" (déjà la signature du style), une virgule,
  deux points, ou couper en deux phrases. Vaut aussi pour les scripts de vente.
- Le fond beige crème (#f6f4ef) est banni : papier officiel = Gallery White.

## Brain treats 🎁 (validé sur l'écran 2)
Chaque action terminée offre une mini-phrase mémorisable ("brain treat"), tirée
au sort localement (jamais d'API). Deux familles :
- 🗣️ **Expressions anglaises courantes** du monde du travail, avec exemple lié à la vente.
- 🧠⚛️📐 **Culture générale historique & scientifique** : histoire de l'IA (Turing,
  Ada Lovelace, Deep Blue, AlphaGo, ELIZA…), physique quantique, mathématiques —
  des idées complexes rendues simples. **Jamais de trucs "déjà connus" de Berni**
  (prompting, bases de ChatGPT…) : elle vit dedans, ça ne récompense pas.
Format : l'idée en une phrase (mot-clé en serif doré) + une ligne d'explication
imagée qui sert de moyen mnémotechnique.
