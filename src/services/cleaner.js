const Logger = require('../utils/logger');

/**
 * Cleaner - Handles data validation and cleaning
 */
class Cleaner {
  constructor() {
    this.logger = new Logger();
  }

  /**
   * Clean and validate product data
   * @param {Array} products - Raw products from scraper
   * @returns {Array} Cleaned products
   */
  cleanProducts(products) {
    this.logger.info(`Cleaning ${products.length} products...`);

    return products
      .map(product => this.sanitizeProduct(product))
      .filter(product => this.isValidProduct(product));
  }

  /**
   * Sanitize individual product
   * @param {Object} product - Product to sanitize
   * @returns {Object} Sanitized product
   */
  sanitizeProduct(product) {
    return {
      id: this.sanitizeId(product.id),
      title: this.sanitizeString(product.title),
      price: this.sanitizePrice(product.price),
      compareAtPrice: product.compareAtPrice ? this.sanitizePrice(product.compareAtPrice) : 0,
      quantity: this.sanitizeQuantity(product.quantity),
      images: this.sanitizeImages(product.images),
      description: this.sanitizeString(product.description),
      vendor: this.sanitizeString(product.vendor),
      url: this.sanitizeUrl(product.url),
      collection: this.sanitizeString(product.collection),
      available: Boolean(product.available),
      handle: this.sanitizeString(product.handle),
      scrapedAt: product.scrapedAt || new Date().toISOString()
    };
  }

  /**
   * Sanitize string values
   * @param {String} value - Value to sanitize
   * @returns {String} Sanitized string
   */
  sanitizeString(value) {
    if (typeof value !== 'string') return '';
    return value
      .trim()
      .replace(/\s+/g, ' ')
      .substring(0, 500);
  }

  /**
   * Sanitize price values
   * @param {String|Number} value - Price value
   * @returns {Number} Sanitized price
   */
  sanitizePrice(value) {
    if (value === null || value === undefined) return 0;
    
    // If already a number, return as is
    if (typeof value === 'number') {
      return isNaN(value) ? 0 : value;
    }

    // If string, parse it
    if (typeof value === 'string') {
      const price = value
        .replace(/[^\d.]/g, '')
        .trim();
      
      const parsed = parseFloat(price);
      return isNaN(parsed) ? 0 : parsed;
    }

    return 0;
  }

  /**
   * Sanitize URL values
   * @param {String} value - URL value
   * @returns {String} Sanitized URL
   */
  sanitizeUrl(value) {
    if (typeof value !== 'string') return '';
    
    const url = value.trim();
    
    // Check if URL is valid
    try {
      new URL(url);
      return url;
    } catch {
      return '';
    }
  }

  /**
   * Sanitize ID
   * @param {Any} value - ID value
   * @returns {String} Sanitized ID
   */
  sanitizeId(value) {
    return String(value).trim().substring(0, 50);
  }

  /**
   * Sanitize quantity
   * @param {Number} value - Quantity value
   * @returns {Number} Sanitized quantity
   */
  sanitizeQuantity(value) {
    const qty = parseInt(value);
    return isNaN(qty) || qty < 0 ? 0 : qty;
  }

  /**
   * Sanitize images array
   * @param {Array} images - Images array
   * @returns {Array} Sanitized images
   */
  sanitizeImages(images) {
    if (!Array.isArray(images)) return [];
    
    return images
      .filter(img => typeof img === 'string' && img.length > 0)
      .map(img => this.sanitizeUrl(img))
      .filter(img => img.length > 0)
      .slice(0, 10); // Limit to 10 images
  }

  /**
   * Validate if product has required fields
   * @param {Object} product - Product to validate
   * @returns {Boolean} True if valid
   */
  isValidProduct(product) {
    const hasTitle = product.title && product.title.length > 0;
    const hasCollection = product.collection && product.collection.length > 0;
    // Price must exist (can be 0)
    const hasValidPrice = typeof product.price === 'number';

    return hasTitle && hasCollection && hasValidPrice;
  }

  /**
   * Remove duplicates from products
   * @param {Array} products - Products array
   * @returns {Array} Unique products
   */
  removeDuplicates(products) {
    const seen = new Set();
    return products.filter(product => {
      const key = `${product.title}-${product.price}-${product.collection}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}

module.exports = Cleaner;
