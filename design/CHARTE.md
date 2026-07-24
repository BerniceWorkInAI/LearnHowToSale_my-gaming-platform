# Charte visuelle — Botler AI Academy
*Style officiel "Galerie × Blueprint", validé par Berni le 23 juillet 2026.*
*Référence vivante : `design/mockups/07-accueil-galerie-blueprint.html` — en cas de doute, ouvrir ce fichier.*

## L'âme du style en une phrase
Une page de magazine d'art posée sur une table à dessin d'architecte : éditorial, aéré, précis, chaleureux — moderne et légèrement tech, jamais cliché.

## Couleurs
| Rôle | Valeur | Usage |
|---|---|---|
| Fond papier | `#f6f4ef` | fond de toutes les pages, avec quadrillage discret |
| Quadrillage | `rgba(29,27,23,.04)`, cellules 44px | toujours très léger, jamais dominant |
| Encre | `#1d1b17` | textes, bordures (1.5px), ombres franches |
| Carte/panneau | `#fffefb` | fond des panneaux |
| Jaune signal | `#ffd12e` | LE bouton d'action principal + coin des panneaux. Un seul par écran. |
| Doré | `#b8860b` | les mots en serif italique (accents typographiques) |
| Vert progression | `#23856f` | barres de progression, pastille "Ready", niveau |
| Orange série | `#d1571f` | le chiffre de la série 🔥 |
| Gris chaud | `#a09a8c` | textes secondaires |
| Filets doux | `#ddd8ca` | lignes de séparation fines |

## Typographie
- **Titres** : sans-serif system-ui, très gros (jusqu'à `clamp(50px, 14vw, 72px)`), graisse 800, letter-spacing négatif (-.04em).
- **La signature** : dans chaque titre, le mot-clé passe en **Georgia serif italique, graisse 400, couleur dorée** — ex. "Hi *Sofia*", "*One minute*. That's all."
- **Micro-labels techniques** : monospace (`ui-monospace, Consolas`), 10.5px, MAJUSCULES, letter-spacing .16em, pour les en-têtes de panneaux ("01 · Today's quiz"), index, dates, pied de page.
- **Corps** : sans-serif system, 13–16px, interligne 1.5.

## Matières & déco
- **Grain** : texture de bruit SVG sur toute la page (opacité ~.4) — c'est ce qui rend le papier vivant.
- **Panneaux** : fond `#fffefb`, bordure 1.5px encre, radius 4px, **petit carré jaune bordé sur le coin haut-gauche** (la signature déco), en-tête en pointillés avec label mono numéroté.
- **Le contenu principal de l'écran est le SEUL panneau en boîte** ; le secondaire est en lignes éditoriales entre filets fins `#ddd8ca`, avec index mono à droite ("02 · Streak").
- **Bouton principal** : jaune signal, bordure 1.5px encre, radius 8px, ombre franche `4px 4px 0` encre. Au survol il se soulève, au clic il s'enfonce.
- **Pastille live** : point vert qui pulse (2s) devant les états "Ready"/actifs.

## Animations
- Entrée de page : les éléments montent en fondu l'un après l'autre (`rise` .5s, délais échelonnés de ~.08s).
- Micro-interactions sur tout ce qui est cliquable. Toujours respecter `prefers-reduced-motion`.

## Règles d'or (héritées des choix de Berni)
1. **Simplicité absolue côté joueur** : un écran = une seule chose à faire, le bouton jaune. Public non-gamer, souvent sur téléphone.
2. **Vocabulaire simple en anglais** : "points" (jamais XP), niveaux Beginner → Explorer → Practitioner → Power User → Champion, ton rassurant ("Miss a day? You get one free pass every week 🛡️"). Jamais de "WRONG"/rouge agressif.
3. **Peu de chiffres à l'écran** : une barre vaut mieux qu'un compte de points.
4. **Emojis actuels = placeholders** en attendant les icônes/illustrations de Berni (elles arriveront dans `media/`).
5. Un seul jaune signal par écran ; si tout crie, rien ne crie.

## Historique des maquettes
`design/mockups/01` à `06` = les explorations. `07` = le style retenu. Les explorations restent pour mémoire.
