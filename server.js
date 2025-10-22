// Servidor Express para el panel web
require('dotenv').config();
const express = require('express');
const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const axios = require('axios');

// Cargar configuración desde .env o config.json
let config;
try {
  config = require('./config/config.json');
  // Sobrescribir con variables de entorno si existen
  if (process.env.KINGUIN_API_KEY) {
    config.kinguin.apiKey = process.env.KINGUIN_API_KEY;
  }
  if (process.env.ML_CLIENT_ID) {
    config.mercadolibre.clientId = process.env.ML_CLIENT_ID;
  }
  if (process.env.ML_CLIENT_SECRET) {
    config.mercadolibre.clientSecret = process.env.ML_CLIENT_SECRET;
  }
  if (process.env.ML_ACCESS_TOKEN) {
    config.mercadolibre.accessToken = process.env.ML_ACCESS_TOKEN;
  }
  if (process.env.PORT) {
    config.port = process.env.PORT;
  }
} catch (error) {
  console.error('⚠️ No se pudo cargar config.json, usando solo variables de entorno');
  config = {
    kinguin: {
      apiKey: process.env.KINGUIN_API_KEY,
      apiUrl: process.env.KINGUIN_API_URL || 'https://gateway.kinguin.net/esa/api/v1'
    },
    mercadolibre: {
      clientId: process.env.ML_CLIENT_ID,
      clientSecret: process.env.ML_CLIENT_SECRET,
      accessToken: process.env.ML_ACCESS_TOKEN,
      redirectUri: process.env.ML_REDIRECT_URI || 'http://localhost:3000/callback'
    },
    currency: {
      apiUrl: process.env.CURRENCY_API_URL || 'https://api.exchangerate-api.com/v4/latest/EUR'
    },
    priceMarkup: parseFloat(process.env.PRICE_MARKUP) || 1.2,
    port: process.env.PORT || 3000
  };
}

const processor = require('./src/processor');

const app = express();
const PORT = config.port || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Ruta principal - Panel de control
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// OAuth: Redirigir al usuario a MercadoLibre para autorizar
app.get('/auth', (req, res) => {
  const ML_AUTH_URL = 'https://auth.mercadolibre.cl/authorization';
  const authUrl = `${ML_AUTH_URL}?response_type=code&client_id=${config.mercadolibre.clientId}&redirect_uri=${config.mercadolibre.redirectUri}`;
  
  console.log('📋 Redirigiendo a MercadoLibre para autorización...');
  res.redirect(authUrl);
});

