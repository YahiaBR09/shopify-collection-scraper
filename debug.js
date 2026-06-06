const axios = require('axios');

/**
 * Debug tool to inspect raw API response
 */
async function debugAPI() {
  try {
    const url = 'https://animeislandstores.com/collections/d8-a7-d9-83-d8-b3-d8-b3-d9-88-d8-a7-d8-b1-d8-a7-d8-aa/products.json?limit=5';
    
    console.log('Fetching:', url);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (response.data.products && response.data.products.length > 0) {
      const firstProduct = response.data.products[0];
      console.log('\n📦 First Product:');
      console.log('Title:', firstProduct.title);
      console.log('ID:', firstProduct.id);
      
      if (firstProduct.variants && firstProduct.variants[0]) {
        const variant = firstProduct.variants[0];
        console.log('\n💰 First Variant Pricing:');
        console.log('Price:', variant.price);
        console.log('Compare at Price:', variant.compare_at_price);
        console.log('Variant Object Keys:', Object.keys(variant));
      }

      console.log('\n📸 Images:');
      if (firstProduct.images && firstProduct.images.length > 0) {
        firstProduct.images.forEach((img, i) => {
          console.log(`Image ${i + 1}:`, img.src);
        });
      }

      console.log('\n📝 Description (first 200 chars):', firstProduct.body_html?.substring(0, 200) || 'N/A');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugAPI();
