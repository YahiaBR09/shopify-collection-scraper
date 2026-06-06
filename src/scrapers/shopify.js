const axios = require('axios');
const Logger = require('../utils/logger');

/**
 * ShopifyScraper - Handles scraping of Shopify store products via JSON API
 */
class ShopifyScraper {
  constructor() {
    this.logger = new Logger();
    this.axiosInstance = axios.create({
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });
  }

  /**
   * Scrape a Shopify collection via JSON API
   * @param {Object} collection - Collection configuration
   * @returns {Promise<Array>} Array of products
   */
async scrapeCollection(collection) {
  try {
    if (!collection.enabled) {
      this.logger.info(`Skipping disabled collection: ${collection.name}`);
      return [];
    }

    let allProducts = [];
    let page = 1;

    while (true) {

      const separator = collection.url.includes('?') ? '&' : '?';

      const pageUrl =
       `https://animeislandstores.com/collections/${collection.url}/products.json?limit=250&page=${page}`;

      this.logger.info(`Fetching page ${page}: ${pageUrl}`);

      const response = await this.axiosInstance.get(pageUrl);

      if (
        !response.data.products ||
        response.data.products.length === 0
      ) {
        this.logger.info(
          `No more products found. Stopped at page ${page}.`
        );
        break;
      }

      const products = this.parseProducts(
        response.data,
        collection
      );

      allProducts.push(...products);

      this.logger.info(
        `Page ${page}: ${products.length} products`
      );

      page++;

      // حماية بسيطة من الحلقات اللانهائية
      if (page > 100) {
        this.logger.warn(
          'Safety stop: exceeded 100 pages'
        );
        break;
      }
    }

    this.logger.info(
      `Finished ${collection.name}: ${allProducts.length} total products`
    );

    return allProducts;

  } catch (error) {
    this.logger.error(
      `Error scraping ${collection.name}: ${error.message}`
    );
    return [];
  }
}

  /**
   * Parse products from Shopify JSON API response
   * @param {Object} data - JSON API response from /products.json endpoint
   * @param {Object} collection - Collection information
   * @returns {Array} Parsed products
   */
  parseProducts(data, collection) {
    const products = [];

    try {
      if (!data.products || !Array.isArray(data.products)) {
        this.logger.warn(`No products array found in response`);
        return products;
      }

      data.products.forEach((apiProduct) => {
        try {
          // Get price from first variant
          const variant = apiProduct.variants && apiProduct.variants[0];
          let price = 0;
          let compareAtPrice = 0;

          if (variant) {
            // Parse price - handle both string and number formats
            if (variant.price) {
              const parsedPrice = parseFloat(String(variant.price));
              price = isNaN(parsedPrice) ? 0 : parsedPrice;
            }
            
            // Parse compare_at_price if exists
            if (variant.compare_at_price) {
              const parsedCompare = parseFloat(String(variant.compare_at_price));
              compareAtPrice = isNaN(parsedCompare) ? 0 : parsedCompare;
            }
          }

          const available = variant ? variant.available : false;
          const quantity = available ? 50 : 0; // Default quantity

          // Get all images
          const images = [];
          if (apiProduct.images && Array.isArray(apiProduct.images)) {
            apiProduct.images.forEach(img => {
              if (img.src) {
                images.push(img.src);
              }
            });
          }

          // Clean HTML description
          const description = this.cleanHtml(apiProduct.body_html || '');

          const product = {
            id: apiProduct.id,
            title: apiProduct.title,
            handle: apiProduct.handle,
            price: price,
            compareAtPrice: compareAtPrice,
            quantity: quantity,
            available: available,
            vendor: apiProduct.vendor || '',
            images: images,
            description: description,
            url: `https://animeislandstores.com/products/${apiProduct.handle}`,
            collection: collection.name,
            scrapedAt: new Date().toISOString()
          };

          if (product.title) {
            products.push(product);
          }
        } catch (error) {
          this.logger.warn(`Error parsing product: ${error.message}`);
        }
      });

      return products;
    } catch (error) {
      this.logger.error(`Error parsing products array: ${error.message}`);
      return products;
    }
  }

  /**
   * Clean HTML tags from text
   * @param {String} html - HTML content
   * @returns {String} Cleaned text
   */
  cleanHtml(html) {
    if (!html) return '';
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#039;/g, "'")
      .replace(/\r\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 1000); // Limit to 1000 chars
  }
}

module.exports = ShopifyScraper;
