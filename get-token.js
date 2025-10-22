// Script para obtener el Access Token de MercadoLibre usando OAuth 2.0
const express = require('express');
const https = require('https');
const axios = require('axios');
const config = require('./config/config.json');

const app = express();
const PORT = 3000;

// Certificado auto-firmado para desarrollo local
let selfsigned;
try {
  selfsigned = require('selfsigned');
} catch (error) {
  console.error('⚠️  Error: Debes instalar las dependencias primero');
  console.log('   Ejecuta: npm install');
  process.exit(1);
}

// URL base de MercadoLibre Chile
const ML_AUTH_URL = 'https://auth.mercadolibre.cl/authorization';
const ML_TOKEN_URL = 'https://api.mercadolibre.com/oauth/token';

console.log('\n' + '='.repeat(70));
console.log('🔐 GENERADOR DE ACCESS TOKEN - MERCADOLIBRE');
console.log('='.repeat(70) + '\n');

// Paso 1: Redirigir al usuario a MercadoLibre para autorizar
app.get('/auth', (req, res) => {
  const authUrl = `${ML_AUTH_URL}?response_type=code&client_id=${config.mercadolibre.clientId}&redirect_uri=${config.mercadolibre.redirectUri}`;
  
  console.log('📋 Redirigiendo a MercadoLibre para autorización...');
  res.redirect(authUrl);
});

// Paso 2: Callback - Recibir el código de autorización y obtener el access token
app.get('/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    console.error('❌ Error en la autorización:', error);
    return res.send(`
      <h1>❌ Error en la autorización</h1>
      <p>${error}</p>
      <a href="/">Volver a intentar</a>
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
    console.log('\n📝 GUARDA ESTOS DATOS:\n');
    console.log('Access Token:');
    console.log(access_token);
    console.log('\nRefresh Token (para renovar):');
    console.log(refresh_token);
    console.log(`\n⏰ Expira en: ${expires_in} segundos (${expires_in / 3600} horas)`);
    console.log('\n' + '='.repeat(70) + '\n');

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
            background: #f5f5f5;
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
          }
          button:hover { background: #218838; }
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
              <li>Guarda el <strong>Access Token</strong> en <code>config/config.json</code></li>
              <li>Guarda el <strong>Refresh Token</strong> en un lugar seguro</li>
              <li>El token expira en <strong>${expires_in / 3600} horas</strong></li>
              <li>Usa el Refresh Token para renovarlo cuando expire</li>
            </ul>
          </div>

          <h3>📝 Próximos pasos:</h3>
          <ol>
            <li>Copia el Access Token</li>
            <li>Pégalo en <code>config/config.json</code> en el campo <code>accessToken</code></li>
            <li>Guarda el archivo</li>
            <li>¡Ya puedes usar el sistema!</li>
          </ol>

          <button onclick="window.close()" style="background: #007bff; margin-top: 20px;">
            ✓ Cerrar esta ventana
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

    // Guardar en un archivo temporal
    const fs = require('fs');
    fs.writeFileSync('tokens.txt', 
      `Access Token: ${access_token}\n\nRefresh Token: ${refresh_token}\n\nExpira en: ${expires_in} segundos`
    );
    console.log('💾 Tokens guardados en tokens.txt\n');

  } catch (error) {
    console.error('❌ Error al obtener el token:', error.response?.data || error.message);
    res.send(`
      <h1>❌ Error al obtener el token</h1>
      <pre>${JSON.stringify(error.response?.data || error.message, null, 2)}</pre>
    `);
  }
});

// Página de inicio
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Generador de Token - MercadoLibre</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 600px;
          margin: 50px auto;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .container {
          background: white;
          color: #333;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        h1 { color: #667eea; text-align: center; }
        .info {
          background: #e8f5e9;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        button {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 20px;
        }
        button:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4); }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🔐 Generador de Access Token</h1>
        <h2>MercadoLibre OAuth 2.0</h2>
        
        <div class="info">
          <strong>ℹ️ Instrucciones:</strong>
          <ol>
            <li>Haz clic en el botón de abajo</li>
            <li>Serás redirigido a MercadoLibre</li>
            <li>Inicia sesión con tu cuenta</li>
            <li>Autoriza la aplicación</li>
            <li>Recibirás tu Access Token</li>
          </ol>
        </div>

        <p><strong>Cliente ID:</strong> ${config.mercadolibre.clientId}</p>
        
        <button onclick="window.location.href='/auth'">
          🚀 Iniciar Autorización
        </button>
      </div>
    </body>
    </html>
  `);
});

// Iniciar servidor con HTTPS (requerido por MercadoLibre)
const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = selfsigned.generate(attrs, { days: 365 });

const httpsOptions = {
  key: pems.private,
  cert: pems.cert
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log('\n' + '='.repeat(70));
  console.log('🔐 GENERADOR DE ACCESS TOKEN - MERCADOLIBRE');
  console.log('='.repeat(70));
  console.log(`\n✅ Servidor OAuth iniciado en https://localhost:${PORT}`);
  console.log('\n📋 PASOS PARA OBTENER TU ACCESS TOKEN:\n');
  console.log('1. Abre tu navegador en: https://localhost:3000');
  console.log('2. ⚠️  Si aparece advertencia de seguridad, acepta (es normal en localhost)');
  console.log('3. Haz clic en "Iniciar Autorización"');
  console.log('4. Inicia sesión en MercadoLibre');
  console.log('5. Autoriza la aplicación');
  console.log('6. Copia el Access Token generado');
  console.log('7. Pégalo en config/config.json\n');
  console.log('='.repeat(70) + '\n');
});
