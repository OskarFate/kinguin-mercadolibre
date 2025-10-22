# 🚀 DEPLOY RÁPIDO EN DIGITALOCEAN

## ✅ TU REPOSITORIO YA ESTÁ EN GITHUB

🔗 https://github.com/oskarfate/kinguin-mercadolibre

---

## 📋 AHORA SIGUE ESTOS PASOS:

### **PASO 1: Ir a DigitalOcean App Platform**

Abre esta URL: https://cloud.digitalocean.com/apps/new

(Si no tienes cuenta, créala - tienen $200 de crédito gratis por 60 días)

---

### **PASO 2: Conectar con GitHub**

1. Click en **"GitHub"**
2. Click en **"Manage Access"** 
3. Autoriza a DigitalOcean
4. Selecciona **"Only select repositories"**
5. Elige: `oskarfate/kinguin-mercadolibre`
6. Click **"Install & Authorize"**

---

### **PASO 3: Configurar la App**

1. **Source**: Ya debe estar seleccionado tu repo
2. **Branch**: `main` ✅
3. Click **"Next"**

En la siguiente pantalla:

**Configure Your App:**
- Type: **Web Service** ✅
- Name: `kinguin-mercadolibre`
- Region: Elige el más cercano (recomiendo: New York o São Paulo)

Click en **"Edit Plan"** (abajo a la derecha)

---

### **PASO 4: Editar Configuración**

Click en **"Edit"** al lado de tu app, luego:

#### Build Settings:
- Build Command: `npm install`
- Run Command: `npm start`

#### Environment Variables:
Click en **"Edit"** → **"Add Variable"** y agrega UNA POR UNA:

```
Key: KINGUIN_API_KEY
Value: f52c733bc721351a843176edd114747c
```

```
Key: ML_CLIENT_ID
Value: 296927981421309
```

```
Key: ML_CLIENT_SECRET
Value: vpbfBMsz1uMJ0ptKJj5KhKEQrVgfacuX
```

```
Key: ML_ACCESS_TOKEN
Value: PENDIENTE
```

```
Key: ML_REDIRECT_URI
Value: PENDIENTE
```

```
Key: NODE_ENV
Value: production
```

```
Key: PORT
Value: 8080
```

```
Key: PRICE_MARKUP
Value: 1.4
```

Click **"Save"**

---

### **PASO 5: Seleccionar Plan**

- Elige: **Basic - $5/month** (512 MB RAM, 1 vCPU)
- Es suficiente para comenzar

Click **"Next"**

---

### **PASO 6: Review y Launch**

1. Revisa que todo esté correcto
2. Click **"Create Resources"**
3. ⏳ **ESPERA 3-5 minutos** mientras se despliega

Verás el progreso en tiempo real.

---

## 🌐 PASO 7: Obtener tu URL

Una vez completado, verás algo como:

```
https://kinguin-mercadolibre-xxxxx.ondigitalocean.app
```

**COPIA ESA URL COMPLETA** ← LA NECESITAS

---

## 🔧 PASO 8: Actualizar Variables de Entorno

Ahora que tienes tu URL real:

1. En DigitalOcean, ve a **Settings** → **Components** → tu app
2. Click en **"Edit"**
3. Busca **"Environment Variables"**
4. **Edita** `ML_REDIRECT_URI`:
   ```
   https://kinguin-mercadolibre-xxxxx.ondigitalocean.app/callback
   ```
   (Reemplaza con TU URL real)

5. Click **"Save"**
6. La app se reiniciará automáticamente

---

## 🔐 PASO 9: Configurar MercadoLibre

1. Ve a: https://developers.mercadolibre.cl/apps
2. Abre tu aplicación
3. En **"Redirect URIs"**, agrega:
   ```
   https://kinguin-mercadolibre-xxxxx.ondigitalocean.app/callback
   ```
4. **Guarda**

---

## 🎯 PASO 10: Generar Access Token de Producción

1. Ve a tu app en producción:
   ```
   https://kinguin-mercadolibre-xxxxx.ondigitalocean.app
   ```

2. Verás tu panel

3. Navega a: `https://TU_URL/auth` o busca el botón de autorización

4. Inicia sesión en MercadoLibre

5. Autoriza la app

6. Copia el **Access Token** generado

---

## 📝 PASO 11: Agregar Access Token en DigitalOcean

1. Ve a DigitalOcean → Settings → Components
2. Edit → Environment Variables
3. Edita `ML_ACCESS_TOKEN`:
   ```
   Pega tu Access Token aquí
   ```
4. Save
5. La app se reiniciará

---

## ✅ ¡LISTO!

Tu app está en producción:

```
https://kinguin-mercadolibre-xxxxx.ondigitalocean.app
```

Ahora puedes:
- ✅ Ingresar IDs de Kinguin
- ✅ Publicar en MercadoLibre
- ✅ Acceder desde cualquier lugar
- ✅ HTTPS automático ✨

---

## 💰 Costos

- **App Platform**: $5/mes
- **Primer mes**: GRATIS (si eres nuevo usuario)
- **$200 créditos gratis** por 60 días para nuevos usuarios

---

## 🔄 Futuras Actualizaciones

Solo haz:
```bash
git add .
git commit -m "Mi actualización"
git push
```

DigitalOcean detectará el cambio y desplegará automáticamente! 🎉

---

## 🆘 ¿Problemas?

- **Ver logs**: DigitalOcean → Runtime Logs
- **Reiniciar**: Settings → Actions → Force Rebuild and Deploy
- **Ayuda**: https://docs.digitalocean.com/products/app-platform/

---

**¡Sigue estos pasos y tendrás tu app en producción en 10 minutos!** 🚀
