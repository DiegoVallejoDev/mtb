/* 
 * Copyright (c) 2021 Diego Valejo.
 * File watcher for mtb.js
 */

const chokidar = require('chokidar');
const path = require('path');

class Watcher {
    constructor(config, runBuild, logger) {
        this.config = config;
        this.runBuild = runBuild;
        this.logger = logger;
        this.watcher = null;
        this.isBuilding = false;
        this.pendingBuild = false;
    }

    /**
     * Start watching for file changes
     * @returns {Promise<void>}
     */
    async start() {
        const componentsDir = this.config.get('directories.components');
        const pagesDir = this.config.get('directories.pages');

        this.logger.info('👀 Starting watch mode...');
        this.logger.info(`   Watching: ${componentsDir}`);
        this.logger.info(`   Watching: ${pagesDir}`);

        const watchPaths = [componentsDir, pagesDir];

        this.watcher = chokidar.watch(watchPaths, {
            persistent: true,
            ignoreInitial: true,
            awaitWriteFinish: {
                stabilityThreshold: 100,
                pollInterval: 100
            }
        });

        this.watcher
            .on('add', filePath => this.handleChange('added', filePath))
            .on('change', filePath => this.handleChange('changed', filePath))
            .on('unlink', filePath => this.handleChange('removed', filePath))
            .on('error', error => {
                this.logger.error(`Watcher error: ${error.message}`);
            });

        this.logger.success('✓ Watch mode active. Press Ctrl+C to stop.');
    }

    /**
     * Handle file change event
     * @param {string} event - Event type (added, changed, removed)
     * @param {string} filePath - Path to the changed file
     * @private
     */
    handleChange(event, filePath) {
        const fileName = path.basename(filePath);
        const relPath = path.relative(process.cwd(), filePath);

        this.logger.info(`\n📝 File ${event}: ${relPath}`);

        // Queue a rebuild
        this.queueBuild();
    }

    /**
     * Queue a build (debounced)
     * @private
     */
    queueBuild() {
        if (this.isBuilding) {
            // Mark that we need another build after current one finishes
            this.pendingBuild = true;
            return;
        }

        this.executeBuild();
    }

    /**
     * Execute the build
     * @private
     */
    async executeBuild() {
        this.isBuilding = true;

        try {
            await this.runBuild();
            this.logger.success('✓ Build completed successfully');
        } catch (error) {
            this.logger.error(`✗ Build failed: ${error.message}`);
        } finally {
            this.isBuilding = false;

            // If another change happened during build, rebuild
            if (this.pendingBuild) {
                this.pendingBuild = false;
                // Small delay to avoid rapid rebuilds
                setTimeout(() => this.executeBuild(), 100);
            }
        }
    }

    /**
     * Stop watching
     * @returns {Promise<void>}
     */
    async stop() {
        if (this.watcher) {
            await this.watcher.close();
            this.logger.info('Watch mode stopped');
        }
    }
}

module.exports = Watcher;
