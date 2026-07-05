# Plan de travail — FinanceFlow

## Phase 1 : Correction Backend ✓
- [x] Corriger la syntaxe error dans `jwt.guard.ts` (accolade en trop)
- [x] Ajouter les dépendances manquantes (`@nestjs/swagger`, `swagger-ui-express`)
- [x] Corriger les erreurs TypeScript sur `jsonwebtoken` (expiresIn)
- [x] Vérifier que le projet backend compile (`npx tsc --noEmit` ✅)

## Phase 2 : Enrichissement Backend ✓
- [x] Ajouter `type` (income/expense), `category`, `createdAt` à Transaction
- [x] Ajouter un endpoint stats/agrégations pour le dashboard (`GET /transactions/stats`)
- [x] Ajouter PATCH pour modifier une transaction
- [x] Vérifier que le backend compile toujours

## Phase 3 : Connexion Frontend → Backend ✓
- [x] Créer un service API centralisé (`src/services/api.ts`) avec refresh token interceptor
- [x] Mettre à jour AuthContext pour utiliser l'API (fallback localStorage si indisponible)
- [x] Créer `useFinanceData` hook basé sur l'API
- [x] Mettre à jour Dashboard avec la vraie API
- [x] Mettre à jour Transactions avec filtres/recherche
- [x] Mettre à jour Statistics avec stats enrichies

## Phase 4 : Nouvelles Features
- [x] Catégorisation des transactions (selecteur + endpoint)
- [x] Filtres/recherche dans Transactions
- [x] Objectifs d'épargne
- [x] Alertes budgétaires

## Phase 5 : Nettoyage & Finition
- [ ] Nettoyer `App.css` legacy
- [ ] Vérifier le build frontend
