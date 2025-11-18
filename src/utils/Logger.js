/* 
 * Copyright (c) 2021 Diego Valejo.
 * Logging utilities for mtb.js
 */

class Logger {
    constructor(options = {}) {
        this.verbose = options.verbose || false;
        this.quiet = options.quiet || false;
    }

    log(message, level = 'info') {
        if (this.quiet) return;
        
        const prefix = {
            info: 'ℹ',
            success: '✓',
            warning: '⚠',
            error: '✗',
            debug: '◆'
        }[level] || '';
        
        console.log(`${prefix} ${message}`);
    }

    info(message) {
        this.log(message, 'info');
    }

    success(message) {
        this.log(message, 'success');
    }

    warning(message) {
        this.log(message, 'warning');
    }

    error(message) {
        this.log(message, 'error');
    }

    debug(message) {
        if (this.verbose) {
            this.log(message, 'debug');
        }
    }

    header(message) {
        if (this.quiet) return;
        console.log(message);
    }

    table(data) {
        if (this.quiet) return;
        console.table(data);
    }
}

module.exports = Logger;
