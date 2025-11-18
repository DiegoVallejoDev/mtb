/* 
 * Copyright (c) 2021 Diego Valejo.
 * Custom error classes for mtb.js
 */

class MtbError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'MtbError';
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ComponentNotFoundError extends MtbError {
    constructor(componentName) {
        super(`Component "${componentName}" not found`, 'COMPONENT_NOT_FOUND');
        this.componentName = componentName;
    }
}

class PageNotFoundError extends MtbError {
    constructor(pageName) {
        super(`Page "${pageName}" not found`, 'PAGE_NOT_FOUND');
        this.pageName = pageName;
    }
}

class FileReadError extends MtbError {
    constructor(filePath, originalError) {
        super(`Failed to read file "${filePath}": ${originalError.message}`, 'FILE_READ_ERROR');
        this.filePath = filePath;
        this.originalError = originalError;
    }
}

class FileWriteError extends MtbError {
    constructor(filePath, originalError) {
        super(`Failed to write file "${filePath}": ${originalError.message}`, 'FILE_WRITE_ERROR');
        this.filePath = filePath;
        this.originalError = originalError;
    }
}

class DirectoryReadError extends MtbError {
    constructor(dirPath, originalError) {
        super(`Failed to read directory "${dirPath}": ${originalError.message}`, 'DIRECTORY_READ_ERROR');
        this.dirPath = dirPath;
        this.originalError = originalError;
    }
}

class DirectoryCreateError extends MtbError {
    constructor(dirPath, originalError) {
        super(`Failed to create directory "${dirPath}": ${originalError.message}`, 'DIRECTORY_CREATE_ERROR');
        this.dirPath = dirPath;
        this.originalError = originalError;
    }
}

class CompilationError extends MtbError {
    constructor(pageName, errors) {
        const errorList = errors.join('\n  - ');
        super(`Failed to compile page "${pageName}":\n  - ${errorList}`, 'COMPILATION_ERROR');
        this.pageName = pageName;
        this.errors = errors;
    }
}

module.exports = {
    MtbError,
    ComponentNotFoundError,
    PageNotFoundError,
    FileReadError,
    FileWriteError,
    DirectoryReadError,
    DirectoryCreateError,
    CompilationError
};
