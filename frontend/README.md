# AutoInsight frontend

## Run locally

```powershell
cd frontend
npm install
npm run dev
```

The Vite development server expects the API at `http://localhost:4000/api`.
Override it with `VITE_API_URL` when the backend is hosted elsewhere:

```powershell
$env:VITE_API_URL = "https://api.example.com/api"
npm run dev
```

The application includes:

- car browsing, filtering, details, ratings, and review management;
- side-by-side comparison of two cars;
- registration, login, profile and avatar management;
- tips/problems with post creation, comments, and voting;
- community discussions with discussion creation and replies;
- administrator dashboard and car/review management.

Start the backend with a configured MongoDB connection before using API-backed
pages. Unauthenticated users can browse public catalogue and community content,
while creating or managing content requires login.
