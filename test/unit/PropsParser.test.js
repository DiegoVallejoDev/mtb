/* 
 * Unit tests for PropsParser
 */

const PropsParser = require('../../src/utils/PropsParser');

describe('PropsParser', () => {
    describe('parse', () => {
        it('should parse component without props', () => {
            const result = PropsParser.parse('{{button}}');
            expect(result.componentName).toBe('button');
            expect(result.props).toEqual({});
        });

        it('should parse component with props', () => {
            const result = PropsParser.parse('{{button text="Click Me" class="primary"}}');
            expect(result.componentName).toBe('button');
            expect(result.props).toEqual({
                text: 'Click Me',
                class: 'primary'
            });
        });

        it('should parse boolean props', () => {
            const result = PropsParser.parse('{{modal visible=true closable=false}}');
            expect(result.props).toEqual({
                visible: true,
                closable: false
            });
        });

        it('should handle hyphenated component names', () => {
            const result = PropsParser.parse('{{blog-post title="My Post"}}');
            expect(result.componentName).toBe('blog-post');
            expect(result.props).toEqual({
                title: 'My Post'
            });
        });
    });

    describe('interpolate', () => {
        it('should interpolate props into content', () => {
            const content = '<button class="\${class}">\${text}</button>';
            const props = { class: 'primary', text: 'Click Me' };
            
            const result = PropsParser.interpolate(content, props);
            expect(result).toBe('<button class="primary">Click Me</button>');
        });

        it('should return content unchanged if no props', () => {
            const content = '<button>Click</button>';
            const result = PropsParser.interpolate(content, {});
            expect(result).toBe(content);
        });
    });
});
