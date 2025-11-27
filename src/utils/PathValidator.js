/* 
 * Copyright (c) 2021 Diego Valejo.
 * Path validation and sanitization for mtb.js
 */

const path = require('path');

class PathValidator {
    /**
     * Sanitize a user-provided path to prevent directory traversal
     * @param {string} userPath - The path provided by the user
     * @param {string} baseDir - The base directory to constrain the path to
     * @returns {string} The sanitized absolute path
     * @throws {Error} If the path attempts to escape the base directory
     */
    static sanitize(userPath, baseDir) {
        // Resolve the full path
        const fullPath = path.resolve(baseDir, userPath);
        const normalizedBase = path.resolve(baseDir);
        
        // Ensure the path is within the base directory
        if (!fullPath.startsWith(normalizedBase + path.sep) && fullPath !== normalizedBase) {
            throw new Error(`Invalid path: ${userPath}`);
        }
        
        return fullPath;
    }
    
    /**
     * Validate component name format
     * @param {string} name - The component name to validate
     * @returns {boolean} True if valid
     */
    static isValidComponentName(name) {
        // Only allow alphanumeric, hyphens, underscores, and forward slashes for subfolders
        // Do not allow: double slashes, leading/trailing slashes, empty segments
        if (typeof name !== 'string' || name.length === 0) {
            return false;
        }
        
        // Check for double slashes or leading/trailing slashes
        if (name.includes('//') || name.startsWith('/') || name.endsWith('/')) {
            return false;
        }
        
        // Each segment must be valid (alphanumeric, hyphens, underscores)
        const segments = name.split('/');
        for (const segment of segments) {
            if (segment.length === 0 || !/^[a-zA-Z0-9_-]+$/.test(segment)) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Validate file name format
     * @param {string} filename - The filename to validate
     * @returns {boolean} True if valid
     */
    static isValidFileName(filename) {
        // Prevent null bytes, path traversal
        if (filename.includes('\0') || filename.includes('..')) {
            return false;
        }
        
        // Check for valid characters
        return /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/.test(filename);
    }
}

module.exports = PathValidator;
