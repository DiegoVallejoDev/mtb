/* 
 * Copyright (c) 2021 Diego Valejo.
 * Component registration and retrieval for mtb.js
 */

const path = require('path');
const { ComponentNotFoundError } = require('./utils/ErrorHandler');
const PathValidator = require('./utils/PathValidator');

class ComponentRegistry {
    constructor(fileManager, logger) {
        this.components = {};
        this.fileManager = fileManager;
        this.logger = logger;
    }

    /**
     * Register a component from a file path
     * @param {string} componentPath - Path to the component file
     * @param {string} name - Optional component name
     * @returns {Promise<string>} The component name
     */
    async register(componentPath, name = undefined) {
        const component = await this.fileManager.readFile(componentPath);
        
        if (name === undefined) {
            name = path.basename(componentPath, path.extname(componentPath));
        }
        
        // Validate component name
        if (!PathValidator.isValidComponentName(name)) {
            throw new Error(`Invalid component name: ${name}`);
        }
        
        if (this.components[name] !== undefined) {
            this.logger.warning(`Component "${name}" already exists, overriding`);
        }
        
        this.components[name] = component;
        this.logger.debug(`Registered component: ${name}`);
        
        return name;
    }

    /**
     * Get a component's content
     * @param {string} name - Component name
     * @returns {string} Component content
     * @throws {ComponentNotFoundError} If component not found
     */
    get(name) {
        if (this.components[name] === undefined) {
            throw new ComponentNotFoundError(name);
        }
        return this.components[name];
    }

    /**
     * Check if a component exists
     * @param {string} name - Component name
     * @returns {boolean} True if component exists
     */
    has(name) {
        return this.components[name] !== undefined;
    }

    /**
     * Get all component names
     * @returns {string[]} Array of component names
     */
    getAll() {
        return Object.keys(this.components);
    }

    /**
     * Get the count of registered components
     * @returns {number} Number of components
     */
    count() {
        return Object.keys(this.components).length;
    }

    /**
     * Clear all registered components
     */
    clear() {
        this.components = {};
    }
}

module.exports = ComponentRegistry;
