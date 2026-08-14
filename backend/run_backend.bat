@echo off
cd /d "C:\Users\MSI\Desktop\Codavatar\Connectia\backend"
venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
