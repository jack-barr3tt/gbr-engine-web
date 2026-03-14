# gbr-engine-web

## Dev setup

- **Prereqs:** Node/npm, Go, tmux, [air](https://github.com/air-verse/air), [Atlas](https://atlasgo.io). Postgres, Redis, RabbitMQ running locally.
- Backend env: copy `gbr-engine/.env.template` → `gbr-engine/.env`, fill in. Frontend: root `.env` has `VITE_BACKEND_URL=http://localhost:3000`.
- **Run:** `./dev.sh` — runs backend via `gbr-engine/dev.sh`, adds web window, attaches. Session `gbr-dev`: web (Vite :5173), api (:3000), queuer, trust, vstp, fetcher, schedule.
- **Stop:** `tmux kill-session -t gbr-dev`