// OAuth: Callback - Recibir el código de autorización y obtener el access token
app.get('/callback', async (req, res) => {
  const { code, error } = req.query;
  const ML_TOKEN_URL = 'https://api.mercadolibre.com/oauth/token';

  if (error) {
    console.error('❌ Error en la autorización:', error);
    return res.send(`
      <h1>❌ Error en la autorización</h1>
      <p>${error}</p>
      <a href="/">Volver al inicio</a>
    `);
  }

  if (!code) {
    return res.send(`
      <h1>⚠️ No se recibió código de autorización</h1>
      <a href="/auth">Iniciar autorización</a>
    `);
  }

  try {
    console.log('✅ Código recibido, obteniendo access token...');

    // Intercambiar el código por un access token
    const response = await axios.post(ML_TOKEN_URL, {
      grant_type: 'authorization_code',
      client_id: config.mercadolibre.clientId,
      client_secret: config.mercadolibre.clientSecret,
      code: code,
      redirect_uri: config.mercadolibre.redirectUri
    });

    const { access_token, refresh_token, expires_in } = response.data;

    console.log('\n' + '='.repeat(70));
    console.log('✅ ACCESS TOKEN OBTENIDO EXITOSAMENTE');
    console.log('='.repeat(70));
    console.log('\nAccess Token:', access_token);
    console.log('\nRefresh Token:', refresh_token);
    console.log(`\n⏰ Expira en: ${expires_in} segundos (${expires_in / 3600} horas)`);
    console.log('='.repeat(70) + '\n');

    // Mostrar en el navegador
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>✅ Token Obtenido</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 { color: #28a745; }
          .token-box {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #28a745;
            margin: 15px 0;
            word-break: break-all;
            font-family: monospace;
            font-size: 12px;
          }
          .warning {
            background: #fff3cd;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #ffc107;
            margin: 15px 0;
          }
          button {
            background: #28a745;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 5px;
          }
          button:hover { background: #218838; }
          .btn-secondary { background: #007bff; }
          .btn-secondary:hover { background: #0056b3; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✅ Access Token Obtenido Exitosamente</h1>
          
          <h3>🔑 Access Token:</h3>
          <div class="token-box" id="accessToken">${access_token}</div>
          <button onclick="copyToken('accessToken')">📋 Copiar Access Token</button>
          
          <h3>🔄 Refresh Token:</h3>
          <div class="token-box" id="refreshToken">${refresh_token}</div>
          <button onclick="copyToken('refreshToken')">📋 Copiar Refresh Token</button>
          
          <div class="warning">
            <strong>⚠️ IMPORTANTE:</strong>
            <ul>
              <li>Copia el <strong>Access Token</strong></li>
              <li>Ve a DigitalOcean → Settings → Environment Variables</li>
              <li>Edita <code>ML_ACCESS_TOKEN</code> y pega el token</li>
              <li>Guarda y espera que se reinicie la app</li>
              <li>El token expira en <strong>${expires_in / 3600} horas</strong></li>
            </ul>
          </div>

          <button onclick="window.location.href='/'" class="btn-secondary">
            ← Volver al Panel
          </button>
        </div>

        <script>
          function copyToken(elementId) {
            const element = document.getElementById(elementId);
            const text = element.textContent;
            navigator.clipboard.writeText(text).then(() => {
              alert('✅ Token copiado al portapapeles');
            });
          }
        </script>
      </body>
      </html>
    `);

  } catch (error) {
    console.error('❌ Error al obtener el token:', error.response?.data || error.message);
    res.send(`
      <h1>❌ Error al obtener el token</h1>
      <pre>${JSON.stringify(error.response?.data || error.message, null, 2)}</pre>
      <a href="/">Volver al inicio</a>
    `);
  }
});

// API: Procesar producto por ID de Kinguin
app.post('/api/process', async (req, res) => {
  const { kinguinId } = req.body;
  
  if (!kinguinId) {
    return res.status(400).json({ 
      success: false, 
      error: 'Se requiere un ID de Kinguin' 
    });
  }

  console.log(`\n📨 Nueva solicitud recibida: ID ${kinguinId}`);
  
  const result = await processor.processProduct(kinguinId);
  
  res.json(result);
});

// API: Obtener productos de la base de datos
app.get('/api/products', async (req, res) => {
  try {
    const dbPath = path.join(__dirname, 'data', 'db.json');
    const data = await fs.readFile(dbPath, 'utf8');
    const db = JSON.parse(data);
    res.json(db.products);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer la base de datos' });
  }
});

// API: Eliminar producto de la base de datos
app.delete('/api/products/:id', async (req, res) => {
  try {
    const dbPath = path.join(__dirname, 'data', 'db.json');
    const data = await fs.readFile(dbPath, 'utf8');
    const db = JSON.parse(data);
    
    db.products = db.products.filter(p => p.kinguinId !== req.params.id);
    
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// Iniciar servidor con HTTPS en local (para desarrollo con MercadoLibre)
const useHttps = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

if (useHttps) {
  // Certificado auto-firmado para desarrollo local
  // MercadoLibre requiere HTTPS incluso en localhost
  try {
    const selfsigned = require('selfsigned');
    const attrs = [{ name: 'commonName', value: 'localhost' }];
    const pems = selfsigned.generate(attrs, { days: 365 });
    
    const httpsOptions = {
      key: pems.private,
      cert: pems.cert
    };

    https.createServer(httpsOptions, app).listen(PORT, () => {
      console.log('\n' + '🚀'.repeat(30));
      console.log(`✅ Servidor HTTPS iniciado en https://localhost:${PORT}`);
      console.log('🚀'.repeat(30) + '\n');
      console.log('⚠️  IMPORTANTE: Si tu navegador muestra advertencia de seguridad,');
      console.log('   haz clic en "Avanzado" → "Continuar a localhost (no seguro)"');
      console.log('\n📋 Panel de control: https://localhost:3000');
      console.log('💡 Ingresa un ID de Kinguin para comenzar\n');
    });
  } catch (error) {
    console.log('⚠️  No se pudo iniciar HTTPS, usando HTTP...');
    console.log('   Para OAuth con MercadoLibre, instala: npm install selfsigned');
    http.createServer(app).listen(PORT, () => {
      console.log(`✅ Servidor HTTP iniciado en http://localhost:${PORT}`);
    });
  }
} else {
  // En producción usar HTTP normal (Nginx manejará HTTPS)
  http.createServer(app).listen(PORT, () => {
    console.log('\n' + '🚀'.repeat(30));
    console.log(`✅ Servidor iniciado en puerto ${PORT}`);
    console.log('🚀'.repeat(30) + '\n');
  });
}
