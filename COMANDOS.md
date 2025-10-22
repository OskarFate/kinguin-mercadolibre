# ⚡ COMANDOS RÁPIDOS

## 🎯 Empezar Rápido (Windows)

```bash
# 1. Obtener Access Token
Doble clic en: get-token.bat

# 2. Instalar dependencias
Doble clic en: install.bat

# 3. Iniciar servidor
Doble clic en: start.bat
```

## 💻 Comandos en Terminal

```bash
# Instalar dependencias
npm install

# Obtener Access Token de MercadoLibre
npm run token
# o
node get-token.js

# Iniciar servidor
npm start

# Modo desarrollo (auto-reload)
npm run dev
```

## 🌊 Comandos para DigitalOcean

```bash
# Conectar al servidor
ssh root@TU_IP

# Primera vez: Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs
npm install -g pm2

# Clonar proyecto
git clone TU_REPO.git /var/www/kinguin-ml
cd /var/www/kinguin-ml

# Configurar
cp .env.example .env
nano .env  # Editar credenciales

# Instalar dependencias
npm install --production

# Iniciar con PM2
pm2 start ecosystem.config.json
pm2 save
pm2 startup

# Ver logs
pm2 logs kinguin-mercadolibre

# Reiniciar
pm2 restart kinguin-mercadolibre
```

## 🔄 Actualizar en Producción

```bash
# Opción 1: Automático
chmod +x deploy.sh
./deploy.sh

# Opción 2: Manual
git pull
npm install --production
pm2 restart kinguin-mercadolibre
```

## 📊 Monitoreo

```bash
# Ver estado de PM2
pm2 status

# Ver logs en tiempo real
pm2 logs kinguin-mercadolibre

# Monitoreo de recursos
pm2 monit

# Limpiar logs antiguos
pm2 flush
```

## 🔧 Solución de Problemas

```bash
# Si el puerto 3000 está ocupado
netstat -ano | findstr :3000
# Luego mata el proceso

# Reinstalar dependencias
rm -rf node_modules
npm install

# Ver versión de Node
node -v
npm -v

# Permisos en Linux
chmod +x deploy.sh
chmod +x start.sh
```

## 🗄️ Base de Datos

```bash
# Ver productos guardados
cat data/db.json

# Backup manual
cp data/db.json data/backup-$(date +%Y%m%d).json

# Limpiar base de datos
echo '{"products":[]}' > data/db.json
```

## 🔐 Obtener Nuevo Access Token

```bash
# Local
npm run token

# Producción (si necesitas desde el servidor)
node get-token.js
# Luego abre http://TU_IP:3000 en tu navegador
```

## 📦 IDs de Ejemplo de Kinguin

Para probar, busca productos en:
https://www.kinguin.net/

Los IDs están en la URL:
- Formato: `63f4e7b5d4b5a` (alfanumérico)
- O en el JSON de la API

## 🎨 Personalización

```bash
# Cambiar puerto
# Editar en config/config.json o .env:
PORT=8080

# Cambiar margen de ganancia
# En config/config.json o .env:
priceMarkup=1.5  # 50% de ganancia
```

## 📝 Logs

```bash
# Ver todos los logs
pm2 logs

# Solo errores
pm2 logs --err

# Últimas 100 líneas
pm2 logs --lines 100

# Guardar logs a archivo
pm2 logs > logs-$(date +%Y%m%d).txt
```

---

## 🚀 Flujo Completo de Deploy

```bash
# 1. En tu PC - Preparar código
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. En DigitalOcean - Primera vez
ssh root@TU_IP
cd /var/www
git clone TU_REPO.git kinguin-ml
cd kinguin-ml
cp .env.example .env
nano .env  # Configurar
npm install --production
pm2 start ecosystem.config.json
pm2 save
pm2 startup

# 3. Configurar Nginx (opcional)
apt install -y nginx
nano /etc/nginx/sites-available/kinguin-ml
# Copiar config de DEPLOY-DIGITALOCEAN.md
ln -s /etc/nginx/sites-available/kinguin-ml /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# 4. SSL con Let's Encrypt (opcional)
apt install -y certbot python3-certbot-nginx
certbot --nginx -d TU_DOMINIO.com

# 5. Actualizaciones futuras
./deploy.sh
```

---

**💡 Tip:** Guarda este archivo como favorito para acceso rápido a los comandos
