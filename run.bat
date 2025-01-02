@echo off
setlocal enabledelayedexpansion

:main_menu
cls
echo ===== PORTFOLIO DEVELOPMENT TOOLS =====
echo.
echo 1. Local Development Mode
echo 2. Production Test Mode
echo 3. Exit
echo.
set /p choice="Select mode: "

if "%choice%"=="1" goto :local_menu
if "%choice%"=="2" goto :prod_menu
if "%choice%"=="3" exit /b
goto :main_menu

:local_menu
cls
echo ===== LOCAL DEVELOPMENT MODE =====
echo Current Mode: Local Development
echo.
echo Requirements:
echo - Docker must be DOWN
echo - Port 3001: Frontend (http://localhost:3001)
echo - Port 3003: Backend (http://localhost:3003)
echo.
echo Options:
echo 1. Start Local Development (opens both servers)
echo 2. View Server Logs
echo 3. Return to Main Menu
echo.
set /p lchoice="Select option: "

if "%lchoice%"=="1" (
    call :start_local_dev
    goto :local_menu
)
if "%lchoice%"=="2" (
    call :view_local_logs
    goto :local_menu
)
if "%lchoice%"=="3" goto :main_menu
goto :local_menu

:prod_menu
cls
echo ===== PRODUCTION TEST MODE =====
echo Current Mode: Production Testing
echo.
echo Requirements:
echo - Docker must be UP
echo - Frontend: https://synergycodelabs.github.io
echo - Backend: https://api.synergycodelabs.com
echo.
echo Options:
echo 1. Start Docker Services
echo 2. View Docker Logs
echo 3. Deploy to GitHub Pages
echo 4. Return to Main Menu
echo.
set /p pchoice="Select option: "

if "%pchoice%"=="1" (
    call :start_docker_services
    goto :prod_menu
)
if "%pchoice%"=="2" (
    docker-compose logs -f
    goto :prod_menu
)
if "%pchoice%"=="3" (
    npm run deploy
    goto :prod_menu
)
if "%pchoice%"=="4" goto :main_menu
goto :prod_menu

:start_local_dev
:: Check Docker status
echo Checking Docker status...
docker ps >nul 2>&1
if %errorlevel% equ 0 (
    echo Docker is currently running
    echo Stopping Docker containers...
    docker-compose down
    echo Waiting for Docker to fully stop...
    timeout /t 5 /nobreak >nul
)

:: Start backend server in new terminal
echo Starting backend server...
start cmd /k "cd server && echo Starting backend server... && npm run dev"

:: Start frontend in new terminal
echo Starting frontend...
start cmd /k "echo Starting frontend server... && npm run dev"

echo.
echo Local development servers are starting...
echo - Frontend will be available at: http://localhost:3001
echo - Backend will be available at: http://localhost:3003
echo.
exit /b

:start_docker_services
:: First check for and close any local dev servers
echo Checking for local development servers...
tasklist | find "node.exe" >nul
if %errorlevel% equ 0 (
    echo Found local development servers running
    echo Stopping local servers...
    taskkill /F /IM "node.exe" >nul 2>&1
    timeout /t 3 /nobreak >nul
)

:: Start Docker services
echo Starting Docker services...
docker-compose up -d

echo.
echo Production services are starting...
echo - Frontend will be available at: https://synergycodelabs.github.io
echo - Backend will be available at: https://api.synergycodelabs.com
echo.
exit /b

:view_local_logs
cd server && npm run logs
exit /b