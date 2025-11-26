/* 
 * Copyright (c) 2021 Diego Valejo.
 * Configuration management for mtb.js
 */

const fs = require('fs');
const path = require('path');

class Config {
    constructor(configPath = null) {
        this.defaults = {
            directories: {
                components: "src/components/",
                pages: "src/pages/",
                assets: "src/assets/",
                output: "public/"
            },
            watch: false,
            verbose: false
        };

        this.config = this.loadConfig(configPath);
    }

    loadConfig(configPath) {
        // Try different config file names
        const configFiles = configPath ? [configPath] : [
            'mtb.config.js',
            '.mtbrc.json',
            '.mtbrc'
        ];

        for (const file of configFiles) {
            try {
                const fullPath = path.resolve(process.cwd(), file);

                if (fs.existsSync(fullPath)) {
                    let userConfig;

                    if (file.endsWith('.json')) {
                        const content = fs.readFileSync(fullPath, 'utf8');
                        userConfig = JSON.parse(content);
                    } else {
                        // Clear require cache to allow reloading
                        delete require.cache[require.resolve(fullPath)];
                        userConfig = require(fullPath);
                    }

                    return this.mergeConfig(this.defaults, userConfig);
                }
            } catch (error) {
                console.warn(`Could not load config from ${file}:`, error.message);
            }
        }

        return this.defaults;
    }

    mergeConfig(defaults, userConfig) {
        return {
            ...defaults,
            ...userConfig,
            directories: {
                ...defaults.directories,
                ...(userConfig.directories || {})
            }
        };
    }

    get(key) {
        const keys = key.split('.');
        let value = this.config;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return undefined;
            }
        }

        return value;
    }

    set(key, value) {
        this.config[key] = value;
    }

    getAll() {
        return { ...this.config };
    }
}

module.exports = Config;
