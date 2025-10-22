# 📤 SUBIR A GITHUB Y DESPLEGAR - GUÍA COMPLETA

## ✅ PASO 1: Repositorio Git ya creado

Tu código ya está en Git local. Ahora vamos a subirlo a GitHub.

---

## 🌐 PASO 2: Crear Repositorio en GitHub

### Opción A: Desde la web (MÁS FÁCIL)

1. Ve a: https://github.com/new

2. Configura así:
   - **Repository name**: `kinguin-mercadolibre`
   - **Description**: `Automated system to publish Kinguin products on MercadoLibre`
   - **Visibility**: Private (recomendado) o Public
   - ❌ **NO marques** "Add a README file"
   - ❌ **NO marques** "Add .gitignore"
   - ❌ **NO marques** "Choose a license"

3. Haz clic en **"Create repository"**

4. Copia el comando que GitHub te muestra (algo como):
   ```bash
   git remote add origin https://github.com/oskarfate/kinguin-mercadolibre.git
   git branch -M main
   git push -u origin main
   ```

---

## 📤 PASO 3: Conectar y Subir a GitHub

Ejecuta estos comandos en la terminal:

```bash
# Agregar el remote de GitHub (reemplaza con tu URL)
git remote add origin https://github.com/oskarfate/kinguin-mercadolibre.git

# Renombrar la rama a main
git branch -M main

# Subir el código
git push -u origin main
```

Si te pide autenticación, usa un **Personal Access Token** de GitHub.

### Crear un Token de GitHub:

1. Ve a: https://github.com/settings/tokens
2. Click en "Generate new token" → "Classic"
3. Dale un nombre: `kinguin-ml-deploy`
4. Selecciona permisos: `repo` (todos)
5. Click en "Generate token"
6. **COPIA EL TOKEN** (no lo volverás a ver)
7. Cuando Git te pida password, pega el token

---

## 🚀 PASO 4: Deploy en DigitalOcean App Platform

### 4.1 Ir a DigitalOcean

1. Ve a: https://cloud.digitalocean.com/apps
2. Click en **"Create App"**

### 4.2 Conectar con GitHub

1. Selecciona **"GitHub"** como source
2. Autoriza a DigitalOcean a acceder a GitHub
3. Selecciona tu repositorio: `oskarfate/kinguin-mercadolibre`
4. Branch: `main`
5. Click en **"Next"**

### 4.3 Configurar la App

**Resources:**
- Type: **Web Service**
- Name: `kinguin-mercadolibre`
- Environment Variables: (agregar después)
- Build Command: `npm install`
- Run Command: `npm start`
- HTTP Port: `3000`
- HTTP Routes: `/`

Click en **"Next"**

### 4.4 Configurar Variables de Entorno

Click en **"Edit"** en tu Web Service, luego **"Environment Variables"**

Agrega estas variables:

```
KINGUIN_API_KEY = f52c733bc721351a843176edd114747c
ML_CLIENT_ID = 296927981421309
ML_CLIENT_SECRET = vpbfBMsz1uMJ0ptKJj5KhKEQrVgfacuX
ML_ACCESS_TOKEN = PENDIENTE_GENERAR
ML_REDIRECT_URI = https://TU_APP.ondigitalocean.app/callback
PORT = 3000
NODE_ENV = production
PRICE_MARKUP = 1.2
```

⚠️ **Importante**: La URL `ML_REDIRECT_URI` la obtendrás después del deploy.

Click en **"Save"**

### 4.5 Seleccionar Plan

- **Basic Plan**: $5/mes (512 MB RAM, 1 vCPU) - RECOMENDADO
- O **$12/mes** para más recursos

Click en **"Next"**

### 4.6 Review y Deploy

- Revisa todo
- Click en **"Create Resources"**
- ⏳ Espera 3-5 minutos mientras se despliega

---

## 🌐 PASO 5: Obtener tu URL de Producción

Una vez desplegado, verás algo como:

```
https://kinguin-mercadolibre-xxxxx.ondigitalocean.app
```

**COPIA ESA URL** completa.

---

## 🔧 PASO 6: Configurar MercadoLibre con tu URL Real

### 6.1 Actualizar Redirect URI en MercadoLibre

1. Ve a: https://developers.mercadolibre.cl/apps
2. Abre tu aplicación
3. En **"Redirect URIs"**, agrega:
   ```
   https://kinguin-mercadolibre-xxxxx.ondigitalocean.app/callback
   ```
4. Guarda

### 6.2 Actualizar Variable de Entorno en DigitalOcean

1. En DigitalOcean, ve a tu App
2. Settings → Components → tu-app
3. Environment Variables
4. Edita `ML_REDIRECT_URI`:
   ```
   https://kinguin-mercadolibre-xxxxx.ondigitalocean.app/callback
   ```
5. Save

---

## 🔐 PASO 7: Generar Access Token de Producción

1. Ve a tu app en producción:
   ```
   https://kinguin-mercadolibre-xxxxx.ondigitalocean.app
   ```

2. Haz clic en "Iniciar Autorización"

3. Inicia sesión en MercadoLibre

4. Copia el **Access Token** generado

5. Ve a DigitalOcean → Settings → Environment Variables

6. Actualiza `ML_ACCESS_TOKEN` con el token real

7. La app se reiniciará automáticamente

---

## ✅ PASO 8: ¡Listo para Usar!

Tu sistema ya está en producción:

```
https://kinguin-mercadolibre-xxxxx.ondigitalocean.app
```

Ahora puedes:
- ✅ Ingresar IDs de Kinguin
- ✅ Publicar automáticamente en MercadoLibre
- ✅ Acceder desde cualquier lugar
- ✅ HTTPS automático
- ✅ Auto-deploy cuando hagas `git push`

---

## 🔄 Actualizar tu App (Futuras Actualizaciones)

```bash
# 1. Hacer cambios en el código
# 2. Commit
git add .
git commit -m "Descripción de los cambios"

# 3. Push a GitHub
git push

# 4. DigitalOcean detectará el cambio y desplegará automáticamente
```

---

## 💰 Costos

- **DigitalOcean App Platform**: $5/mes (plan básico)
- **Dominio propio** (opcional): ~$10/año
- **Total**: ~$5/mes

---

## 🆘 Troubleshooting

### "Error: Cannot find module"
→ Asegúrate de que `package.json` esté en el repo

### "Error de autorización en MercadoLibre"
→ Verifica que el Redirect URI coincida exactamente

### "Error 502 Bad Gateway"
→ Revisa los logs en DigitalOcean → Runtime Logs

---

## 📝 Checklist Final

- [ ] Repositorio creado en GitHub
- [ ] Código subido a GitHub
- [ ] App creada en DigitalOcean
- [ ] Variables de entorno configuradas
- [ ] Redirect URI actualizado en MercadoLibre
- [ ] Access Token generado en producción
- [ ] App funcionando correctamente

---

**¿Todo listo?** 

Sigue los pasos en orden y en 10 minutos tendrás tu app en producción! 🚀
