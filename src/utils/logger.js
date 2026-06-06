/**
 * Logger - Simple logging utility with timestamp and level support
 */
class Logger {
  constructor(prefix = 'SCRAPER') {
    this.prefix = prefix;
    this.logLevels = {
      INFO: 'ℹ️ ',
      WARN: '⚠️ ',
      ERROR: '❌',
      SUCCESS: '✅'
    };
  }

  /**
   * Get current timestamp
   * @returns {String} Formatted timestamp
   */
  getTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Format log message
   * @param {String} level - Log level
   * @param {String} message - Log message
   * @returns {String} Formatted message
   */
  formatMessage(level, message) {
    const timestamp = this.getTimestamp();
    return `[${timestamp}] ${this.logLevels[level]} [${this.prefix}] ${message}`;
  }

  /**
   * Log info message
   * @param {String} message - Message to log
   */
  info(message) {
    console.log(this.formatMessage('INFO', message));
  }

  /**
   * Log warning message
   * @param {String} message - Message to log
   */
  warn(message) {
    console.warn(this.formatMessage('WARN', message));
  }

  /**
   * Log error message
   * @param {String} message - Message to log
   */
  error(message) {
    console.error(this.formatMessage('ERROR', message));
  }

  /**
   * Log success message
   * @param {String} message - Message to log
   */
  success(message) {
    console.log(this.formatMessage('SUCCESS', message));
  }

  /**
   * Log with custom level
   * @param {String} level - Custom log level
   * @param {String} message - Message to log
   */
  log(level, message) {
    console.log(`[${this.getTimestamp()}] [${level}] [${this.prefix}] ${message}`);
  }
}

module.exports = Logger;
