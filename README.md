# AutoInsight

AutoInsight is a car review and community platform organized as a frontend/backend monorepo.

## Project structure

```text
frontend/   React and Vite user interface
backend/    Express.js API structure
```

The frontend consumes the backend API for the car catalogue, authentication, reviews,
tips/problems, community discussions, comments, replies, voting, and administration.
There are no local demo collections; start the backend before opening the frontend.

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
`application_state` collection. `MONGODB_URI` is required.
