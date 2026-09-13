# Plan de référence — Devis automatisés par l'IA

Dernière mise à jour : **13 septembre 2026**

## 1. État général

Le socle du parcours de devis est livré et opérationnel :

- l'assistant IA peut orienter un visiteur vers un questionnaire adapté ;
- les questionnaires publics sont disponibles pour les projets `portfolio`,
  `vitrine_ecommerce` et `saas` ;
- le devis est calculé à partir de la grille tarifaire réelle ;
- le PDF et les emails Resend sont prévus dans le parcours de soumission et
  d'acceptation ;
- les routes admin sont protégées ;
- les bases de données de développement et de production ont été synchronisées
  avec Prisma ;
- le projet a été validé avec `npm run build`.

L'interface admin de l'onglet **Prospects** est maintenant complète pour le suivi
quotidien : recherche, filtre, détail des réponses et du devis, changement de
statut et suppression confirmée. Le parcours public a également été stabilisé
pour garder la conversation visible pendant le questionnaire et afficher les
actions d'acceptation/refus après le calcul du devis.

Il reste une QA métier et sécurité en conditions réelles avec une base et Resend
configurés : soumission complète des trois types, réception du PDF, acceptation,
refus, puis contrôle des emails et des statuts en production.

AKATechOS reste un produit séparé : aucune fusion avec le site n'a été retenue.

## 2. Parcours fonctionnel validé

```text
Visiteur
  |
  v
Assistant IA
  |
  +-- question générale / besoin flou --> conversation
  |                                       |
  |                                       +--> FAQ, services, projets, fondateur
  |                                       |
  |                                       +--> besoin suffisamment clair ?
  |                                                    |
  |                                                    v
  |                                             Qualification (2–3 questions)
  |                                                    |
  |                                                    v
  |                                             Classification du projet
  |
  +-- projet pris en charge --> start_questionnaire
  |                         |
  |                         v
  |                  /devis/{type}?t=TOKEN
  |                         |
  |                         v
  |                  Questionnaire public
  |                         |
  |                         v
  |              Classification + devis sécurisé
  |                         |
  |                         +--> PDF + email à AKATech
  |                         |
  |                         v
  |                  Devis affiché au prospect
  |                         |
  |                  +------+------+
  |                  |             |
  |               Accepter       Refuser
  |                  |             |
  |                  v             v
  |           Email immédiat   Statut DECLINED
  |           à AKATech         Relance manuelle
  |
  +-- besoin non compatible --> capture_lead
```

Le questionnaire ne remplace donc pas la conversation. L'assistant reste capable
de répondre aux questions générales sur AKATech, ses services, ses projets, son
fondateur et ses modalités de collaboration. Il ne bascule vers la qualification
que lorsqu'un besoin de projet apparaît, puis ne lance le questionnaire qu'après
avoir obtenu assez de contexte.

## 3. Fonctionnalités livrées

### 3.1 Données et tarification

- `prisma/schema.prisma`
  - modèles `Questionnaire` et `Quote` ;
  - enums de type et de statut ;
  - relation optionnelle avec `Conversation`.
- `lib/questionnaires-schema.js`
  - questionnaires standardisés pour les trois types de projet ;
  - champs conditionnels réutilisables par le formulaire et le moteur de devis.
- `lib/data.js`
  - grille tarifaire canonique ;
  - tiers et prix réalistes ;
  - catégorie `portfolio` alignée avec la grille existante.
- `lib/quote-calc.js`
  - classification limitée aux catégories et tiers autorisés ;
  - `sanitizeClassification()` ;
  - relecture du prix depuis `PRICING`.

### 3.2 Assistant IA

- `lib/assistant.js`
  - outil `start_questionnaire` ;
  - valeurs autorisées : `portfolio`, `vitrine_ecommerce`, `saas` ;
  - conversation générale conservée pour les FAQ, services, projets et fondateur ;
  - prompt public séparant conversation, qualification et devis ;
  - environ 2 à 3 questions ciblées avant le lancement du questionnaire ;
  - interdiction d'annoncer un prix, un pack, un tier ou un délai personnalisé
    avant la soumission du questionnaire ;
  - consignes indiquant quand utiliser le questionnaire et quand conserver
    `capture_lead`.
- `app/api/assistant/route.js`
  - exécution de l'outil ;
  - création du questionnaire ;
  - génération du lien public avec token ;
  - conservation du flux existant en cas de besoin non compatible.
