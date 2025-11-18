/* 
 * Simple integration smoke test
 */

const PropsParser = require('../../src/utils/PropsParser');
const ComponentRegistry = require('../../src/ComponentRegistry');
const Logger = require('../../src/utils/Logger');
const FileManager = require('../../src/FileManager');
const Config = require('../../src/Config');

describe('Build Integration Smoke Test', () => {
    it('should load all modules successfully', () => {
        expect(PropsParser).toBeDefined();
        expect(ComponentRegistry).toBeDefined();
        expect(Logger).toBeDefined();
        expect(FileManager).toBeDefined();
        expect(Config).toBeDefined();
    });

    it('should create instances of classes', () => {
        const config = new Config();
        const logger = new Logger({ quiet: true });
        const fileManager = new FileManager(config);
        const registry = new ComponentRegistry(fileManager, logger);

        expect(config).toBeInstanceOf(Config);
        expect(logger).toBeInstanceOf(Logger);
        expect(fileManager).toBeInstanceOf(FileManager);
        expect(registry).toBeInstanceOf(ComponentRegistry);
    });
});
