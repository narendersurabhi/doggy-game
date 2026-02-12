# IMPLEMENTATION_PLAN

Goal: Build a game, where you play as a little doggy beating up a rabbit and pulling it to shreds. Build a production grade app with very user friendly and very appealing UI. Keep the implementation compact. All file paths must be workspace-relative (repo-relative) and must NOT be prefixed with repos/, repositories/, or the repository name. If constraints are provided, follow them.

## Steps
- [x] Step 1: Project scaffold (files: package.json, README.md, .gitignore, tsconfig.json, .eslintrc.json)
- [x] Step 2: Vite + React entry (files: index.html, vite.config.ts, src/main.tsx, src/App.tsx, src/styles.css)
- [x] Step 3: UI components (files: src/components/Game.tsx, src/components/HUD.tsx, src/components/Controls.tsx)
- [x] Step 4: Game logic & hooks (files: src/game/engine.ts, src/game/useGame.ts, src/game/types.ts)
- [x] Step 5: Art assets (SVG placeholders) (files: src/assets/dog.svg, src/assets/rabbit.svg, src/assets/toy.svg)
- [x] Step 6: Tests & test setup (files: tests/game.spec.tsx, src/setupTests.ts, vitest.config.ts)
- [x] Step 7: Containerization & CI (files: Dockerfile, .dockerignore, .github/workflows/ci.yml)
- [x] Step 8: PWA support & icons (files: public/manifest.json, src/service-worker.ts, src/icons/icon-192.svg)
