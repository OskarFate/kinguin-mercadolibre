// Módulo para convertir EUR a CLP usando API pública
const axios = require('axios');
const config = require('../config/config.json');

/**
 * Obtiene la tasa de cambio actual de EUR a CLP
 * @returns {number} - Tasa de cambio EUR -> CLP
 */
async function getExchangeRate() {
  try {
    console.log('💱 Obteniendo tasa de cambio EUR -> CLP...');
    
    const response = await axios.get(config.currency.apiUrl);
    const rates = response.data.rates;
    
    const clpRate = rates.CLP;
    console.log(`✅ Tasa actual: 1 EUR = ${clpRate} CLP`);
    
    return clpRate;
    
  } catch (error) {
    console.error('❌ Error al obtener tasa de cambio:', error.message);
    // Tasa de respaldo aproximada
    const fallbackRate = 1050;
    console.log(`⚠️ Usando tasa de respaldo: ${fallbackRate} CLP`);
    return fallbackRate;
  }
}

/**
 * Convierte un precio de EUR a CLP
 * @param {number} eurPrice - Precio en EUR
 * @returns {number} - Precio en CLP
 */
async function convertEurToClp(eurPrice) {
  const rate = await getExchangeRate();
  const clpPrice = eurPrice * rate;
  
  console.log(`💵 Conversión: €${eurPrice} = $${Math.round(clpPrice)} CLP`);
  
  return Math.round(clpPrice);
}

/**
 * Aplica margen de ganancia al precio
 * @param {number} basePrice - Precio base
 * @param {number} markup - Margen de ganancia (1.2 = 20% más)
 * @returns {number} - Precio final
 */
function applyMarkup(basePrice, markup = config.priceMarkup) {
  const finalPrice = Math.round(basePrice * markup);
  console.log(`📈 Aplicando margen ${markup}: $${basePrice} -> $${finalPrice} CLP`);
  return finalPrice;
}

module.exports = {
  getExchangeRate,
  convertEurToClp,
  applyMarkup
};
