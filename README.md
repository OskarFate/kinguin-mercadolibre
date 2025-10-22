# Kinguin → MercadoLibre Automation

Sistema automatizado para publicar productos de Kinguin en MercadoLibre con solo ingresar el ID del producto.

## 🚀 Características

- ✅ Obtiene información de productos desde la API de Kinguin
- ✅ Convierte precios de EUR a CLP en tiempo real
- ✅ Genera títulos y descripciones optimizadas automáticamente
- ✅ Publica directamente en MercadoLibre
- ✅ Base de datos JSON simple para tracking
- ✅ Panel web intuitivo para gestionar productos

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- Cuenta de Kinguin con API Key
- Cuenta de MercadoLibre con credenciales de API

## 🔧 Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar credenciales:**

Edita el archivo `config/config.json` con tus credenciales:

```json
{
  "kinguin": {
    "apiKey": "TU_API_KEY_DE_KINGUIN"
  },
  "mercadolibre": {
    "clientId": "TU_CLIENT_ID",
    "clientSecret": "TU_CLIENT_SECRET",
    "accessToken": "TU_ACCESS_TOKEN"
  }
}
```

### 📌 Cómo obtener las credenciales:

**Kinguin:**
- Regístrate en https://www.kinguin.net/
- Ve a la sección de desarrolladores
- Genera tu API Key

**MercadoLibre:**
- Crea una aplicación en https://developers.mercadolibre.cl/
- Obtén tu Client ID y Client Secret
- Genera un Access Token usando OAuth 2.0

## 🎯 Uso

1. **Iniciar el servidor:**
```bash
npm start
```

2. **Abrir el panel:**

Abre tu navegador en: `http://localhost:3000`

3. **Procesar un producto:**
   - Ingresa el ID del producto de Kinguin
   - Haz clic en "🚀 Procesar"
   - ¡El sistema hará todo automáticamente!

## 📂 Estructura del Proyecto

```
finalmente/
├── config/
│   └── config.json          # Configuración y API keys
├── data/
│   └── db.json             # Base de datos local (se auto-genera)
├── src/
│   ├── kinguin.js          # Módulo para API de Kinguin
│   ├── currency.js         # Conversión de moneda EUR->CLP
│   ├── titleGenerator.js   # Generación de títulos/descripciones
│   ├── mercadolibre.js     # Módulo para API de MercadoLibre
│   └── processor.js        # Orquestador principal
├── public/
│   └── index.html          # Panel de control web
├── server.js               # Servidor Express
├── package.json            # Dependencias
└── README.md              # Este archivo
```

## 🔄 Flujo del Proceso

1. **INPUT:** Usuario ingresa ID de Kinguin
2. **KINGUIN API:** Obtiene info del producto y precio más barato
3. **CONVERSIÓN:** EUR → CLP con tasa de cambio actual
4. **GENERACIÓN:** Crea título y descripción optimizados
5. **MERCADOLIBRE:** Publica el producto
6. **DATABASE:** Guarda registro en db.json
7. **OUTPUT:** Muestra link de la publicación

## 💰 Configuración de Precios

El margen de ganancia se configura en `config.json`:

```json
{
  "priceMarkup": 1.2
}
```

- `1.2` = 20% de ganancia
- `1.5` = 50% de ganancia
- etc.

## 🗄️ Base de Datos

Los productos se guardan en `data/db.json` con la siguiente estructura:

```json
{
  "products": [
    {
      "kinguinId": "12345",
      "name": "Nombre del Juego",
      "priceEur": 10.50,
      "priceClp": 12000,
      "mercadolibreId": "MLC123456789",
      "permalink": "https://...",
      "createdAt": "2025-10-22T..."
    }
  ]
}
```

## 🔍 API Endpoints

- `GET /` - Panel de control web
- `POST /api/process` - Procesar producto por ID
- `GET /api/products` - Listar todos los productos
- `DELETE /api/products/:id` - Eliminar producto

## 🛠️ Desarrollo

Para desarrollo con auto-reload:

```bash
npm run dev
```

## ⚠️ Notas Importantes

1. **API Limits:** Respeta los límites de las APIs de Kinguin y MercadoLibre
2. **Access Token:** El token de MercadoLibre expira cada 6 horas, deberás renovarlo
3. **Precios:** Los precios se convierten automáticamente con la tasa actual
4. **Testing:** Prueba con productos de bajo valor primero

## 🐛 Troubleshooting

**Error de conexión a Kinguin:**
- Verifica tu API Key
- Revisa que el ID del producto exista

**Error al publicar en MercadoLibre:**
- Verifica que tu Access Token esté vigente
- Asegúrate de tener permisos de publicación
- Revisa los logs en la consola del servidor

**Error de conversión de moneda:**
- El sistema usa una tasa de respaldo si la API falla
- Puedes configurar una tasa fija en el código si lo prefieres

## 📝 TODO / Mejoras Futuras

- [ ] Renovación automática del token de MercadoLibre
- [ ] Actualización automática de precios
- [ ] Mejores templates de títulos y descripciones
- [ ] Soporte para más categorías
- [ ] Sistema de logs más robusto
- [ ] Dashboard con estadísticas

## 📧 Soporte

Si tienes dudas o problemas, revisa los logs en la consola del servidor para más detalles.

---

**¡Listo para automatizar tus publicaciones! 🚀**
