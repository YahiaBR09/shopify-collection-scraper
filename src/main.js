const ShopifyScraper = require('./scrapers/shopify');
const Exporter = require('./services/exporter');
const Cleaner = require('./services/cleaner');
const Logger = require('./utils/logger');
const collections = require('./config/collections');

const logger = new Logger();

/**
 * Main application entry point
 */
async function main() {
  try {
    logger.info('Starting Shopify Scraper...');

    // Initialize scraper
    const scraper = new ShopifyScraper();

    // Scrape products from all configured collections
    let allProducts = [];
    
    for (const collection of collections) {
      logger.info(`Scraping collection: ${collection.name}`);
      const products = await scraper.scrapeCollection(collection);
      allProducts = allProducts.concat(products);
    }

    logger.info(`Total products scraped: ${allProducts.length}`);

    // Clean the data
    logger.info('Cleaning data...');
    const cleaner = new Cleaner();
    const cleanedProducts = cleaner.cleanProducts(allProducts);

    // Export data
    logger.info('Exporting data...');
    const exporter = new Exporter();
    await exporter.exportToJSON(cleanedProducts, './output/products.json');
    await exporter.exportToExcel(cleanedProducts, './output/products.xlsx');

    logger.info('✅ Scraping completed successfully!');
  } catch (error) {
    logger.error(`Fatal error: ${error.message}`);
    process.exit(1);
  }
}

// Run the application
main();
