/* 
 * Copyright (c) 2021 Diego Valejo.
 * File system operations manager for mtb.js
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const { FileReadError, FileWriteError, DirectoryReadError, DirectoryCreateError } = require('./utils/ErrorHandler');
const PathValidator = require('./utils/PathValidator');

class FileManager {
    constructor(config) {
        this.config = config;
    }

    /**
     * Read a file asynchronously
     * @param {string} filePath - Path to the file
     * @returns {Promise<string>} File content
     */
    async readFile(filePath) {
        try {
            return await fs.readFile(filePath, 'utf8');
        } catch (error) {
            throw new FileReadError(filePath, error);
        }
    }

    /**
     * Write a file asynchronously
     * @param {string} filePath - Path to the file
     * @param {string} content - Content to write
     * @returns {Promise<void>}
     */
    async writeFile(filePath, content) {
        try {
            await fs.writeFile(filePath, content, 'utf8');
        } catch (error) {
            throw new FileWriteError(filePath, error);
        }
    }

    /**
     * Read directory contents asynchronously
     * @param {string} dirPath - Path to the directory
     * @returns {Promise<string[]>} Array of filenames
     */
    async readDirectory(dirPath) {
        try {
            return await fs.readdir(dirPath);
        } catch (error) {
            throw new DirectoryReadError(dirPath, error);
        }
    }

    /**
     * Ensure directory exists, create if it doesn't
     * @param {string} dirPath - Path to the directory
     * @returns {Promise<void>}
     */
    async ensureDirectory(dirPath) {
        try {
            await fs.mkdir(dirPath, { recursive: true });
        } catch (error) {
            throw new DirectoryCreateError(dirPath, error);
        }
    }

    /**
     * Check if a file or directory exists
     * @param {string} filePath - Path to check
     * @returns {Promise<boolean>} True if exists
     */
    async exists(filePath) {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check if a file or directory exists (synchronous)
     * @param {string} filePath - Path to check
     * @returns {boolean} True if exists
     */
    existsSync(filePath) {
        return fsSync.existsSync(filePath);
    }

    /**
     * Safely read a file with path validation
     * @param {string} fileName - Name of the file
     * @param {string} baseDir - Base directory
     * @returns {Promise<string>} File content
     */
    async readFileSafe(fileName, baseDir) {
        if (!PathValidator.isValidFileName(fileName)) {
            throw new Error(`Invalid filename: ${fileName}`);
        }

        const safePath = PathValidator.sanitize(fileName, baseDir);
        return await this.readFile(safePath);
    }

    /**
     * Copy a file from source to destination
     * @param {string} srcPath - Source file path
     * @param {string} destPath - Destination file path
     * @returns {Promise<void>}
     */
    async copyFile(srcPath, destPath) {
        try {
            await fs.copyFile(srcPath, destPath);
        } catch (error) {
            throw new FileWriteError(destPath, error);
        }
    }

    /**
     * Copy all assets from source directory to output directory
     * Supports CSS, JS, images, fonts, and other static files
     * @param {string} srcDir - Source assets directory
     * @param {string} destDir - Destination directory
     * @param {string} subDir - Subdirectory (for recursion)
     * @returns {Promise<{copied: number, files: string[]}>} Copy result with count and file list
     */
    async copyAssets(srcDir, destDir, subDir = '') {
        const currentSrcDir = subDir ? path.join(srcDir, subDir) : srcDir;
        const currentDestDir = subDir ? path.join(destDir, subDir) : destDir;

        // Check if source directory exists
        if (!await this.exists(currentSrcDir)) {
            return { copied: 0, files: [] };
        }

        // Ensure destination directory exists
        await this.ensureDirectory(currentDestDir);

        const files = await this.readDirectory(currentSrcDir);
        let copiedCount = 0;
        const copiedFiles = [];

        for (const file of files) {
            const srcPath = path.join(currentSrcDir, file);
            const destPath = path.join(currentDestDir, file);
            const relativePath = subDir ? path.join(subDir, file) : file;

            try {
                const stat = await fs.stat(srcPath);

                if (stat.isDirectory()) {
                    // Recursively copy subdirectories
                    const subResult = await this.copyAssets(srcDir, destDir, relativePath);
                    copiedCount += subResult.copied;
                    copiedFiles.push(...subResult.files);
                } else {
                    // Copy file
                    await this.copyFile(srcPath, destPath);
                    copiedCount++;
                    copiedFiles.push(relativePath);
                }
            } catch (error) {
                throw new FileWriteError(destPath, error);
            }
        }

        return { copied: copiedCount, files: copiedFiles };
    }

    /**
     * Get file extension
     * @param {string} filePath - Path to the file
     * @returns {string} File extension (lowercase, without dot)
     */
    getExtension(filePath) {
        return path.extname(filePath).slice(1).toLowerCase();
    }

    /**
     * Check if file is a supported asset type
     * @param {string} filePath - Path to the file
     * @returns {boolean} True if file is a supported asset
     */
    isAssetFile(filePath) {
        const supportedExtensions = [
            // Stylesheets
            'css', 'scss', 'sass', 'less',
            // JavaScript
            'js', 'mjs', 'cjs',
            // Images
            'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'avif',
            // Fonts
            'woff', 'woff2', 'ttf', 'otf', 'eot',
            // Other
            'json', 'xml', 'txt', 'pdf', 'map'
        ];

        const ext = this.getExtension(filePath);
        return supportedExtensions.includes(ext);
    }
}

module.exports = FileManager;
