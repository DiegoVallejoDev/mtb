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
}

module.exports = FileManager;
