// Servidor Express para el panel web
require('dotenv').config();
const express = require('express');
const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

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
