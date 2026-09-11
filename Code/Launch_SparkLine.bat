@echo off
title SparkLine Launcher
color 0B
echo ========================================================
echo        ⚡ SparkLine SIH26092 - Full Stack Launcher ⚡
echo ========================================================
echo.
echo Starting SparkLine Node.js Backend Server (Port 5000)...
start "SparkLine Backend Server" /min cmd /c "call ""%~dp0start_backend.bat"""

echo Opening SparkLine Portal in default web browser...
timeout /t 1 >nul
start "" "%~dp0SparkLine_Website.html"

echo.
echo SparkLine is now running!
echo Backend API : http://localhost:5000
echo Database    : backend/sparkline.db
echo.
timeout /t 3 >nul