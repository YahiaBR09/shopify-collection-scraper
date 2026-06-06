const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const Logger = require('../utils/logger');

/**
 * Exporter - Handles exporting product data to various formats
 * Supports salla.sa platform format for Excel export
 */
class Exporter {
  constructor() {
    this.logger = new Logger();
  }

  /**
   * Export products to JSON file
   * @param {Array} products - Products to export
   * @param {String} filePath - Output file path
   * @returns {Promise<void>}
   */
  async exportToJSON(products, filePath) {
    try {
      // Create output directory if it doesn't exist
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const data = {
        metadata: {
          totalProducts: products.length,
          exportedAt: new Date().toISOString()
        },
        products: products
      };

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      this.logger.info(`✓ JSON exported to ${filePath}`);
    } catch (error) {
      this.logger.error(`Failed to export JSON: ${error.message}`);
      throw error;
    }
  }

  /**
   * Export products to Excel file in Salla.sa format
   * @param {Array} products - Products to export
   * @param {String} filePath - Output file path
   * @returns {Promise<void>}
   */
  async exportToExcel(products, filePath) {
    try {
      // Create output directory if it doesn't exist
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Transform products to Salla format
      const sallaProducts = products.map(product => ({
        'اسم المنتج': product.title || '',
        'الوصف': product.description || '',
        'السعر': product.price > 0 ? product.price : '',
        'السعر قبل الخصم': product.compareAtPrice > 0 ? product.compareAtPrice : '',
        'الكمية': product.quantity || 0,
        'الصور': product.images && product.images.length > 0 ? product.images.join(',') : '',
        'التصنيف': product.collection || '',
        'الحالة': product.available ? 'متاح' : 'غير متاح',
        'الرابط': product.url || '',
        'رقم المنتج': product.id || ''
      }));

      // Create worksheet from products
      const worksheet = XLSX.utils.json_to_sheet(sallaProducts);
      
      // Set column widths for better readability
      const colWidths = [
        { wch: 30 },  // اسم المنتج
        { wch: 50 },  // الوصف
        { wch: 12 },  // السعر
        { wch: 15 },  // السعر قبل الخصم
        { wch: 10 },  // الكمية
        { wch: 60 },  // الصور
        { wch: 15 },  // التصنيف
        { wch: 12 },  // الحالة
        { wch: 50 },  // الرابط
        { wch: 15 }   // رقم المنتج
      ];
      worksheet['!cols'] = colWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'منتجات');

      // Write file
      XLSX.writeFile(workbook, filePath);
      this.logger.info(`✓ Excel (Salla Format) exported to ${filePath}`);
    } catch (error) {
      this.logger.error(`Failed to export Excel: ${error.message}`);
      throw error;
    }
  }

  /**
   * Export products to CSV format
   * @param {Array} products - Products to export
   * @param {String} filePath - Output file path
   * @returns {Promise<void>}
   */
  async exportToCSV(products, filePath) {
    try {
      if (products.length === 0) {
        this.logger.warn('No products to export');
        return;
      }

      // Create output directory if it doesn't exist
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Create CSV header
      const headers = [
        'اسم المنتج',
        'الوصف',
        'السعر',
        'السعر قبل الخصم',
        'الكمية',
        'الصور',
        'التصنيف',
        'الحالة',
        'الرابط',
        'رقم المنتج'
      ];

      const rows = products.map(product => [
        product.title || '',
        product.description || '',
        product.price > 0 ? product.price : '',
        product.compareAtPrice > 0 ? product.compareAtPrice : '',
        product.quantity || 0,
        product.images && product.images.length > 0 ? product.images.join(',') : '',
        product.collection || '',
        product.available ? 'متاح' : 'غير متاح',
        product.url || '',
        product.id || ''
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row =>
          row.map(value => {
            // Handle commas and quotes in values
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      fs.writeFileSync(filePath, csv, 'utf-8');
      this.logger.info(`✓ CSV exported to ${filePath}`);
    } catch (error) {
      this.logger.error(`Failed to export CSV: ${error.message}`);
      throw error;
    }
  }
}

module.exports = Exporter;
