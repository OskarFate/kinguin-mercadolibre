# 🚀 INICIO RÁPIDO

## ✅ Paso 1: Credenciales (YA CONFIGURADAS)

Tus credenciales ya están en `config/config.json`:
- ✅ **Kinguin API Key:** Configurada
- ✅ **MercadoLibre App ID:** Configurada  
- ✅ **MercadoLibre Secret:** Configurada
- ⚠️ **Access Token:** Pendiente (ver abajo)

### 🔐 Obtener Access Token de MercadoLibre

Ejecuta:
```bash
node get-token.js
```
O doble clic en `get-token.bat`, luego:
1. Abre http://localhost:3000 en tu navegador
2. Haz clic en "Iniciar Autorización"
3. Inicia sesión en MercadoLibre
4. Copia el Access Token generado
5. Pégalo en `config/config.json` campo `accessToken`

## Paso 2: Instalar Dependencias

**Opción A:** Doble clic en `install.bat`

**Opción B:** Abrir PowerShell como Administrador y ejecutar:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Luego en la terminal normal:
```
npm install
```

## Paso 3: Iniciar Servidor

**Opción A:** Doble clic en `start.bat`

**Opción B:** En la terminal:
```
npm start
```

## Paso 4: Usar el Panel

Abre tu navegador en: **http://localhost:3000**

Ingresa un ID de Kinguin y ¡listo! 🎉

---

## 📌 Ejemplo de ID de Kinguin

Los IDs de productos en Kinguin son alfanuméricos, por ejemplo:
- `5d9e8f8e-3f6a-4e7c-8b9d-1a2b3c4d5e6f`
- O busca en la URL del producto en kinguin.net

---

## ⚠️ Solución de Problemas

**Si npm no funciona:**
1. Asegúrate de tener Node.js instalado (https://nodejs.org/)
2. Reinicia VS Code
3. Usa el archivo `install.bat`

**Si el servidor no inicia:**
- Verifica que el puerto 3000 esté libre
- Revisa que las dependencias estén instaladas

---

**¿Dudas?** Revisa el README.md completo 📖
