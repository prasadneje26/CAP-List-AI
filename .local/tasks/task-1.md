---
title: Push changes to GitHub
---
# Push Latest Changes to GitHub

## What & Why
Commit all current file changes and push them to the GitHub remote at `https://github.com/prasadneje26/CAP-List-AI` on the `main` branch.

## Done looks like
- All uncommitted file changes are staged and committed with a descriptive message
- The commit is pushed to `origin main` on GitHub
- `git log --oneline -3` shows the new commit at HEAD on both local and remote

## Out of scope
- Branch management or pull requests
- Any code changes

## Tasks
1. **Stage and commit** — Run `git add .` then `git commit -m "Fix student profile save route and chatbot service; add college comparison, profile page, document checklist, and auth improvements"` to capture all pending changes.

2. **Push to GitHub** — Run `git push origin main` to push the commit to the GitHub remote.

## Relevant files
- `frontend-web/src/pages/InputPage.jsx`