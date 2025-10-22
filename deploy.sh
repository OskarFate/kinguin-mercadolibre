#!/bin/bash

# Script de despliegue para DigitalOcean
# Ejecuta esto en tu servidor después de hacer git pull

echo "=========================================="
echo "🚀 Desplegando Kinguin → MercadoLibre"
echo "=========================================="
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Paso 1: Actualizar código
echo -e "${YELLOW}📥 Actualizando código desde Git...${NC}"
git pull origin main

# Paso 2: Instalar dependencias
echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
npm install --production

# Paso 3: Verificar configuración
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Error: Archivo .env no encontrado${NC}"
    echo "Copia .env.example a .env y configura tus credenciales"
    exit 1
fi

# Paso 4: Crear directorio de logs si no existe
mkdir -p logs

# Paso 5: Reiniciar aplicación con PM2
echo -e "${YELLOW}🔄 Reiniciando aplicación...${NC}"
pm2 restart kinguin-mercadolibre || pm2 start ecosystem.config.json

# Paso 6: Verificar estado
echo ""
echo -e "${GREEN}✅ Despliegue completado!${NC}"
echo ""
pm2 status

echo ""
echo "=========================================="
echo "📊 Para ver los logs ejecuta:"
echo "   pm2 logs kinguin-mercadolibre"
echo "=========================================="
