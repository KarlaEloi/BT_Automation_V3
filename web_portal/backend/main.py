from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pathlib import Path
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== PATHS FIXOS =====
BASE_DIR = Path(__file__).resolve().parent.parent   # web_portal
FRONTEND_DIR = BASE_DIR / "frontend"
DATA_PATH = BASE_DIR / "data" / "dtp009.json"

def load_dtp():
    try:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}   # 🔒 nunca quebrar frontend

# ===== ENDPOINTS QUE JÁ FUNCIONAVAM =====
@app.get("/processo")
def processo():
    return load_dtp().get("processo", {})

@app.get("/atividades")
def atividades():
    return load_dtp().get("atividades", [])

@app.get("/entradas")
def entradas():
    return load_dtp().get("entradas", [])

@app.get("/saidas")
def saidas():
    return load_dtp().get("saidas", [])

@app.get("/riscos")
def riscos():
    return load_dtp().get("riscos", [])

@app.get("/controles")
def controles():
    return load_dtp().get("controles", [])

# ✅ ENDPOINT PADRÃO USADO PELAS OUTRAS PÁGINAS
@app.get("/dtp")
def dtp():
    return JSONResponse(content=load_dtp())

# ===== FRONTEND =====
app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

@app.get("/")
def home():
    return FileResponse(FRONTEND_DIR / "index.html")

@app.get("/{page}")
def pages(page: str):
    return FileResponse(FRONTEND_DIR / page)