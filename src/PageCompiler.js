/* 
 * Copyright (c) 2021 Diego Valejo.
 * Page compilation logic for mtb.js
 */

const path = require('path');
const { PageNotFoundError, CompilationError } = require('./utils/ErrorHandler');
const PropsParser = require('./utils/PropsParser');

class PageCompiler {
    constructor(componentRegistry, fileManager, logger) {
        this.componentRegistry = componentRegistry;
        this.fileManager = fileManager;
        this.logger = logger;
        this.pages = {};
    }

    /**
     * Load a page from file
     * @param {string} pageName - Name of the page file
     * @param {string} pagesDir - Pages directory path
     * @returns {Promise<void>}
     */
    async loadPage(pageName, pagesDir) {
        const pagePath = path.join(pagesDir, pageName);
        const content = await this.fileManager.readFile(pagePath);
        const nameWithoutExt = path.basename(pageName, path.extname(pageName));
        this.pages[nameWithoutExt] = content;
        this.logger.debug(`Loaded page: ${nameWithoutExt}`);
    }

    /**
     * Load all pages from a directory
     * @param {string} pagesDir - Pages directory path
     * @returns {Promise<void>}
     */
    async loadAllPages(pagesDir) {
        const pageFiles = await this.fileManager.readDirectory(pagesDir);
        
        // Load all pages in parallel
        await Promise.all(
            pageFiles
                .filter(file => file.endsWith('.html'))
                .map(file => this.loadPage(file, pagesDir))
        );
        
        this.logger.debug(`Loaded ${this.getPageCount()} pages`);
    }

    /**
     * Compile a page by replacing component placeholders (supports nested components)
     * @param {string} pageName - Name of the page (without extension)
     * @param {number} depth - Current recursion depth
     * @param {Set} visited - Set of visited components to detect circular dependencies
     * @returns {string} Compiled page content
     * @throws {PageNotFoundError} If page not found
     * @throws {CompilationError} If compilation fails
     */
    compile(pageName, depth = 0, visited = new Set()) {
        const MAX_DEPTH = 10; // Maximum nesting depth
        
        // Input validation with strict equality
        if (pageName === undefined || pageName === null) {
            throw new PageNotFoundError(pageName);
        }
        
        if (this.pages[pageName] === undefined) {
            throw new PageNotFoundError(pageName);
        }
        
        // Check maximum depth to prevent infinite recursion
        if (depth > MAX_DEPTH) {
            throw new CompilationError(pageName, [
                `Maximum nesting depth (${MAX_DEPTH}) exceeded`
            ]);
        }
        
        // Check for circular dependencies
        if (visited.has(pageName)) {
            const cycle = Array.from(visited).join(' -> ') + ' -> ' + pageName;
            throw new CompilationError(pageName, [
                `Circular dependency detected: ${cycle}`
            ]);
        }
        
        // Add current page to visited set
        const newVisited = new Set(visited);
        newVisited.add(pageName);
        
        let pageContent = this.pages[pageName];
        const errors = [];

        // Enhanced pattern to match components with or without props
        // Matches: {{componentName}} or {{componentName prop="value"}}
        const componentPattern = /{{[a-zA-Z0-9_-]+(?:\s+[^}]+)?}}/g;
        const components = pageContent.match(componentPattern);
        
