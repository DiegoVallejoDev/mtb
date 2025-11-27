/* 
 * Copyright (c) 2021 Diego Valejo.
 * mtb.js (all terrain js) is a tool that facilitates creating and managing complex static html pages by defining components,
 * it was developed to be used in pair of alpine.js in mind but can be used in other projects.
 */

const path = require('path');
const fs = require('fs').promises;
const Config = require('./src/Config');
const ComponentRegistry = require('./src/ComponentRegistry');
const PageCompiler = require('./src/PageCompiler');
const FileManager = require('./src/FileManager');
const Logger = require('./src/utils/Logger');
const { MtbError } = require('./src/utils/ErrorHandler');

/**
 * Recursively find all HTML component files in a directory
 * @param {string} dir - Directory to scan
 * @param {string} baseDir - Base directory for calculating relative paths
 * @returns {Promise<Array<{filePath: string, componentName: string}>>} Array of file info
 */
async function findComponentFiles(dir, baseDir = dir) {
    const files = [];
    
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory()) {
                // Recursively scan subdirectories
                const subFiles = await findComponentFiles(fullPath, baseDir);
                files.push(...subFiles);
            } else if (entry.isFile() && entry.name.endsWith('.html')) {
                // Calculate relative path from base directory and normalize to forward slashes
                const relativePath = path.relative(baseDir, fullPath);
                const componentName = relativePath
                    .replace(/\.html$/, '')
                    .split(path.sep)
                    .join('/');
                
                files.push({
                    filePath: fullPath,
                    componentName: componentName
                });
            }
        }
    } catch (error) {
        // Directory doesn't exist or can't be read
    }
    
    return files;
}

// Legacy support - maintain old global state for backward compatibility
let legacyComponentCollection = {};
let legacyPagesCollection = {};
let legacyConfig = null;

/**
 * Legacy function: Register a component (synchronous for backward compatibility)
 * @param {string} componentPath - Path to component file
 * @param {string} name - Optional component name
 */
function registerComponent(componentPath, name = undefined) {
    const fs = require('fs');
    const component = fs.readFileSync(componentPath, 'utf8');

    if (name === undefined) {
        name = path.basename(componentPath, path.extname(componentPath));
    }

    if (legacyComponentCollection[name] !== undefined) {
        console.warn("Component " + name + " already exists, overriding");
    }

    legacyComponentCollection[name] = component;
}

/**
 * Legacy function: Get a component's content
 * @param {string} name - Component name
 * @returns {string|undefined} Component content or undefined
 */
function getComponent(name) {
    if (legacyComponentCollection[name] === undefined) {
        console.error("Component " + name + " not found");
        return undefined;
    }
    return legacyComponentCollection[name];
}

/**
 * Legacy function: Get a page's content
 * @param {string} name - Page filename
 * @returns {string} Page content
 */
function getPage(name) {
    const fs = require('fs');
    const config = legacyConfig || new Config();
    const PAGES_DIR = config.get('directories.pages') || "src/pages/";
    return fs.readFileSync(path.join(PAGES_DIR, name), 'utf8');
}

/**
 * Legacy function: Prepare pages (synchronous)
 */
function preparePages() {
    const fs = require('fs');
    const config = legacyConfig || new Config();
    const PAGES_DIR = config.get('directories.pages') || "src/pages/";

    const pages = fs.readdirSync(PAGES_DIR);
    pages.forEach(page => {
        const pageName = path.basename(page, path.extname(page));
        legacyPagesCollection[pageName] = getPage(page);
    });
}

/**
 * Legacy function: Compile components in a page
 * @param {string} page - Page name (without extension)
 * @returns {string|undefined} Compiled content or undefined
 */
function compileComponents(page) {
    if (page === undefined || legacyPagesCollection[page] === undefined) {
        console.error("Page " + page + " not found");
        return undefined;
    }

    let pageContent = legacyPagesCollection[page];
    const componentPattern = /{{[a-zA-Z0-9_\-\/]+}}/g;
    const components = pageContent.match(componentPattern);

    if (components !== null) {
        for (let componentTag of components) {
            const componentName = componentTag.slice(2, -2).trim();
            const componentContent = getComponent(componentName);

            if (componentContent === undefined) {
                console.error("Component " + componentName + " not found");
                return undefined;
            }

            pageContent = pageContent.split(componentTag).join(componentContent);
        }
    }

    return pageContent;
}

