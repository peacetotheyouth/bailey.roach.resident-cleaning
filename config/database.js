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
      if (error.code === 'ENOENT') {
        throw new Error(`Database configuration file not found at ${this.configPath}`);
      } else if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON in database configuration: ${error.message}`);
      }
      throw new Error(`Failed to load database configuration: ${error.message}`);
    }
  }

  /**
   * Replace environment variable placeholders in a string
   * @param {string} value - String that may contain ${VAR} placeholders
   * @param {string} env - Environment name for error context
   * @returns {string|number} Processed value with environment variables replaced
   */
  replaceEnvVars(value, env = 'unknown') {
    if (typeof value !== 'string') {
      return value;
    }

    const envVarRegex = /\$\{([^}]+)\}/g;
    let hasError = false;
    
    const result = value.replace(envVarRegex, (match, envVar) => {
      const envValue = process.env[envVar];
      if (envValue === undefined) {
        if (env === 'production') {
          console.error(`Required environment variable ${envVar} is not set for production`);
          hasError = true;
        } else {
          console.warn(`Environment variable ${envVar} is not set`);
        }
        return match;
      }
      return envValue;
    });
    
    if (hasError) {
      throw new Error(`Missing required environment variables for ${env} configuration`);
    }
    
    return result;
  }

  /**
   * Process configuration object recursively to replace env vars
   * @param {Object} obj - Configuration object
   * @param {string} env - Environment name for error context
   * @returns {Object} Processed configuration
   */
  processConfig(obj, env = 'unknown') {
    const processed = {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          processed[key] = this.processConfig(value, env);
        } else if (typeof value === 'string') {
          const replaced = this.replaceEnvVars(value, env);
          // Convert port to number if it's the port field
          if (key === 'port' && typeof replaced === 'string' && !isNaN(replaced)) {
            processed[key] = parseInt(replaced, 10);
          } else {
            processed[key] = replaced;
          }
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

    return this.processConfig(this.config[environment], environment);
  }

  /**
   * Get all configurations
   * @returns {Object} All environment configurations
   */
  getAllConfigs() {
    const processed = {};
    
    for (const env in this.config) {
      if (Object.prototype.hasOwnProperty.call(this.config, env)) {
        processed[env] = this.processConfig(this.config[env], env);
      }
    }
    
    return processed;
  }

  /**
   * Check for unresolved environment variables recursively
   * @param {*} value - Value to check
   * @returns {boolean} True if unresolved variables found
   */
  hasUnresolvedVars(value) {
    if (typeof value === 'string') {
      return value.includes('${');
    } else if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => this.hasUnresolvedVars(v));
    }
    return false;
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

    // Warn if password is missing in production
    if (environment === 'production' && !config.password) {
      console.warn('Warning: Password is not set for production database connection');
    }

    // Check for unresolved environment variables (recursively)
    if (environment === 'production') {
      if (this.hasUnresolvedVars(config)) {
        console.error('Production configuration contains unresolved environment variables');
        return false;
      }
    }

    return true;
  }
}

// Export singleton instance and functions
const dbConfig = new DatabaseConfig();

module.exports = {
  DatabaseConfig,
  getConfig: (env) => dbConfig.getConfig(env),
  getAllConfigs: () => dbConfig.getAllConfigs(),
  validate: (env) => dbConfig.validate(env)
};
