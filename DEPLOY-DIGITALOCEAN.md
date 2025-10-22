# Guía de Despliegue en DigitalOcean 🌊

## 📋 Requisitos Previos

- Cuenta en DigitalOcean
- Dominio propio (opcional pero recomendado)
- SSH key configurado

## 🚀 Opción 1: Droplet con Node.js (Recomendado)

### Paso 1: Crear un Droplet

1. Entra a DigitalOcean
2. Crea un nuevo Droplet
3. Selecciona:
   - **Imagen:** Ubuntu 22.04 LTS
   - **Plan:** Basic ($6/mes es suficiente)
   - **Datacenter:** Closest to Chile (São Paulo o New York)
4. Agrega tu SSH key
5. Crea el droplet

### Paso 2: Conectar al Droplet

```bash
ssh root@TU_IP_DEL_DROPLET
```

### Paso 3: Instalar Node.js y PM2

```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Instalar PM2 (gestor de procesos)
npm install -g pm2

# Instalar Git
apt install -y git
```

### Paso 4: Subir tu Proyecto

**Opción A: Usando Git (Recomendado)**

```bash
# En tu Droplet
cd /var/www
git clone TU_REPOSITORIO.git kinguin-ml
cd kinguin-ml
```

**Opción B: Usando SCP desde tu PC**

```bash
# Desde tu PC (PowerShell)
scp -r "C:\Users\PC\Desktop\finalmente" root@TU_IP:/var/www/kinguin-ml
```

### Paso 5: Configurar Variables de Entorno

```bash
cd /var/www/kinguin-ml

# Crear archivo .env desde el ejemplo
cp .env.example .env

# Editar con tus credenciales
nano .env
```

Actualiza estas líneas:
```
ML_REDIRECT_URI=https://TU_DOMINIO.com/callback
NODE_ENV=production
```

### Paso 6: Instalar Dependencias y Arrancar

```bash
# Instalar dependencias
npm install --production

# Iniciar con PM2
pm2 start server.js --name kinguin-ml

# Configurar PM2 para auto-inicio
pm2 startup
pm2 save
```

### Paso 7: Configurar Nginx (Opcional pero recomendado)

```bash
# Instalar Nginx
apt install -y nginx

# Crear configuración
nano /etc/nginx/sites-available/kinguin-ml
```

Pega esta configuración:

```nginx
server {
    listen 80;
    server_name TU_DOMINIO.com www.TU_DOMINIO.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Activar el sitio:
```bash
ln -s /etc/nginx/sites-available/kinguin-ml /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Paso 8: Configurar SSL con Let's Encrypt (HTTPS)

```bash
# Instalar Certbot
apt install -y certbot python3-certbot-nginx

# Obtener certificado SSL
certbot --nginx -d TU_DOMINIO.com -d www.TU_DOMINIO.com

# Renovación automática ya está configurada
```

## 🚀 Opción 2: App Platform (Más Fácil, Más Caro)

### Ventajas
- No necesitas configurar servidores
- Auto-scaling
- HTTPS automático
- Despliegue desde Git

### Pasos

1. Ve a DigitalOcean → App Platform
2. Crea nueva App
3. Conecta tu repositorio de GitHub/GitLab
4. Configura:
   - **Type:** Web Service
   - **Build Command:** `npm install`
   - **Run Command:** `npm start`
   - **Port:** 3000
5. Agrega variables de entorno desde `.env.example`
6. Deploy!

Costo: ~$12/mes

## 🔄 Actualizar la Aplicación

### Si usas PM2:
```bash
cd /var/www/kinguin-ml
git pull
npm install
pm2 restart kinguin-ml
```

### Si usas App Platform:
- Solo haz `git push`, se actualiza automáticamente

## 📊 Monitoreo con PM2

```bash
# Ver logs en tiempo real
pm2 logs kinguin-ml

# Ver estado
pm2 status

# Reiniciar
pm2 restart kinguin-ml

# Detener
pm2 stop kinguin-ml
```

## 🔒 Seguridad

### Configurar Firewall

```bash
# Habilitar UFW
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

### Actualizar MercadoLibre Redirect URI

Una vez tengas tu dominio:
1. Ve a https://developers.mercadolibre.cl/
2. Edita tu aplicación
3. Cambia Redirect URI a: `https://TU_DOMINIO.com/callback`
4. Actualiza también en `config/config.json` o `.env`

## 💾 Backup de Base de Datos

```bash
# Script de backup automático
crontab -e
```

Agrega esta línea (backup diario a las 3 AM):
```
0 3 * * * cp /var/www/kinguin-ml/data/db.json /var/www/kinguin-ml/data/backup-$(date +\%Y\%m\%d).json
```

## 🔧 Variables de Entorno en Producción

Modifica `server.js` para usar variables de entorno:

Ya está preparado para leer de `.env` si instalas:
```bash
npm install dotenv
```

## 📝 Checklist de Deployment

- [ ] Droplet creado y configurado
- [ ] Node.js y PM2 instalados
- [ ] Código subido al servidor
- [ ] Variables de entorno configuradas
- [ ] Dependencias instaladas
- [ ] PM2 iniciado y configurado para auto-inicio
- [ ] Nginx instalado y configurado (opcional)
- [ ] SSL configurado con Let's Encrypt
- [ ] Redirect URI actualizado en MercadoLibre
- [ ] Access Token generado con el nuevo dominio
- [ ] Firewall configurado
- [ ] Backup configurado

## 🌐 Dominios Recomendados

Si no tienes dominio, estos son baratos:
- Namecheap.com (~$8/año)
- Cloudflare Registrar (~$9/año)
- Porkbun.com (~$6/año)

## 💰 Costos Estimados

**Opción Droplet + Nginx:**
- Droplet $6/mes
- Dominio $8/año
- **Total: ~$6.70/mes**

**Opción App Platform:**
- App Platform $12/mes
- Dominio $8/año
- **Total: ~$12.70/mes**

---

**¿Necesitas ayuda con el deployment? Revisa los logs con `pm2 logs`** 🚀
