# 🎮 Kinguin → MercadoLibre Automation

Sistema automatizado para publicar productos de Kinguin en MercadoLibre con solo ingresar el ID del producto.

## 🚀 Características

- ✅ Obtiene información de productos desde la API de Kinguin
- ✅ Convierte precios de EUR a CLP en tiempo real
- ✅ Genera títulos y descripciones optimizadas automáticamente
- ✅ Publica directamente en MercadoLibre
- ✅ Base de datos JSON simple para tracking
- ✅ Panel web intuitivo para gestionar productos

## 🏗️ Deploy Rápido en DigitalOcean

[![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/TU_USUARIO/TU_REPO)

## 📋 Requisitos

- Node.js 18+
- Cuenta de Kinguin con API Key
- Cuenta de MercadoLibre con credenciales de API

## 🔧 Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/kinguin-mercadolibre.git
cd kinguin-mercadolibre
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` con tus credenciales:

```env
KINGUIN_API_KEY=tu_api_key
ML_CLIENT_ID=tu_client_id
ML_CLIENT_SECRET=tu_client_secret
ML_ACCESS_TOKEN=tu_access_token
ML_REDIRECT_URI=https://tu-dominio.com/callback
PORT=3000
NODE_ENV=production
```

O copia `config/config.example.json` a `config/config.json` y edítalo.

### 4. Iniciar el servidor

```bash
npm start
```

## 🌐 Deploy en DigitalOcean App Platform

1. Fork este repositorio
2. Ve a [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
3. Crea nueva App desde GitHub
4. Selecciona este repositorio
5. Configura las variables de entorno en el panel
6. Deploy!

## 📚 Documentación

- [Inicio Rápido](INICIO-RAPIDO.md)
- [Configurar MercadoLibre](CONFIGURAR-MERCADOLIBRE.md)
- [Deploy en DigitalOcean](DEPLOY-DIGITALOCEAN.md)
- [Comandos útiles](COMANDOS.md)

## 🔄 Flujo del Sistema

```
Usuario ingresa ID de Kinguin
    ↓
Obtiene producto y precio de Kinguin API
    ↓
Convierte EUR a CLP (tasa actual)
    ↓
Genera título y descripción
    ↓
Publica en MercadoLibre
    ↓
Guarda en base de datos
    ↓
✅ ¡Producto publicado!
```

## 🛠️ Tecnologías

- Node.js + Express
- Kinguin API
- MercadoLibre API
- Exchange Rate API

## 📝 License

MIT

## 🤝 Contribuir

Pull requests son bienvenidos!

---

**Hecho con ❤️ para automatizar tus ventas**
