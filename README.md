# Kogenta Explorer Lite (Demo)

A minimal, self-contained demo (frontend + FastAPI backend) you can deploy on **Render** or run locally.

## Features
- Search demo POIs (ASDA, Tesco, Oxford Circus, etc.)
- "Now" busyness score (0–100)
- Flows (mock origin areas)
- 24‑hour forecast sparkline
- Leaflet map frontend, FastAPI backend

## Local Run

```bash
pip install -r requirements.txt
uvicorn api.main:app --host 0.0.0.0 --port 8000
```

Open: `http://localhost:8000/web/`

## Deploy on Render (free)

1. Push this repo to GitHub.
2. On render.com → **New +** → **Web Service** → connect repo.
3. Render will auto-read `render.yaml`.
4. When live, open: `https://<your-service>.onrender.com/web/`

### Useful endpoints
- API docs: `/docs`
- POI search: `/api/poi?q=ASDA`
- Busyness: `/api/busyness?lat=51.47&lon=-0.07`
- Flows: `/api/flows?lat=51.47&lon=-0.07`
- Forecast: `/api/forecast?lat=51.47&lon=-0.07`
```