@echo off
echo Starting ZBase Development Environment

echo Starting Docker containers...
docker-compose up -d

echo Starting backend...
start cmd /k "cd backend && npm run start:dev"

echo Starting frontend...
start cmd /k "cd frontend && npm run dev"

echo ZBase environment started!
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo Swagger API Docs: http://localhost:3001/api/docs
