# FinanceFlow

Application de gestion de finances personnelles : comptes, transactions, budgets et objectifs d'épargne.

## Architecture

Ce dépôt contient deux projets distincts :

```
.
├── src/            # Frontend React 19 + Vite + TypeScript + Tailwind
├── backend/         # Backend NestJS + TypeORM + MySQL
└── .github/workflows/deploy-github-pages.yml   # CI/CD du frontend
```

Le frontend et le backend sont deux applications séparées qui communiquent via une API REST (préfixe `/api`). Le frontend **ne fonctionne pas seul** : il a besoin du backend pour l'authentification et toutes les données (comptes, transactions, budgets, objectifs).

## Lancer le projet en local

### 1. Backend

```bash
cd backend
cp .env.example .env   # renseigner DB_*, JWT_SECRET, CORS_ORIGIN
npm install
npm run start:dev      # http://localhost:3000/api
```

Une base MySQL est nécessaire (voir `docker-compose.yml` à la racine pour la lancer rapidement avec Docker).

### 2. Frontend

```bash
cp .env.example .env   # VITE_API_URL peut rester vide en local
npm install
npm run dev             # http://localhost:5173
```

## Déploiement en production

Le frontend est déployé sur GitHub Pages via `.github/workflows/deploy-github-pages.yml`.

**Important** : ce workflow a besoin de la variable de dépôt `VITE_API_URL` (Settings → Secrets and variables → Actions → Variables) pointant vers l'URL publique de votre backend déployé (Render, Railway, VPS…). Sans elle, le build échoue volontairement plutôt que de déployer un site qui ne pourrait pas contacter l'API.

Le backend n'est pas déployé automatiquement par ce dépôt : il doit être hébergé séparément (voir `backend/Dockerfile`).

## Sécurité

- Les mots de passe sont hachés avec bcrypt côté serveur ; ils ne sont jamais stockés ni transmis en clair.
- Chaque ressource (compte, transaction, budget, objectif) est vérifiée côté serveur pour appartenir à l'utilisateur authentifié avant lecture/modification/suppression.
- Les champs sensibles (`passwordHash`, `refreshTokenHash`) ne sont jamais renvoyés par l'API.
