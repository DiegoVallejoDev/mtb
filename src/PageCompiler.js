/* 
 * Copyright (c) 2021 Diego Valejo.
 * Page compilation logic for mtb.js
 */

const path = require('path');
const { PageNotFoundError, CompilationError } = require('./utils/ErrorHandler');

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
     * Compile a page by replacing component placeholders
     * @param {string} pageName - Name of the page (without extension)
     * @returns {string} Compiled page content
     * @throws {PageNotFoundError} If page not found
     * @throws {CompilationError} If compilation fails
     */
    compile(pageName) {
        if (pageName === undefined || this.pages[pageName] === undefined) {
            throw new PageNotFoundError(pageName);
        }
        
        let pageContent = this.pages[pageName];
        const errors = [];

        // Components are imported as {{componentName}} into html pages
        const componentPattern = /{{[a-zA-Z0-9_-]+}}/g;
        const components = pageContent.match(componentPattern);
        
        if (components !== null) {
            for (let componentTag of components) {
                const componentName = componentTag.slice(2, -2).trim();
                
                try {
                    const componentContent = this.componentRegistry.get(componentName);
                    // Replace all occurrences of this component tag
                    pageContent = pageContent.split(componentTag).join(componentContent);
                    this.logger.debug(`Compiled component "${componentName}" in page "${pageName}"`);
                } catch (error) {
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
