/* 
 * Unit tests for ComponentRegistry
 */

const ComponentRegistry = require('../../src/ComponentRegistry');
const Logger = require('../../src/utils/Logger');
const FileManager = require('../../src/FileManager');
const Config = require('../../src/Config');
const { ComponentNotFoundError } = require('../../src/utils/ErrorHandler');

describe('ComponentRegistry', () => {
    let registry;
    let fileManager;
    let logger;

    beforeEach(() => {
        const config = new Config();
        logger = new Logger({ quiet: true });
        fileManager = new FileManager(config);
        registry = new ComponentRegistry(fileManager, logger);
    });

    describe('get', () => {
        it('should throw ComponentNotFoundError if component not found', () => {
            expect(() => registry.get('nonexistent')).toThrow(ComponentNotFoundError);
        });

        it('should throw error for invalid name parameter', () => {
            expect(() => registry.get(null)).toThrow('Component name must be a non-empty string');
        });
    });

    describe('has', () => {
        it('should return false for non-existing component', () => {
            expect(registry.has('nonexistent')).toBe(false);
        });

        it('should return false for invalid parameters', () => {
            expect(registry.has(null)).toBe(false);
            expect(registry.has(123)).toBe(false);
        });
    });

    describe('count', () => {
        it('should return 0 for empty registry', () => {
            expect(registry.count()).toBe(0);
        });
    });
});
