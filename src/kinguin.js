// Módulo para interactuar con la API de Kinguin
const axios = require('axios');
const config = require('../config/config.json');

/**
 * Obtiene información de un producto de Kinguin por su ID
 * @param {string} productId - ID del producto en Kinguin
 * @returns {Object} - Información del producto
 */
async function getProductById(productId) {
  try {
    console.log(`📦 Buscando producto con ID: ${productId} en Kinguin...`);
    
    const response = await axios.get(`${config.kinguin.apiUrl}/products/${productId}`, {
      headers: {
        'X-Api-Key': config.kinguin.apiKey,
        'Content-Type': 'application/json'
      }
    });

    const product = response.data;
    
    console.log(`✅ Producto encontrado: ${product.name}`);
    
    return {
      id: product.kinguinId || productId,
      name: product.name,
      description: product.description || 'Sin descripción disponible',
      price: product.price?.value || 0,
      currency: product.price?.currency || 'EUR',
      platform: product.platform || 'PC',
      region: product.regionId || 'GLOBAL',
      genre: product.genres?.[0] || 'Game',
      coverImage: product.coverImage || product.screenshots?.[0] || '',
      publisher: product.publisher || '',
      developer: product.developers?.[0] || ''
    };
    
  } catch (error) {
    console.error('❌ Error al obtener producto de Kinguin:', error.message);
    if (error.response) {
      console.error('Detalles:', error.response.data);
    }
    throw new Error(`No se pudo obtener el producto con ID: ${productId}`);
  }
}

/**
 * Busca el precio más barato de un producto en Kinguin
 * @param {string} productId - ID del producto
 * @returns {number} - Precio más barato en EUR
 */
async function getCheapestPrice(productId) {
  try {
    const response = await axios.get(`${config.kinguin.apiUrl}/products/${productId}/offers`, {
      headers: {
        'X-Api-Key': config.kinguin.apiKey
      }
    });

    const offers = response.data.offers || [];
    if (offers.length === 0) {
      throw new Error('No hay ofertas disponibles para este producto');
    }

    // Ordenar por precio y tomar el más barato
    const cheapest = offers.sort((a, b) => a.price.value - b.price.value)[0];
    console.log(`💰 Precio más barato encontrado: €${cheapest.price.value}`);
    
    return cheapest.price.value;
    
  } catch (error) {
    console.error('❌ Error al obtener precios:', error.message);
    // Si falla, retornar el precio del producto base
    const product = await getProductById(productId);
    return product.price;
  }
}

module.exports = {
  getProductById,
  getCheapestPrice
};
