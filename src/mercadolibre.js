// Módulo para publicar productos en MercadoLibre
const axios = require('axios');

// Cargar config desde variables de entorno o archivo
let config;
try {
  config = require('../config/config.json');
} catch (error) {
  config = {
    mercadolibre: {
      clientId: process.env.ML_CLIENT_ID,
      clientSecret: process.env.ML_CLIENT_SECRET,
      accessToken: process.env.ML_ACCESS_TOKEN,
      redirectUri: process.env.ML_REDIRECT_URI
    }
  };
}

/**
 * Publica un producto en MercadoLibre
 * @param {Object} productData - Datos del producto a publicar
 * @returns {Object} - Respuesta de MercadoLibre con el ID de publicación
 */
async function publishProduct(productData) {
  try {
    console.log(`🚀 Publicando en MercadoLibre: ${productData.title}`);
    
    const listing = {
      title: productData.title,
      category_id: productData.category_id,
      price: productData.price,
      currency_id: 'CLP',
      available_quantity: 999, // Producto digital, stock ilimitado
      buying_mode: 'buy_it_now',
      condition: 'new',
      listing_type_id: 'gold_special', // Puedes cambiar según tu cuenta
      description: {
        plain_text: productData.description
      },
      pictures: productData.pictures || [],
      attributes: [
        {
          id: 'ITEM_CONDITION',
          value_name: 'Nuevo'
        },
        {
          id: 'PLATFORM',
          value_name: productData.platform || 'PC'
        }
      ],
      shipping: {
        mode: 'not_specified', // Producto digital, no hay envío físico
        local_pick_up: false,
        free_shipping: false
      }
    };

    const response = await axios.post(
      'https://api.mercadolibre.com/items',
      listing,
      {
        headers: {
          'Authorization': `Bearer ${config.mercadolibre.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`✅ Producto publicado exitosamente!`);
    console.log(`🔗 ID de publicación: ${response.data.id}`);
    console.log(`🔗 Permalink: ${response.data.permalink}`);

    return {
      success: true,
      id: response.data.id,
      permalink: response.data.permalink,
      status: response.data.status
    };

  } catch (error) {
    console.error('❌ Error al publicar en MercadoLibre:', error.message);
    
    if (error.response) {
      console.error('Detalles del error:', JSON.stringify(error.response.data, null, 2));
    }

    return {
      success: false,
      error: error.message,
      details: error.response?.data
    };
  }
}

/**
 * Actualiza el precio de una publicación existente
 * @param {string} itemId - ID de la publicación en MercadoLibre
 * @param {number} newPrice - Nuevo precio
 */
async function updatePrice(itemId, newPrice) {
  try {
    console.log(`💰 Actualizando precio de ${itemId} a $${newPrice}`);
    
    await axios.put(
      `https://api.mercadolibre.com/items/${itemId}`,
      { price: newPrice },
      {
        headers: {
          'Authorization': `Bearer ${config.mercadolibre.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Precio actualizado exitosamente');
    return { success: true };

  } catch (error) {
    console.error('❌ Error al actualizar precio:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Pausa o activa una publicación
 * @param {string} itemId - ID de la publicación
 * @param {string} status - 'paused' o 'active'
 */
async function updateStatus(itemId, status) {
  try {
    console.log(`🔄 Cambiando estado de ${itemId} a ${status}`);
    
    await axios.put(
      `https://api.mercadolibre.com/items/${itemId}`,
      { status: status },
      {
        headers: {
          'Authorization': `Bearer ${config.mercadolibre.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Estado actualizado exitosamente');
    return { success: true };

  } catch (error) {
    console.error('❌ Error al actualizar estado:', error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  publishProduct,
  updatePrice,
  updateStatus
};
