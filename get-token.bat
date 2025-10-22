@echo off
echo ========================================
echo Generando Access Token de MercadoLibre
echo ========================================
echo.
echo Este script te ayudara a obtener tu Access Token
echo.
echo 1. Se abrira un navegador
echo 2. Inicia sesion en MercadoLibre
echo 3. Autoriza la aplicacion
echo 4. Copia el token generado
echo 5. Pegalo en config/config.json
echo.
pause
echo.
echo Iniciando servidor OAuth...
echo.

call node get-token.js
