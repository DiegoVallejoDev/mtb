/* 
 * Integration tests for subfolder component support
 */

const path = require('path');
const fs = require('fs').promises;
const ComponentRegistry = require('../../src/ComponentRegistry');
const PageCompiler = require('../../src/PageCompiler');
const FileManager = require('../../src/FileManager');
const Config = require('../../src/Config');
const Logger = require('../../src/utils/Logger');

describe('Subfolder Component Support', () => {
    let registry;
    let compiler;
    let fileManager;
    let logger;
    let testDir;

    beforeAll(async () => {
        // Create test directory structure
        testDir = '/tmp/mtb-subfolder-test-' + Date.now();
        await fs.mkdir(testDir, { recursive: true });
        await fs.mkdir(path.join(testDir, 'components/ui/inputs'), { recursive: true });
        await fs.mkdir(path.join(testDir, 'components/layout'), { recursive: true });
        await fs.mkdir(path.join(testDir, 'pages'), { recursive: true });
        await fs.mkdir(path.join(testDir, 'output'), { recursive: true });

        // Create test components
        await fs.writeFile(
            path.join(testDir, 'components/Hero.html'),
            '<section class="hero"><h1>Welcome</h1></section>'
        );
        await fs.writeFile(
            path.join(testDir, 'components/ui/Button.html'),
            '<button class="btn">${text}</button>'
        );
        await fs.writeFile(
            path.join(testDir, 'components/ui/inputs/TextInput.html'),
            '<input type="text" placeholder="${placeholder}" />'
        );
        await fs.writeFile(
            path.join(testDir, 'components/layout/Header.html'),
            '<header><nav>Menu</nav></header>'
        );
    });

    beforeEach(() => {
        const config = new Config();
        logger = new Logger({ quiet: true });
        fileManager = new FileManager(config);
        registry = new ComponentRegistry(fileManager, logger);
        compiler = new PageCompiler(registry, fileManager, logger);
    });

    afterAll(async () => {
        // Cleanup
        await fs.rm(testDir, { recursive: true, force: true });
    });

    describe('ComponentRegistry with subfolders', () => {
        it('should register root-level components', async () => {
            await registry.register(
                path.join(testDir, 'components/Hero.html'),
                'Hero'
            );
            expect(registry.has('Hero')).toBe(true);
            expect(registry.get('Hero')).toContain('hero');
        });

        it('should register subfolder components with slash syntax', async () => {
            await registry.register(
                path.join(testDir, 'components/ui/Button.html'),
                'ui/Button'
            );
            expect(registry.has('ui/Button')).toBe(true);
            expect(registry.get('ui/Button')).toContain('btn');
        });

        it('should register deeply nested components', async () => {
            await registry.register(
                path.join(testDir, 'components/ui/inputs/TextInput.html'),
                'ui/inputs/TextInput'
            );
            expect(registry.has('ui/inputs/TextInput')).toBe(true);
            expect(registry.get('ui/inputs/TextInput')).toContain('input');
        });

        it('should count all registered components correctly', async () => {
            await registry.register(
                path.join(testDir, 'components/Hero.html'),
                'Hero'
            );
            await registry.register(
                path.join(testDir, 'components/ui/Button.html'),
                'ui/Button'
            );
            await registry.register(
                path.join(testDir, 'components/layout/Header.html'),
                'layout/Header'
            );
            expect(registry.count()).toBe(3);
        });

        it('should list all component names including subfolders', async () => {
            await registry.register(
                path.join(testDir, 'components/Hero.html'),
                'Hero'
            );
            await registry.register(
                path.join(testDir, 'components/ui/Button.html'),
                'ui/Button'
            );
            
            const names = registry.getAll();
            expect(names).toContain('Hero');
            expect(names).toContain('ui/Button');
        });
    });

    describe('PageCompiler with subfolder components', () => {
        beforeEach(async () => {
            // Register all components
            await registry.register(
                path.join(testDir, 'components/Hero.html'),
                'Hero'
            );
            await registry.register(
                path.join(testDir, 'components/ui/Button.html'),
                'ui/Button'
            );
            await registry.register(
                path.join(testDir, 'components/ui/inputs/TextInput.html'),
                'ui/inputs/TextInput'
            );
            await registry.register(
                path.join(testDir, 'components/layout/Header.html'),
                'layout/Header'
            );
        });

        it('should compile pages with root-level components', async () => {
            await fs.writeFile(
                path.join(testDir, 'pages/simple.html'),
                '<body>{{Hero}}</body>'
            );
            await compiler.loadPage('simple.html', path.join(testDir, 'pages'));
            
            const compiled = compiler.compile('simple');
            expect(compiled).toContain('<section class="hero">');
        });

        it('should compile pages with subfolder components', async () => {
            await fs.writeFile(
                path.join(testDir, 'pages/with-subfolder.html'),
                '<body>{{ui/Button text="Click"}}</body>'
            );
            await compiler.loadPage('with-subfolder.html', path.join(testDir, 'pages'));
            
            const compiled = compiler.compile('with-subfolder');
            expect(compiled).toContain('<button class="btn">Click</button>');
        });

        it('should compile pages with deeply nested components', async () => {
            await fs.writeFile(
                path.join(testDir, 'pages/nested.html'),
                '<body>{{ui/inputs/TextInput placeholder="Name"}}</body>'
            );
            await compiler.loadPage('nested.html', path.join(testDir, 'pages'));
            
            const compiled = compiler.compile('nested');
            expect(compiled).toContain('<input type="text" placeholder="Name" />');
        });

        it('should compile pages with mixed root and subfolder components', async () => {
            await fs.writeFile(
                path.join(testDir, 'pages/mixed.html'),
                '<body>{{layout/Header}}{{Hero}}{{ui/Button text="Go"}}</body>'
            );
            await compiler.loadPage('mixed.html', path.join(testDir, 'pages'));
            
            const compiled = compiler.compile('mixed');
            expect(compiled).toContain('<header>');
            expect(compiled).toContain('<section class="hero">');
            expect(compiled).toContain('<button class="btn">Go</button>');
        });
    });
});
