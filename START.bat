@echo off
cd /d "%~dp0"

echo Starting Backend Server...
cd backend
start "Sweeto Tech Backend" cmd /c "npm install && npm start"
cd ..

echo Starting Frontend...
start http://localhost:5173
npm run dev