/**
 * Legacy function: Create pages (synchronous)
 */
function createPages() {
    const fs = require('fs');
    const config = legacyConfig || new Config();
    const OUTPUT_DIR = config.get('directories.output') || "public/";

    for (let page in legacyPagesCollection) {
        const pageContent = compileComponents(page);
        const pagePath = path.join(OUTPUT_DIR, page + ".html");
        fs.writeFileSync(pagePath, pageContent);
    }
}

/**
 * Main run function using new modular architecture
 * @param {object} options - Configuration options
 * @returns {Promise<void>}
 */
async function run(options = {}) {
    const config = new Config(options.configPath);
    legacyConfig = config;

    const logger = new Logger({
        verbose: options.verbose || config.get('verbose') || false,
        quiet: options.quiet || false
    });

    const fileManager = new FileManager(config);
    const componentRegistry = new ComponentRegistry(fileManager, logger);
    const pageCompiler = new PageCompiler(componentRegistry, fileManager, logger);

    try {
        logger.header("┏ mtb.js v0.3");

        const COMPONENT_DIR = config.get('directories.components');
        const PAGES_DIR = config.get('directories.pages');
        const OUTPUT_DIR = config.get('directories.output');

        // Ensure directories exist
        if (!fileManager.existsSync(COMPONENT_DIR)) {
            await fileManager.ensureDirectory(COMPONENT_DIR);
            await fileManager.ensureDirectory(PAGES_DIR);
            logger.info("┠ No components directories found, creating new ones");
        }

        await fileManager.ensureDirectory(OUTPUT_DIR);

        // Register components recursively from subdirectories (parallel)
        logger.info("┠ Registering components...");
        const componentFiles = await findComponentFiles(COMPONENT_DIR);

        await Promise.all(
            componentFiles.map(({ filePath, componentName }) =>
                componentRegistry.register(filePath, componentName)
            )
        );

        logger.info(`┠ Found: ${componentRegistry.count()} components in ${COMPONENT_DIR}`);

        // Copy registered components to legacy collection for backward compatibility
        componentRegistry.getAll().forEach(name => {
            legacyComponentCollection[name] = componentRegistry.get(name);
        });

        // Load pages (parallel)
        logger.info("┠ Preparing pages...");
        await pageCompiler.loadAllPages(PAGES_DIR);
        logger.info(`┠ Found: ${pageCompiler.getPageCount()} pages in ${PAGES_DIR}`);

        // Copy pages to legacy collection for backward compatibility
        pageCompiler.getAllPageNames().forEach(name => {
            legacyPagesCollection[name] = pageCompiler.pages[name];
        });

        // Compile pages (parallel)
        logger.info("┠ Compiling pages...");
        await pageCompiler.compileAllPages(OUTPUT_DIR);

        // Copy assets (CSS, JS, images, etc.)
        const ASSETS_DIR = config.get('directories.assets');
        if (fileManager.existsSync(ASSETS_DIR)) {
            logger.info("┠ Copying assets...");
            const assetsResult = await fileManager.copyAssets(ASSETS_DIR, OUTPUT_DIR);
            if (assetsResult.copied > 0) {
                logger.info(`┠ Copied: ${assetsResult.copied} asset files`);
            }
        }

        logger.header("┗ Done");

    } catch (error) {
        if (error instanceof MtbError) {
            logger.error(`✗ ${error.message}`);
            process.exit(1);
        }
        throw error;
    }
}

module.exports = {
    run,
    registerComponent,
    getComponent,
    getPage,
    compileComponents,
    createPages,
    // Export new classes for advanced usage
    Config,
    ComponentRegistry,
    PageCompiler,
    FileManager,
    Logger,
    Watcher: require('./src/Watcher')
};