- `components/ui/AIAssistant.js`
  - détection des liens `/devis/...` ;
  - ouverture du questionnaire dans un modal iframe sans navigation ni perte de
    l'état de la conversation.

### 3.3 Questionnaire public et devis

- `app/api/questionnaire/route.js`
  - création et chargement minimal d'un questionnaire.
- `app/api/questionnaire/[token]/route.js`
  - chargement par token ;
  - enregistrement des réponses et coordonnées ;
  - classification Gemini ;
  - pitch Groq facultatif ;
  - calcul et sauvegarde du devis ;
  - passage au statut `QUOTED`.
- `app/api/questionnaire/[token]/decision/route.js`
  - décisions `accepted` et `declined` ;
  - enregistrement de la date et du statut.
- `app/devis/page.js`
  - point d'entrée sécurisé de `/devis`.
- `app/devis/[type]/page.js`
  - formulaire rendu depuis `QUESTIONNAIRES` ;
  - récupération du token ;
  - sauvegarde locale et serveur ;
  - affichage du devis et des actions Accepter/Refuser ;
  - thème clair/sombre partagé avec le reste du site ;
  - conservation de l'état affiché après rechargement du questionnaire.
- `lib/db.js`
  - création, lecture et mise à jour des questionnaires ;
  - sauvegarde et mise à jour des devis.

### 3.4 PDF et emails

- `lib/questionnaire-pdf.js`
  - génération d'un PDF contenant les coordonnées, les réponses et le devis ;
  - pièce jointe encodée pour Resend.
- Soumission :
  - email à l'adresse admin configurée ;
  - PDF du questionnaire et du devis joint ;
  - un échec email ne bloque pas l'enregistrement du devis.
- Acceptation :
  - email immédiat avec le sujet d'acceptation ;
  - questionnaire et devis joints ;
  - un échec email ne bloque pas la décision enregistrée.
- Refus :
  - statut `DECLINED` ;
  - pas d'email automatique retenu ;
  - relance manuelle prévue.

### 3.5 Administration et sécurité

- `middleware.js`
  - protection de `/api/prospects` avec les routes admin.
- `app/api/prospects/route.js`
  - liste filtrable des questionnaires et devis ;
  - mise à jour de statut et suppression protégées ;
  - endpoint consommé par le détail complet de l'onglet Prospects.
- Le build Next.js est passé avec succès après ces changements.

## 4. Décisions prises

### 4.1 Prix

Le modèle IA ne peut jamais inventer ni imposer un prix. Il propose uniquement
une catégorie et un tier parmi les valeurs autorisées. L'application nettoie
ce résultat puis relit les montants dans `PRICING`.

Conséquence : le devis affiché, sauvegardé et envoyé par email provient toujours
de la grille tarifaire de l'application.

### 4.2 Répartition des modèles IA

- Gemini reste utilisé pour le chat et la classification du devis.
- Groq est utilisé pour le pitch de positionnement.
- Le pitch est facultatif et non bloquant.
- Les quotas sont séparés afin que le pitch ne consomme pas le quota principal
  du chat.

### 4.3 Déclenchement du questionnaire

Le chat fait cohabiter conversation générale et qualification commerciale. Il ne
devient pas un robot de devis :

- les questions générales restent dans le dialogue normal (FAQ, services,
  projets, fondateur et collaboration) ;
- lorsqu'un besoin de projet apparaît, l'assistant comprend l'activité et le
  résultat recherché ;
- il pose environ 2 à 3 questions courtes et ciblées ;
- il classe ensuite le projet et appelle `start_questionnaire` si la catégorie
  est prise en charge.

Le contrat de fonctionnement du chat est donc : comprendre, qualifier,
classifier et lancer le questionnaire — pas calculer ni négocier le devis dans
la conversation.

Avant la soumission du questionnaire, l'assistant ne doit jamais annoncer de prix,
de pack, de tier, de fourchette ou de délai personnalisé. Le tier et le montant
final sont déterminés ensuite par `quote-calc.js` à partir des réponses et de
`PRICING`.

Le questionnaire est lancé uniquement lorsque le besoin appartient clairement à
l'une des trois catégories prises en charge. Les demandes de maintenance, d'API,
de GBP ou d'autres besoins continuent d'utiliser le flux `capture_lead`.

### 4.4 Exécution synchrone

