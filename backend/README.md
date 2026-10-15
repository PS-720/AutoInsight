# AutoInsight backend

## Run locally

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm start
```

The API is served under `http://localhost:4000/api`. `MONGODB_URI` is required;
the backend will not start without it. The application uses one shared MongoClient
for the long-running Express process and stores the application state in the
`application_state` collection in the configured database.

Example:

```env
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DATABASE=autoinsight
```

To initialize or verify the MongoDB state explicitly:

```powershell
npm run seed:mongodb
```

The old relational reference schema remains in `../database/schema.sql`; it is
not required when using MongoDB.

Authentication uses `Authorization: Bearer <token>`. The seeded administrator is
`admin@autoinsight.local`; create a normal account through registration. Change
the development JWT secret before deploying.

Endpoints include:

- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- `GET /cars`, `GET /cars/:id`, admin `POST`, `PUT`, and `DELETE /cars/:id`
- `GET /reviews`, authenticated `POST /reviews`
- `GET /posts`, authenticated `POST /posts`
- `GET /discussions`, authenticated `POST /discussions`
- `GET` and authenticated `POST /posts/:id/comments`, authenticated `POST /posts/:id/vote`
- `GET` and authenticated `POST /discussions/:id/replies`
- authenticated `GET /profile`
- admin `GET /admin/stats`
