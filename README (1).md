# THERMAL/AI — AI-Powered Thermal Anomaly Detector

A simple, static one-page website showcasing an AI-based thermal detection concept: how a raw infrared frame becomes a classified alert (human, machine, ambient, anomaly), plus a live-style animated thermal signature and a simulated detector log feed.

## Files
- `index.html` — page structure/content
- `style.css` — all styling
- `script.js` — canvas thermal animation + simulated log feed
- No build step, no dependencies to install. It's plain HTML/CSS/JS.

## How to put this on GitHub

1. Create a new repository on GitHub (e.g. `thermal-ai-site`).
2. Upload these three files (`index.html`, `style.css`, `script.js`) to the repo — either via "Add file → Upload files" in the GitHub web UI, or with git:
   ```bash
   git init
   git add index.html style.css script.js README.md
   git commit -m "Initial commit: thermal AI detector site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
3. To publish it live with GitHub Pages:
   - Go to the repo → **Settings → Pages**
   - Under "Build and deployment", set **Source** to `Deploy from a branch`
   - Choose branch `main`, folder `/ (root)`, then **Save**
   - Your site will be live at `https://<your-username>.github.io/<your-repo>/` within a minute or two.

## Customizing
- Replace the GitHub link placeholders (`https://github.com/`) in `index.html` with your actual repo URL.
- The stats in the hero section, feature cards, and use cases are illustrative — swap in your project's real numbers and claims.
- Colors and fonts are defined as CSS custom properties at the top of `style.css` under `:root` if you want to retheme it.