        if (components !== null) {
            // Get unique component tags
            const uniqueComponents = [...new Set(components)];
            
            for (let componentTag of uniqueComponents) {
                try {
                    // Parse component name and props
                    const { componentName, props } = PropsParser.parse(componentTag);
                    
                    let componentContent = this.componentRegistry.get(componentName);
                    
                    // Interpolate props if present
                    if (Object.keys(props).length > 0) {
                        componentContent = PropsParser.interpolate(componentContent, props);
                    }
                    
                    // Check if component contains nested components
                    const hasNestedComponents = /{{[a-zA-Z0-9_-]+(?:\s+[^}]+)?}}/g.test(componentContent);
                    
                    if (hasNestedComponents) {
                        // Recursively compile nested components
                        componentContent = this.compileContent(
                            componentContent, 
                            componentName, 
                            depth + 1, 
                            newVisited
                        );
                    }
                    
                    // Replace all occurrences of this component tag
                    pageContent = pageContent.split(componentTag).join(componentContent);
                    this.logger.debug(`Compiled component "${componentName}" in page "${pageName}" (depth: ${depth})`);
                } catch (error) {
                    if (error instanceof CompilationError) {
                        // Propagate compilation errors (e.g., circular dependencies)
                        throw error;
                    }
                    const { componentName } = PropsParser.parse(componentTag);
                    errors.push(`Component "${componentName}" not found`);
                }
            }
        }
        
        if (errors.length > 0) {
            throw new CompilationError(pageName, errors);
        }
        
        return pageContent;
    }

    /**
     * Compile content with nested components (helper for recursive compilation)
     * @param {string} content - Content to compile
     * @param {string} contextName - Name of the context (for error messages)
     * @param {number} depth - Current recursion depth
     * @param {Set} visited - Set of visited components
     * @returns {string} Compiled content
     * @private
     */
    compileContent(content, contextName, depth, visited) {
        const MAX_DEPTH = 10;
        
        if (depth > MAX_DEPTH) {
            throw new CompilationError(contextName, [
                `Maximum nesting depth (${MAX_DEPTH}) exceeded`
            ]);
        }
        
        const componentPattern = /{{[a-zA-Z0-9_-]+(?:\s+[^}]+)?}}/g;
        const components = content.match(componentPattern);
        const errors = [];
        
        if (components !== null) {
            const uniqueComponents = [...new Set(components)];
            
            for (let componentTag of uniqueComponents) {
                try {
                    // Parse component name and props
                    const { componentName, props } = PropsParser.parse(componentTag);
                    
                    // Check for circular dependencies
                    if (visited.has(componentName)) {
                        const cycle = Array.from(visited).join(' -> ') + ' -> ' + componentName;
                        throw new CompilationError(contextName, [
                            `Circular dependency detected: ${cycle}`
                        ]);
                    }
                    
                    let componentContent = this.componentRegistry.get(componentName);
                    
                    // Interpolate props if present
                    if (Object.keys(props).length > 0) {
                        componentContent = PropsParser.interpolate(componentContent, props);
                    }
                    
                    // Check if component contains nested components
                    const hasNestedComponents = /{{[a-zA-Z0-9_-]+(?:\s+[^}]+)?}}/g.test(componentContent);
                    
                    if (hasNestedComponents) {
                        const newVisited = new Set(visited);
                        newVisited.add(componentName);
                        
                        componentContent = this.compileContent(
                            componentContent,
                            componentName,
                            depth + 1,
                            newVisited
                        );
                    }
                    
                    content = content.split(componentTag).join(componentContent);
                    this.logger.debug(`Compiled nested component "${componentName}" in "${contextName}" (depth: ${depth})`);
                } catch (error) {
                    if (error instanceof CompilationError) {
                        throw error;
                    }
                    const { componentName } = PropsParser.parse(componentTag);
                    errors.push(`Component "${componentName}" not found`);
                }
            }
        }
        
        if (errors.length > 0) {
            throw new CompilationError(contextName, errors);
        }
        
        return content;
    }

    /**
     * Compile and write a page to the output directory
     * @param {string} pageName - Name of the page (without extension)
     * @param {string} outputDir - Output directory path
     * @returns {Promise<void>}
     */
    async compilePage(pageName, outputDir) {
        const compiledContent = this.compile(pageName);
        const outputPath = path.join(outputDir, `${pageName}.html`);
        await this.fileManager.writeFile(outputPath, compiledContent);
        this.logger.debug(`Wrote compiled page: ${pageName}.html`);
    }

    /**
     * Compile and write all pages to the output directory
     * @param {string} outputDir - Output directory path
     * @returns {Promise<void>}
     */
    async compileAllPages(outputDir) {
        const pageNames = Object.keys(this.pages);
        
        // Compile all pages in parallel
        await Promise.all(
            pageNames.map(pageName => this.compilePage(pageName, outputDir))
        );
        
        this.logger.debug(`Compiled ${pageNames.length} pages`);
    }

    /**
     * Get the count of loaded pages
     * @returns {number} Number of pages
     */
    getPageCount() {
        return Object.keys(this.pages).length;
    }

    /**
     * Get all page names
     * @returns {string[]} Array of page names
     */
    getAllPageNames() {
        return Object.keys(this.pages);
    }

    /**
     * Clear all loaded pages
     */
    clear() {
        this.pages = {};
    }
}

module.exports = PageCompiler;
