# Shopify Store Migrator - Professional Data Transfer Solution

Seamlessly migrate your entire Shopify product catalog to Middle Eastern e-commerce platforms like **Salla** and **Zid**. Our intelligent automation tool handles all the complexity, extracting thousands of products with perfect formatting, complete images, and accurate pricing—all ready for immediate import.

---

## 🎯 What You'll Get

### Complete Product Migration
- **All Products, No Limits:** Extract your entire catalog instantly, even with thousands of products
- **Crystal-Clean Data:** Automatic formatting, validation, and error correction
- **Ready-to-Import Files:** Professional Excel spreadsheets formatted exactly as Salla and Zid require
- **Perfect Image Organization:** All product images automatically organized and linked
- **Accurate Pricing:** Original prices, discounts, and promotional rates preserved

### How It Works

The tool follows a proven 4-step process:

```
Your Shopify Store → Extract All Products → Clean & Format Data → Generate Import Files
```

1. **Smart Product Collection:** Automatically retrieves all products from your store with intelligent pagination management
2. **Data Cleaning:** Fixes formatting issues, validates data, and removes errors automatically
3. **Image Organization:** Organizes all product images and creates proper connections
4. **Export Ready:** Generates professional Excel files ready to upload to Salla or Zid

---

## ✨ Key Benefits

✅ **Save Time:** Automated process handles hours of manual work in minutes  
✅ **Zero Data Loss:** Every product, variant, image, and price is preserved  
✅ **Professional Quality:** Output meets platform requirements with no manual corrections needed  
✅ **Inventory Protection:** Smart inventory handling prevents out-of-stock issues during import  
✅ **Multi-Format Support:** Export to Excel, JSON, or both  
✅ **Reliable & Fast:** Intelligent request management keeps your migration smooth and safe

---

## 📸 See It in Action

Visual preview of the migration process and final output for complete peace of mind.

---

## 🚀 Quick Start Guide

### What You Need
- Node.js installed on your computer
- Your Shopify store URL
- About 5 minutes to get started

### Step 1: Install
```bash
git clone <your-repository-url>
cd shopify-scraper
npm install
```

### Step 2: Configure Your Store
Open `src/config/collections.js` and add your store collections:

```javascript
module.exports = [
  { name: 'Your Collection Name', url: 'https://your-store.com/collections/collection-name' },
  // Add more collections as needed
];
```

### Step 3: Start Migration
```bash
npm start
```

For development mode with automatic reloading:
```bash
npm run dev
```

That's it! Your files will be ready in the `output/` folder.

---

## 📂 What Gets Generated

After running the migration, you'll receive:

- **products.xlsx** - Professional Excel file ready to import to Salla or Zid
- **products.json** - Complete data in JSON format for advanced users
- **Detailed logs** - Track what was migrated and any important notes

---

## 💡 Technical Details

- **Built with:** Node.js, professional data libraries, and modern automation
- **Handles:** Thousands of products with all variants and images
- **Speed:** Optimized for fast, reliable data transfer
- **Safety:** Intelligent request management to prevent issues

---

## 📄 License

This project is licensed under the MIT License.

---

**Ready to migrate? Start now and get your Shopify products on Salla or Zid in minutes!**
