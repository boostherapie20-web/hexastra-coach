# Guide Installation Vercel — HexastraCoach
## Déploiement en 15 minutes

---

## ÉTAPE A — Préparer ton projet sur GitHub

### A1. Créer un compte GitHub (si pas déjà fait)
Va sur github.com → Sign up → crée ton compte gratuit.

### A2. Créer un nouveau dépôt GitHub
1. Clique sur "+" en haut à droite → "New repository"
2. Nom : hexastracoach
3. Visibilité : Private (recommandé)
4. NE PAS cocher "Initialize this repository"
5. Clique "Create repository"

### A3. Envoyer ton projet sur GitHub
Dans le terminal VS Code (dans le dossier hexastracoach) :

```bash
git init
git add .
git commit -m "Initial commit - HexastraCoach"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/hexastracoach.git
git push -u origin main
```

Remplace TON_USERNAME par ton nom d'utilisateur GitHub.
Git va te demander tes identifiants GitHub la première fois.

---

## ÉTAPE B — Déployer sur Vercel

### B1. Connecter GitHub à Vercel
1. Va sur vercel.com → Log in avec GitHub
2. Clique "Add New Project"
3. Trouve "hexastracoach" dans la liste → clique "Import"

### B2. Configurer le projet
Dans l'écran de configuration :
- Framework Preset → Next.js (détecté automatiquement)
- Root Directory → laisser vide
- Build Command → laisser vide (next build par défaut)
- Output Directory → laisser vide

NE PAS encore cliquer "Deploy" — on doit d'abord ajouter les variables.

### B3. Ajouter les variables d'environnement
Clique sur "Environment Variables" (accordéon à déplier).

Ajoute chaque variable UNE PAR UNE :

| Nom | Valeur |
|-----|--------|
| NEXT_PUBLIC_SUPABASE_URL | https://XXX.supabase.co |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | eyJhbGci... |
| SUPABASE_SERVICE_ROLE_KEY | eyJhbGci... |
| STRIPE_SECRET_KEY | sk_test_... |
| STRIPE_WEBHOOK_SECRET | whsec_... (on remplira après) |
| STRIPE_PRICE_PREMIUM | price_... (on remplira après) |
| N8N_WEBHOOK_CHAT_URL | https://... (on remplira après) |
| N8N_WEBHOOK_PREMIUM_URL | https://... (on remplira après) |
| N8N_WEBHOOK_SECRET | ton_secret_long_ici |
| NEXT_PUBLIC_BASE_URL | https://hexastracoach.vercel.app |

Pour NEXT_PUBLIC_BASE_URL, remplace par l'URL réelle que Vercel va te donner
(tu peux mettre https://hexastracoach.vercel.app pour l'instant).

### B4. Déployer
Clique "Deploy" → attends 2-3 minutes.

Tu verras une animation de déploiement. Quand c'est fini :
✅ Confetti + "Congratulations" → c'est en ligne !

---

## ÉTAPE C — Mettre à jour Supabase avec ton URL Vercel

### C1. Copier ton URL Vercel
Après le déploiement, Vercel te donne une URL comme :
https://hexastracoach-abc123.vercel.app
ou si tu as un domaine custom : https://hexastracoach.vercel.app

### C2. Mettre à jour Supabase Auth
Va dans ton dashboard Supabase → Authentication → URL Configuration :

- Site URL → https://ton-url.vercel.app
- Redirect URLs → https://ton-url.vercel.app/**

Clique Save.

### C3. Mettre à jour la variable NEXT_PUBLIC_BASE_URL sur Vercel
1. Vercel Dashboard → ton projet → Settings → Environment Variables
2. Trouve NEXT_PUBLIC_BASE_URL → Edit
3. Remplace http://localhost:3000 par https://ton-url.vercel.app
4. Save

### C4. Redéployer pour prendre en compte le changement
Dans Vercel Dashboard → Deployments → clique les 3 points du dernier déploiement → Redeploy.

---

## ÉTAPE D — Tester que tout fonctionne

### D1. Tester le login
Va sur https://ton-url.vercel.app/login
→ Crée un compte avec ton email
→ Vérifie que tu reçois l'email de confirmation
→ Confirme et connecte-toi
→ Tu dois arriver sur /chat ✅

### D2. Tester le chat
Sur /chat :
→ Écris un message et envoie → tu dois voir une réponse ✅
→ Clique "Nouvelle lecture" → remplis les données de naissance → envoie ✅

### D3. Tester la bibliothèque
→ Va sur /library → tu dois voir tes lectures ✅

---

## ÉTAPE E — Mises à jour futures

À chaque fois que tu modifies le code :

```bash
git add .
git commit -m "Description de ta modification"
git push
```

Vercel redéploie automatiquement en 1-2 minutes. Zéro configuration supplémentaire.

---

## PROBLÈMES FRÉQUENTS

**Erreur "Build failed" sur Vercel**
→ Vérifie les logs dans Vercel Dashboard → Deployments → clique le déploiement en erreur → View logs
→ Cherche la ligne rouge avec l'erreur

**La page /chat redirige vers /login**
→ L'authentification fonctionne correctement (normal si pas connecté)
→ Crée un compte et connecte-toi

**Les variables d'environnement ne sont pas lues**
→ Vérifie qu'elles sont bien dans Vercel Settings → Environment Variables
→ Redéploie après avoir ajouté/modifié des variables

**Erreur Supabase "Invalid API key"**
→ Vérifie que tu n'as pas de guillemets ou d'espaces dans les valeurs Vercel
→ Re-copie la clé depuis supabase.com → Settings → API
