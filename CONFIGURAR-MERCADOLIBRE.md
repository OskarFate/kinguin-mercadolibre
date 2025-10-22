# 🔐 CONFIGURAR MERCADOLIBRE - PASO A PASO

## ⚠️ IMPORTANTE: MercadoLibre requiere HTTPS

MercadoLibre **NO acepta http://**, solo **https://**

---

## 📋 PASOS PARA CONFIGURAR:

### 1️⃣ Ve a tu aplicación en MercadoLibre

Entra a: https://developers.mercadolibre.cl/apps

Busca tu aplicación con ID: **296927981421309**

### 2️⃣ Agrega el Redirect URI

En la sección **"Redirect URIs"**, agrega:

```
https://localhost:3000/callback
```

⚠️ **Debe ser HTTPS, no HTTP**

Haz clic en **"Agregar Redirect URI"** y luego **"Guardar"**

### 3️⃣ Instala las dependencias

```bash
npm install
```

Esto instalará el paquete `selfsigned` necesario para HTTPS en local.

### 4️⃣ Inicia el servidor

```bash
npm start
```

O doble clic en `start.bat`

El servidor iniciará en: **https://localhost:3000** (con HTTPS)

### 5️⃣ Obtén tu Access Token

Opción A - Script automático:
```bash
node get-token.js
```

Opción B - Manualmente:
1. Abre: https://localhost:3000
2. Tu navegador mostrará una advertencia de seguridad (es normal)
3. Haz clic en **"Avanzado"** → **"Continuar a localhost"**
4. Inicia sesión en MercadoLibre
5. Autoriza la aplicación
6. Copia el Access Token
7. Pégalo en `config/config.json`

---

## 🔧 Si tu navegador muestra advertencia de seguridad:

Es **NORMAL** porque usamos un certificado auto-firmado para desarrollo local.

### En Chrome/Edge:
1. Cuando veas "Su conexión no es privada"
2. Haz clic en **"Avanzado"**
3. Haz clic en **"Ir a localhost (no seguro)"**

### En Firefox:
1. Cuando veas "Advertencia: Riesgo potencial de seguridad"
2. Haz clic en **"Avanzado"**
3. Haz clic en **"Aceptar el riesgo y continuar"**

**¡Esto es seguro en localhost!** Es solo para desarrollo local.

---

## ✅ Verificación

Una vez configurado, deberías poder:

1. ✅ Abrir https://localhost:3000
2. ✅ Hacer clic en "Iniciar Autorización"
3. ✅ Ver la pantalla de login de MercadoLibre
4. ✅ Autorizar y recibir tu Access Token

---

## 🌐 Para Producción (DigitalOcean)

Cuando subas a producción:

1. Cambia el Redirect URI en MercadoLibre a:
   ```
   https://TU_DOMINIO.com/callback
   ```

2. Actualiza `config/config.json`:
   ```json
   "redirectUri": "https://TU_DOMINIO.com/callback"
   ```

3. Genera un nuevo Access Token con ese dominio

---

## 🆘 Problemas Comunes

### "La dirección debe contener https://"
→ Asegúrate de escribir `https://localhost:3000/callback` (no http)

### "El navegador no se conecta"
→ Asegúrate de que el servidor esté corriendo con `npm start`

### "Error SSL_PROTOCOL_ERROR"
→ Instala las dependencias: `npm install`

### "Access denied"
→ Verifica que tu App ID y Secret sean correctos en config.json

---

## 📝 Resumen de URLs

- **Desarrollo**: `https://localhost:3000/callback`
- **Producción**: `https://TU_DOMINIO.com/callback`

⚠️ **Siempre usa HTTPS, nunca HTTP**

---

¿Todo listo? Ejecuta `npm start` y ve a https://localhost:3000 🚀
