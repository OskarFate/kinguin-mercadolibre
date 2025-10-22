// Módulo principal - Orquesta todo el proceso
const kinguin = require('./kinguin');
const currency = require('./currency');
const titleGenerator = require('./titleGenerator');
const mercadolibre = require('./mercadolibre');
const fs = require('fs').promises;
const path = require('path');

/**
 * Guarda un producto en la base de datos JSON
 */
async function saveToDatabase(productData) {
  const dbPath = path.join(__dirname, '../data/db.json');
  const db = JSON.parse(await fs.readFile(dbPath, 'utf8'));
  
  // Agregar timestamp
  productData.createdAt = new Date().toISOString();
  
  // Verificar si ya existe y actualizar, si no, agregar
  const existingIndex = db.products.findIndex(p => p.kinguinId === productData.kinguinId);
  
  if (existingIndex >= 0) {
    db.products[existingIndex] = productData;
    console.log('📝 Producto actualizado en base de datos');
  } else {
    db.products.push(productData);
    console.log('📝 Producto guardado en base de datos');
  }
  
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

/**
 * Proceso completo: de Kinguin ID a publicación en MercadoLibre
 */
async function processProduct(kinguinId) {
  console.log('\n' + '='.repeat(60));
  console.log(`🎯 INICIANDO PROCESO PARA ID: ${kinguinId}`);
  console.log('='.repeat(60) + '\n');

  try {
    // PASO 1: Obtener info de Kinguin
    console.log('📦 PASO 1: Obteniendo información de Kinguin...');
    const product = await kinguin.getProductById(kinguinId);
    const cheapestPrice = await kinguin.getCheapestPrice(kinguinId);
    product.price = cheapestPrice; // Usar el precio más barato

    // PASO 2: Convertir precio a CLP
    console.log('\n💱 PASO 2: Convirtiendo precio EUR -> CLP...');
    const priceInClp = await currency.convertEurToClp(product.price);
    const finalPrice = currency.applyMarkup(priceInClp);

    // PASO 3: Generar título y descripción
    console.log('\n📝 PASO 3: Generando título y descripción...');
    const title = titleGenerator.generateTitle(product);
    const description = titleGenerator.generateDescription(product);
    const category = titleGenerator.getMercadoLibreCategory(product.genre);

    // PASO 4: Preparar datos para MercadoLibre
    const mlData = {
      title: title,
      description: description,
      price: finalPrice,
      category_id: category,
      platform: product.platform,
      pictures: product.coverImage ? [{ source: product.coverImage }] : []
    };

    // PASO 5: Publicar en MercadoLibre
    console.log('\n🚀 PASO 4: Publicando en MercadoLibre...');
    const mlResult = await mercadolibre.publishProduct(mlData);

    // PASO 6: Guardar en base de datos
    console.log('\n💾 PASO 5: Guardando en base de datos...');
    const productRecord = {
      kinguinId: product.id,
      name: product.name,
      priceEur: product.price,
      priceClp: finalPrice,
      mercadolibreId: mlResult.id,
      permalink: mlResult.permalink,
      status: mlResult.status
    };
    
    await saveToDatabase(productRecord);

    // RESULTADO FINAL
    console.log('\n' + '='.repeat(60));
    console.log('✅ PROCESO COMPLETADO EXITOSAMENTE');
    console.log('='.repeat(60));
    console.log(`📦 Producto: ${product.name}`);
    console.log(`💰 Precio: €${product.price} → $${finalPrice} CLP`);
    console.log(`🔗 Link ML: ${mlResult.permalink}`);
    console.log('='.repeat(60) + '\n');

    return {
      success: true,
      product: productRecord,
      mercadolibre: mlResult
    };

  } catch (error) {
    console.error('\n❌ ERROR EN EL PROCESO:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  processProduct,
  saveToDatabase
};
