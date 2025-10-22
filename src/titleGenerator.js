// Módulo para generar títulos y descripciones para MercadoLibre

/**
 * Genera un título optimizado para MercadoLibre
 * @param {Object} product - Información del producto de Kinguin
 * @returns {string} - Título optimizado (máx 60 caracteres)
 */
function generateTitle(product) {
  // Limpiar el nombre del producto
  let title = product.name;
  
  // Agregar plataforma si no está en el nombre
  if (!title.toLowerCase().includes('pc') && product.platform === 'PC') {
    title = `${title} - PC`;
  }
  
  // Agregar región si es importante
  if (product.region && product.region !== 'GLOBAL') {
    title = `${title} [${product.region}]`;
  }
  
  // Limitar a 60 caracteres para MercadoLibre
  if (title.length > 60) {
    title = title.substring(0, 57) + '...';
  }
  
  console.log(`📝 Título generado: ${title}`);
  return title;
}

/**
 * Genera una descripción para MercadoLibre
 * @param {Object} product - Información del producto de Kinguin
 * @returns {string} - Descripción del producto
 */
function generateDescription(product) {
  const description = `
🎮 ${product.name}

${product.description}

📋 DETALLES DEL PRODUCTO:
• Plataforma: ${product.platform}
• Región: ${product.region}
• Género: ${product.genre}
${product.publisher ? `• Publisher: ${product.publisher}` : ''}
${product.developer ? `• Developer: ${product.developer}` : ''}

✅ ENTREGA INMEDIATA
✅ PRODUCTO DIGITAL
✅ CÓDIGO ORIGINAL

⚠️ IMPORTANTE:
- Este es un producto digital
- Se entrega mediante código de activación
- No se realizan reembolsos una vez entregado el código
- Verificar requisitos del sistema antes de comprar

📧 Cualquier consulta, no dudes en preguntar.
  `.trim();
  
  console.log(`📄 Descripción generada (${description.length} caracteres)`);
  return description;
}

/**
 * Genera categoría de MercadoLibre según el género
 * @param {string} genre - Género del juego
 * @returns {string} - ID de categoría de MercadoLibre
 */
function getMercadoLibreCategory(genre) {
  // Categorías básicas de MercadoLibre para videojuegos PC
  const categoryMap = {
    'action': 'MLC1144', // Videojuegos
    'adventure': 'MLC1144',
    'rpg': 'MLC1144',
    'strategy': 'MLC1144',
    'simulation': 'MLC1144',
    'sports': 'MLC1144',
    'racing': 'MLC1144',
    'default': 'MLC1144' // Categoría general de videojuegos
  };
  
  const genreLower = genre.toLowerCase();
  return categoryMap[genreLower] || categoryMap.default;
}

module.exports = {
  generateTitle,
  generateDescription,
  getMercadoLibreCategory
};
