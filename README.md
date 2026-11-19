# Mini Spotify (Vercel)

Structure:
- public/        -> frontend (index.html, style.css, script.js) + public/songs/ (mp3 files)
- api/songs.js   -> backend (Vercel serverless function)
- songs.json     -> song data

## Run locally
npm i -g vercel
vercel dev

## Deploy
1. Put mp3 files in public/songs/ (song1.mp3, song2.mp3, song3.mp3)
2. Push folder to GitHub
3. vercel.com -> Add New Project -> import repo -> Deploy
   (Framework Preset: Other, leave build settings empty)
