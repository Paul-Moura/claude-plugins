@echo off
REM Setup script for locale-translations MCP server (Windows)
REM This script installs dependencies and builds the TypeScript server

cd /d "%~dp0"

echo Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm install failed
    exit /b 1
)

echo Building TypeScript...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed
    exit /b 1
)

echo.
echo Setup complete! The MCP server has been built successfully.
