Write-Host "Iniciando Portal BT..." -ForegroundColor Cyan

# 1. Ir para a raiz do projeto
Set-Location "C:\bt_automation"

# 2. Ativar o VENV
Write-Host "Ativando VENV..." -ForegroundColor Green
.\.venv\Scripts\Activate.ps1

# 3. Subir BACKEND (FastAPI)
Write-Host "Subindo Backend FastAPI..." -ForegroundColor Green
Start-Process powershell `
  -ArgumentList "-NoExit", "-Command", "cd C:\bt_automation\web_portal\backend; uvicorn main:app --reload"

# 4. Subir FRONTEND (HTTP Server)
Write-Host "Subindo Frontend Web..." -ForegroundColor Green
Start-Process powershell `
  -ArgumentList "-NoExit", "-Command", "cd C:\bt_automation\web_portal\frontend; python -m http.server 5500"

Write-Host "Portal iniciado com sucesso!" -ForegroundColor Cyan
Write-Host "Backend: http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host "Portal:  http://localhost:5500/index.html" -ForegroundColor Yellow