# Backend NestJS pour FinanceFlow

Démarrage rapide:

```bash
cd backend
cp .env.example .env
# edit .env to configure DB credentials (or use Docker compose)
npm install
npm run start:dev
```

Si `npm install` échoue à cause d'une dépendance native (ex: `sqlite3`), utilisez Docker :

```bash
docker compose up -d
```

Fichiers importants:
- `src/data-source.ts` : configuration TypeORM
- `src/main.ts` : middlewares, Swagger

Endpoints clés:
- `POST /api/auth/register` : création utilisateur
- `POST /api/auth/login` : login -> `{ access_token, refresh_token }`
- `POST /api/auth/refresh` : rafraîchir tokens
- `POST /api/auth/logout` : logout (protégé)
- `GET /api/users` : lister utilisateurs (admin)

JWT secret: définir `JWT_SECRET` et `JWT_REFRESH_SECRET` dans `.env`.

Notes:
- `TYPEORM_SYNC=true` active la synchronisation automatique des entités (utile en dev seulement).
- Les refresh tokens sont stockés hashés dans la colonne `refresh_token_hash` de la table `users`.
