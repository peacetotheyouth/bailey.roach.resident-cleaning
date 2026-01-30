const fs = require('fs');
const path = require('path');

/**
 * Database Configuration Loader
 * 
 * This module loads database configuration from database.json
 * and replaces environment variable placeholders with actual values.
 */

class DatabaseConfig {
  constructor() {
    this.configPath = path.join(__dirname, 'database.json');
    this.config = this.loadConfig();
  }

  /**
   * Load configuration from database.json
   * @returns {Object} Database configuration object
   */
  loadConfig() {
    try {
      const configFile = fs.readFileSync(this.configPath, 'utf8');
      return JSON.parse(configFile);
    } catch (error) {
      console.error('Error loading database configuration:', error.message);
      throw new Error('Failed to load database configuration');
    }
  }

  /**
   * Replace environment variable placeholders in a string
   * @param {string} value - String that may contain ${VAR} placeholders
   * @returns {string|number} Processed value with environment variables replaced
   */
  replaceEnvVars(value) {
    if (typeof value !== 'string') {
      return value;
    }

    const envVarRegex = /\$\{([^}]+)\}/g;
    return value.replace(envVarRegex, (match, envVar) => {
      const envValue = process.env[envVar];
      if (envValue === undefined) {
        console.warn(`Environment variable ${envVar} is not set`);
        return match;
      }
      return envValue;
    });
  }

  /**
   * Process configuration object recursively to replace env vars
   * @param {Object} obj - Configuration object
   * @returns {Object} Processed configuration
   */
  processConfig(obj) {
    const processed = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          processed[key] = this.processConfig(value);
        } else if (typeof value === 'string') {
          processed[key] = this.replaceEnvVars(value);
        } else {
          processed[key] = value;
        }
      }
    }
    
    return processed;
  }

  /**
   * Get configuration for specific environment
   * @param {string} env - Environment name (development, test, production)
   * @returns {Object} Environment-specific database configuration
   */
  getConfig(env = null) {
    const environment = env || process.env.NODE_ENV || 'development';
    
    if (!this.config[environment]) {
      throw new Error(`Configuration for environment '${environment}' not found`);
    }

    return this.processConfig(this.config[environment]);
  }

  /**
   * Get all configurations
   * @returns {Object} All environment configurations
   */
  getAllConfigs() {
    const processed = {};
    
    for (const env in this.config) {
      if (this.config.hasOwnProperty(env)) {
        processed[env] = this.processConfig(this.config[env]);
      }
    }
    
    return processed;
  }

  /**
   * Validate database configuration
   * @param {string} env - Environment to validate
   * @returns {boolean} True if configuration is valid
   */
  validate(env = null) {
    const environment = env || process.env.NODE_ENV || 'development';
    const config = this.getConfig(environment);

    const requiredFields = ['host', 'port', 'database', 'username', 'dialect'];
    const missingFields = requiredFields.filter(field => !config[field]);

    if (missingFields.length > 0) {
      console.error(`Missing required fields: ${missingFields.join(', ')}`);
      return false;
    }

    // Check for unresolved environment variables in production
    if (environment === 'production') {
      const hasUnresolvedVars = Object.values(config).some(value => {
        if (typeof value === 'string') {
          return value.includes('${');
        }
        return false;
      });

      if (hasUnresolvedVars) {
        console.error('Production configuration contains unresolved environment variables');
        return false;
      }
    }

    return true;
  }
}

// Export singleton instance
const dbConfig = new DatabaseConfig();

module.exports = dbConfig.getConfig();
module.exports.DatabaseConfig = DatabaseConfig;
module.exports.getConfig = (env) => dbConfig.getConfig(env);
module.exports.getAllConfigs = () => dbConfig.getAllConfigs();
module.exports.validate = (env) => dbConfig.validate(env);