La classification et le pitch sont exécutés lors de la soumission du formulaire
afin que le prospect reçoive immédiatement son résultat. Un échec du pitch ou
de l'email ne doit pas annuler la sauvegarde du questionnaire ou du devis.

### 4.5 Acceptation et refus

- Une acceptation passe le questionnaire au statut `ACCEPTED` et déclenche un
  email à AKATech.
- Un refus passe le questionnaire au statut `DECLINED`, sans email automatique.
- La logique de paiement n'est pas encore intégrée : `ACCEPTED` signifie
  « devis accepté », pas « paiement reçu ».

### 4.6 Base de données

Le schéma a été poussé avec succès sur les deux bases Neon :

- base de développement : synchronisée avec `npx prisma db push` ;
- base de production : synchronisée avec `npx prisma db push`.

Prisma Client a ensuite été régénéré avec `npx prisma generate`.

Les URLs de connexion ne sont volontairement pas écrites dans ce document.
Elles doivent rester dans les variables d'environnement et les secrets du
déploiement.

## 5. Hypothèses retenues

- Le projet utilise Next.js 14 avec des routes API App Router.
- Prisma et PostgreSQL/Neon restent la source de persistance.
- Un token public suffit pour accéder à un questionnaire ; il ne donne pas
  accès aux routes admin.
- L'adresse d'envoi et l'adresse admin sont fournies par `FROM_EMAIL` et
  `ADMIN_EMAIL`.
- Resend est facultatif en développement : si `RESEND_API_KEY` est absente,
  le parcours doit rester utilisable sans envoi d'email.
- Les réponses sont conservées dans le champ JSON du questionnaire.
- Le dashboard admin existant fournit déjà l'authentification utilisée par le
  middleware.
- Le PDF est généré côté serveur avec `@react-pdf/renderer`.

## 6. Points à décider ou à finaliser

### 6.1 Dashboard Prospects

- [ ] Créer `components/dashboard/ProspectsTab.js`.
- [ ] Ajouter l'onglet à la configuration `TABS`.
- [ ] Afficher les prospects avec recherche, filtre par statut et pagination.
- [ ] Créer la vue détail :
  - coordonnées ;
  - réponses complètes ;
  - devis et pitch ;
  - historique de statut ;
  - téléchargement ou régénération du PDF.

### 6.2 QA métier et sécurité

- [ ] Refuser une décision si le questionnaire n'est pas encore au statut
  `QUOTED`.
- [ ] Rendre les décisions idempotentes ou définir explicitement le
  comportement d'une seconde décision.
- [ ] Vérifier qu'un token invalide ou expiré ne révèle aucune donnée.
- [ ] Vérifier les limites de taille et de contenu des réponses JSON.
- [ ] Vérifier les cas Gemini/Groq/Resend indisponibles.
- [ ] Tester l'absence de prix hors grille dans les réponses IA, le PDF et les
  emails.
- [ ] Vérifier les permissions admin sur la liste et le détail des prospects.

### 6.3 Email prospect

La version actuelle envoie les emails à AKATech. Il faut décider séparément si
le prospect doit recevoir :

- le devis par email ;
- le PDF directement ;
- un lien public temporaire ;
- ou uniquement le résultat affiché dans le navigateur.

Cette décision dépend de la présence d'un email prospect fiable dans le
questionnaire et de la politique de confidentialité retenue.

### 6.4 Paiement

Le paiement n'est pas inclus dans le flux actuel. Avant toute intégration,
il faudra définir :

- le prestataire de paiement ;
- le statut exact après paiement ;
- le lien entre paiement, devis et facture ;
- les règles d'annulation et de remboursement.

## 7. Commandes Prisma

Les commandes doivent être exécutées depuis la racine du projet.

### Développement

```powershell
$env:DATABASE_URL="URL_DEVELOPPEMENT"
npx prisma db push
npx prisma generate
```

### Production — méthode actuellement utilisée

```powershell
$env:DATABASE_URL="URL_DE_PRODUCTION"
npx prisma db push
npx prisma generate
```

### Production recommandée à terme

Pour une production stabilisée, préférer des migrations versionnées :

```powershell
$env:DATABASE_URL="URL_DE_PRODUCTION"
npx prisma migrate deploy
npx prisma generate
```

`db push` synchronise directement le schéma et ne crée pas de migration.
Avant toute modification destructive, une sauvegarde et une validation du
différence de schéma sont nécessaires.

