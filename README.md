# AutoInsight

React/Vite frontend for the AutoInsight car review and community platform.

## Development

```bash
npm install
npm run dev
```

The application is frontend-only. PHP, MySQL, database migrations, and XAMPP-specific code have been removed. Authentication, reviews, posts, and admin actions currently use local demo state and are ready to be wired to the future Express.js API.

## Frontend structure

- `src/App.jsx` - application routes
- `src/components/` - shared layout, navigation, footer, and car card components
- `src/pages/` - page-level route components
- `src/data.js` - temporary frontend demo data
- `src/index.css` - Tailwind entry point and shared component utilities

Tailwind is configured in `tailwind.config.js` and `postcss.config.js`. The legacy CSS directory has been removed.
