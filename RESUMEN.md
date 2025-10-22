# 📋 RESUMEN DEL PROYECTO

## ✅ Credenciales Configuradas

- **Kinguin API Key**: `f52c733bc721351a843176edd114747c`
- **MercadoLibre App ID**: `296927981421309`
- **MercadoLibre Secret**: `vpbfBMsz1uMJ0ptKJj5KhKEQrVgfacuX`
- **Access Token**: ⚠️ PENDIENTE (ver instrucciones abajo)

## 🚀 Para Empezar en LOCAL

### 1. Obtener Access Token de MercadoLibre

```bash
# Ejecuta esto:
node get-token.js

# O doble clic en:
get-token.bat
```

Luego:
1. Se abrirá http://localhost:3000 en tu navegador
2. Haz clic en "Iniciar Autorización"
3. Inicia sesión en MercadoLibre
4. Copia el Access Token
5. Pégalo en `config/config.json` en el campo `accessToken`

### 2. Instalar Dependencias

```bash
npm install

# O doble clic en:
install.bat
```

### 3. Iniciar Servidor

```bash
npm start

# O doble clic en:
start.bat
```

### 4. Usar el Panel

Abre: **http://localhost:3000**

Ingresa un ID de Kinguin y presiona "Procesar"

## 🌊 Para Subir a DigitalOcean

Lee el archivo: **`DEPLOY-DIGITALOCEAN.md`**

### Resumen Rápido:

1. **Crear Droplet** en DigitalOcean ($6/mes)
2. **Instalar Node.js y PM2**
3. **Subir el código** (Git o SCP)
4. **Configurar .env** con las credenciales
5. **Actualizar Redirect URI** en MercadoLibre a tu dominio
6. **Generar nuevo Access Token** con el dominio de producción
7. **Iniciar con PM2**: `pm2 start ecosystem.config.json`
8. **Opcional**: Configurar Nginx + SSL

## 📂 Archivos Importantes

### Para Local:
- `config/config.json` - Tus credenciales
- `get-token.bat` - Obtener Access Token
- `install.bat` - Instalar dependencias
- `start.bat` - Iniciar servidor
- `INICIO-RAPIDO.md` - Guía rápida

### Para Producción:
- `.env.example` - Template de variables de entorno
- `ecosystem.config.json` - Configuración PM2
- `deploy.sh` - Script de deployment
- `DEPLOY-DIGITALOCEAN.md` - Guía completa de deploy

### Módulos del Sistema:
- `src/kinguin.js` - API de Kinguin
- `src/currency.js` - Conversión EUR → CLP
- `src/titleGenerator.js` - Títulos y descripciones
- `src/mercadolibre.js` - Publicación en ML
- `src/processor.js` - Orquestador principal
- `server.js` - Servidor Express
- `public/index.html` - Panel web

## 🔄 Flujo Completo

```
Usuario ingresa ID de Kinguin
    ↓
src/kinguin.js → Obtiene producto y precio más barato en EUR
    ↓
src/currency.js → Convierte EUR a CLP (tasa actual)
    ↓
src/titleGenerator.js → Genera título y descripción
    ↓
src/mercadolibre.js → Publica en MercadoLibre
    ↓
src/processor.js → Guarda en data/db.json
    ↓
¡Producto publicado! ✅
```

## 📊 Comandos Útiles

### Local:
```bash
npm start              # Iniciar servidor
npm run dev            # Modo desarrollo (auto-reload)
npm run token          # Obtener Access Token ML
```

### Producción (PM2):
```bash
npm run pm2:start      # Iniciar con PM2
npm run pm2:restart    # Reiniciar
npm run pm2:stop       # Detener
npm run pm2:logs       # Ver logs
```

## ⚠️ Recordatorios

1. **Access Token expira cada 6 horas** - Deberás renovarlo
2. **Precios en tiempo real** - Usa la tasa de cambio actual EUR→CLP
3. **Base de datos simple** - Se guarda en `data/db.json` (archivo local)
4. **Para producción** - Considera usar una base de datos real (MongoDB, PostgreSQL)

## 🔒 Seguridad

- ✅ No subas `config/config.json` a Git (ya está en .gitignore)
- ✅ Usa `.env` en producción
- ✅ Renueva Access Token regularmente
- ✅ Configura firewall en DigitalOcean

## 📝 Próximas Mejoras (Sugerencias)

- [ ] Auto-renovación del Access Token
- [ ] Mejores templates de títulos (optimizados para SEO)
- [ ] Actualización automática de precios
- [ ] Base de datos en la nube (MongoDB Atlas gratuito)
- [ ] Sistema de categorías más completo
- [ ] Webhook para notificaciones de ventas
- [ ] Dashboard con estadísticas

## 🐛 Si Algo No Funciona

1. **Revisa los logs** en la consola
2. **Verifica credenciales** en `config/config.json`
3. **Asegúrate** de tener el Access Token actualizado
4. **Comprueba** tu conexión a internet
5. **Lee** los archivos README y INICIO-RAPIDO

---

## 🎉 ¡TODO LISTO!

El proyecto está completamente configurado y listo para usar.

**Para empezar AHORA:**
1. Ejecuta `get-token.bat`
2. Obtén tu Access Token
3. Pégalo en `config/config.json`
4. Ejecuta `start.bat`
5. Abre http://localhost:3000
6. ¡Empieza a publicar!

**Para producción:**
- Lee `DEPLOY-DIGITALOCEAN.md` cuando estés listo

---

¡Éxitos con tu proyecto! 🚀
