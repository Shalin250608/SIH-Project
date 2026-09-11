@echo off
title SparkLine Backend Server (Port 5000)
color 0B
echo ========================================================
echo        ⚡ SparkLine SIH26092 - Backend Service ⚡
echo ========================================================
echo.
echo Starting Node.js backend server with SQLite on port 5000...
echo.

cd /d "%~dp0backend"
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
)

echo.
echo Server log output:
echo --------------------------------------------------------
node server.js

pause