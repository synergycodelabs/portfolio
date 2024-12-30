@echo off
setlocal enabledelayedexpansion

REM Set Docker path
set DOCKER="C:\Program Files\Docker\Docker\resources\bin\docker.exe"
set COMPOSE="C:\Program Files\Docker\Docker\resources\bin\docker-compose.exe"

:menu
cls
echo =================================
echo Portfolio Development Tools
echo =================================
echo.
echo 1. Start Development Server
echo 2. Restart Node.js Server
echo 3. Rebuild and Deploy
echo 4. Update SSL Certificates
echo 5. Full Restart (Node.js + Nginx)
echo 6. View Logs
echo 7. Kill All Node Processes
echo 8. Exit
echo.
set /p choice="Enter your choice (1-8): "

if "%choice%"=="1" goto dev
if "%choice%"=="2" goto restart_node
if "%choice%"=="3" goto deploy
if "%choice%"=="4" goto ssl
if "%choice%"=="5" goto full_restart
if "%choice%"=="6" goto logs
if "%choice%"=="7" goto kill_node
if "%choice%"=="8" goto end

:wait
echo Waiting for %~1 seconds...
timeout /t %~1 /nobreak > nul
goto :eof

:kill_port
echo Cleaning up port 3002...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3002"') do (
    echo Found process using port 3002: %%a
    echo Killing process...
    taskkill /F /PID %%a
    call :wait 3
)
goto :eof

:kill_node
echo Killing all Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
call :kill_port
call :wait 3
echo Checking if port 3002 is still in use...
netstat -ano | findstr ":3002"
if not errorlevel 1 (
    echo Port still in use, trying again...
    call :kill_port
    call :wait 3
)
echo All Node.js processes terminated!
goto :eof

:dev
echo Starting development server...
call :kill_node
start npm run dev
goto menu

:restart_node
echo Restarting Node.js server...
call :kill_node
cd server
start /wait npm run start
cd ..
echo Node.js server restarted!
call :wait 3
goto menu

:deploy
echo Building and deploying...
call npm run build
call npm run deploy
echo Deployment completed!
call :wait 3
goto menu

:ssl
echo Updating SSL certificates...
"C:\Program Files\Git\bin\bash.exe" -c './init-letsencrypt.sh'
echo SSL certificates updated!
call :wait 3
goto menu

:verify_port
echo Verifying port 3002...
netstat -ano | findstr ":3002"
if not errorlevel 1 (
    echo Port 3002 is in use
    exit /b 1
) else (
    echo Port 3002 is free
    exit /b 0
)

:full_restart
echo Performing full restart...
echo Stopping all services...
call :kill_node
echo Stopping Docker containers...
%DOCKER% compose down
call :wait 5

echo Double checking port 3002...
call :verify_port
if not errorlevel 0 (
    echo Port still in use, forcing cleanup...
    call :kill_port
    call :wait 5
)

echo Starting Docker services...
%DOCKER% compose up -d
call :wait 5

echo Final port check before starting Node.js...
call :verify_port
if not errorlevel 0 (
    echo WARNING: Port 3002 is still in use!
    echo Would you like to continue anyway? (Y/N)
    set /p continue=
    if /i not "%continue%"=="Y" goto menu
)

echo Starting Node.js server...
cd server
start /MIN cmd /c "npm run start"
cd ..
call :wait 5

echo Full restart completed!
echo.
echo Services status:
%DOCKER% compose ps
call :wait 3
goto menu

:logs
echo Select log type:
echo 1. Node.js Server Logs
echo 2. Nginx Logs
echo 3. Docker Compose Logs
echo 4. Check Port Usage
echo 5. Back to Main Menu
set /p log_choice="Enter your choice (1-5): "

if "%log_choice%"=="1" (
    cd server
    tail -f logs/server.log
    cd ..
) else if "%log_choice%"=="2" (
    %DOCKER% compose exec nginx tail -f /var/log/nginx/access.log
) else if "%log_choice%"=="3" (
    %DOCKER% compose logs -f
) else if "%log_choice%"=="4" (
    netstat -ano | findstr ":3002"
    call :wait 10
    goto logs
) else if "%log_choice%"=="5" (
    goto menu
)
goto logs

:end
echo Exiting...
exit /b 0