# Vercel Deployment

Deploy `Backend` and `Frontend` as two separate Vercel projects.

## Backend

Set these Vercel environment variables for Production:

- `MONGO_URI`: a reachable MongoDB Atlas connection string. Allow Vercel in Atlas Network Access.
- `JWT_SECRET`: a long random secret.
- `CLIENT_URL`: the deployed frontend URL, for example `https://your-frontend.vercel.app`.
- `API_URL`: the deployed backend URL.
- `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`: ImageKit credentials.

The backend uses `api/index.js` as a Vercel serverless function. Uploaded media goes to ImageKit; Vercel's temporary filesystem is only used during local development.

## Frontend

Set `VITE_API_URL` to the deployed backend URL, for example `https://your-backend.vercel.app`.

The frontend `vercel.json` rewrites SPA routes such as `/home` and `/saved` to `index.html`.

Uploads are limited to 4MB because Vercel serverless requests are not suitable for large media. For larger reels, use direct browser-to-ImageKit uploads.