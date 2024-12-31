@echo off
setlocal enabledelayedexpansion

if "%1"=="dev" (
    echo Starting development server...
    npm run dev
    goto :eof
)

if "%1"=="server-dev" (
    echo Starting server in development mode...
    cd server
    for /f "tokens=* usebackq" %%a in (`docker ps --filter "name=portfolio-api" --format "{{.Names}}"`) do (
        echo Found running Docker container, stopping it...
        docker stop portfolio-api
    )
    npm run start:dev
    cd ..
    goto :eof
)

if "%1"=="server-prod" (
    echo Starting server in production mode...
    cd server
    npm run start:prod
    cd ..
    goto :eof
)

if "%1"=="docker-up" (
    echo Starting Docker containers...
    docker-compose up -d
    goto :eof
)

if "%1"=="docker-down" (
    echo Stopping Docker containers...
    docker-compose down
    goto :eof
)

if "%1"=="docker-rebuild" (
    echo Rebuilding and restarting containers...
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    goto :eof
)

if "%1"=="logs" (
    if "%2"=="" (
        echo Showing logs for all containers...
        docker-compose logs -f
    ) else (
        echo Showing logs for %2...
        docker-compose logs -f %2
    )
    goto :eof
)

if "%1"=="ssl" (
    echo Renewing SSL certificates...
    docker-compose run --rm certbot
    docker-compose restart nginx
    goto :eof
)

if "%1"=="restart-node" (
    echo Restarting Node.js server...
    taskkill /F /IM node.exe
    cd server
    start /B node server.js
    cd ..
    goto :eof
)

if "%1"=="deploy" (
    echo Deploying to GitHub Pages...
    npm run deploy
    goto :eof
)

echo Usage:
echo   %~nx0 dev            - Start development server
echo   %~nx0 server-dev     - Start server in development mode
echo   %~nx0 server-prod    - Start server in production mode
echo   %~nx0 docker-up      - Start Docker containers
echo   %~nx0 docker-down    - Stop Docker containers
echo   %~nx0 docker-rebuild - Rebuild and restart containers
echo   %~nx0 logs          - Show all container logs
echo   %~nx0 logs name     - Show logs for specific container
echo   %~nx0 ssl           - Renew SSL certificates
echo   %~nx0 restart-node  - Restart Node.js server
echo   %~nx0 deploy        - Deploy to GitHub Pages