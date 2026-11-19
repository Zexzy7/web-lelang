@echo off
title Lelang GP 5K — TikTok Live Server
color 0A
echo ========================================================
echo    LELANG GP 5K - TIKTOK LIVE RAFFLE / AUCTION PLATFORM
echo    Powered by Google Gemini 4 Hydrogen
echo ========================================================
echo.
echo Membuka aplikasi di browser...
start http://localhost:3000
echo.
echo Menjalankan HTTP server pada port 3000...
echo Tekan Ctrl+C untuk menghentikan server.
echo.
"C:\Users\Windows 11\AppData\Roaming\Antigravity\bin\agy-node.cmd" server.js
pause