## 8. Validation effectuée

- [x] `npm install @react-pdf/renderer`.
- [x] `npm run build`.
- [x] Synchronisation Prisma sur la base de développement.
- [x] Synchronisation Prisma sur la base de production.
- [x] Régénération de Prisma Client après chaque synchronisation.

## 9. Prochaine séquence recommandée

1. Construire l'onglet **Prospects** et sa vue détail.
2. Ajouter la génération/téléchargement PDF depuis l'administration.
3. Finaliser les règles de statut et les décisions idempotentes.
4. Tester le parcours complet avec les clés Gemini, Groq et Resend réelles.
5. Effectuer une QA production sans exposer de secrets.
6. Passer à `prisma migrate deploy` pour les futures évolutions de production.

## 10. Correctifs — 13 septembre 2026 (session Claude Web)

### 10.1 Lien de questionnaire cassé dans le chat

Cause réelle : le modèle enrobe parfois le lien renvoyé par `start_questionnaire`
en syntaxe Markdown (`**[libellé](url)**`), que le rendu du chat n'interprète
pas. L'ancien parseur enchaînait des `.replace()` indépendants (devis, puis
site, puis...) sur le même texte ; un placeholder déjà créé pour le lien devis
contenant encore littéralement `https://akatech.vercel.app`, le regex du site
suivant le re-matchait à l'intérieur et le coupait en trois morceaux (bouton
vide, bouton site parasite, reste de l'URL en texte brut).

Corrigé dans `components/ui/AIAssistant.js` :
- un seul passage combiné (regex à groupes nommés) sur le texte, donc plus
  aucun risque qu'un pattern suivant re-matche à l'intérieur d'un placeholder
  déjà injecté ;
- déballage préalable d'un éventuel lien Markdown `[libellé](url)` avant toute
  détection de bouton ;
- exclusion de `*` du corps des URL détectées (en plus de l'espace/`)`/`]`),
  pour ne pas avaler un `**` de mise en gras dans le token.

Renforcé dans `lib/assistant.js` : consigne explicite de ne jamais enrober le
lien du questionnaire en Markdown ni en gras (alignée sur la consigne déjà
existante pour le lien WhatsApp), et règle générale équivalente dans la
section Ton.

Testé sur le cas réel (capture chocolaterie) et 6 cas de contrôle (URL nue,
lien site seul, WhatsApp, plusieurs liens dans un même message, lien Markdown
sans gras, lien générique inconnu) : le lien devis conserve systématiquement
son token complet.

### 10.2 Pages légales

`components/legal/LegalPage.js` utilisait `var(--bg-dark)` en dur : cette
variable ne change pas quand le visiteur bascule en mode clair (seule
`body.light-mode` redéfinit des règles ciblées dans `globals.css`, pas les
variables `--bg-dark`/`--text-main` elles-mêmes). Passé sur `useTheme()`,
comme le reste du site (Footer, AIAssistant) — les 3 pages légales suivent
désormais le thème clair/sombre.

`app/confidentialite/page.js` complété :
- fondement légal explicite (loi n° 2013-450 du 19 juin 2013, Côte d'Ivoire)
  et autorité de contrôle (ARTCI), absents de la version précédente ;
- droit de réclamation auprès de l'ARTCI ajouté à « Vos droits » ;
- fournisseurs IA (Google Gemini, Groq) nommés explicitement dans
  « Prestataires et transferts », pour rester cohérent avec les autres
  prestataires déjà nommés (Vercel, Neon, Resend, Cloudinary) ;
- paragraphe cookies réécrit pour décrire le mécanisme réel (bandeau
  essentiels/analytiques, choix mémorisé) plutôt qu'un texte générique.

`mentions-legales` et `conditions-utilisation` vérifiées : déjà correctes et
honnêtes sur le statut non enregistré de la structure — pas de changement.

⚠️ Point non traité, à signaler : `app/confidentialite/page.js` ne mentionne
toujours pas explicitement l'obligation de déclaration des traitements auprès
de l'ARTCI (la loi 2013-450 semble s'appliquer même à une personne physique).
Je ne suis pas en position de confirmer si cette déclaration est requise pour
l'activité réelle d'AKATech — à vérifier directement auprès de l'ARTCI ou
d'un juriste avant de considérer les 3 pages comme définitives, surtout tant
que la structure n'a pas de RCCM/NCC.
