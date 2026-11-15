@echo off
set "PATH=C:\Users\user\AppData\Roaming\fnm\node-versions\v26.13.1\installation;%PATH%"
echo Starting Mirage Horizon Development Server...
cd /d "%~dp0"
call npm run dev
pause
