# AutoInsight

AutoInsight is a car review and community platform organized as a frontend/backend monorepo.

## Project structure

```text
frontend/   React and Vite user interface
backend/    Express.js API structure
```

The frontend is currently prepared to consume backend API data. Local demo collections have been removed; car, review, discussion, post, authentication, and admin data should come from the backend when its API is implemented.

## Frontend

```powershell
cd frontend
npm install
npm run dev
```

See [`frontend/README.md`](frontend/README.md) for frontend-specific details.

## Backend

The backend structure is scaffolded under [`backend/`](backend/). Its implementation can be added independently of the React application.

### MongoDB

The backend uses MongoDB when `backend/.env` contains `MONGODB_URI`:

```env
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DATABASE=autoinsight
```

The first startup creates the `autoinsight` database state and seeds the
administrator and car catalogue. MongoDB data is stored in the
`application_state` collection. `MONGODB_URI` is required; the backend does not
write application data to JSON.
