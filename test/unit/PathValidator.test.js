/* 
 * Unit tests for PathValidator
 */

const PathValidator = require('../../src/utils/PathValidator');

describe('PathValidator', () => {
    describe('isValidComponentName', () => {
        // Root-level component names (backward compatible)
        it('should accept simple alphanumeric names', () => {
            expect(PathValidator.isValidComponentName('button')).toBe(true);
            expect(PathValidator.isValidComponentName('Button')).toBe(true);
            expect(PathValidator.isValidComponentName('header123')).toBe(true);
        });

        it('should accept names with hyphens and underscores', () => {
            expect(PathValidator.isValidComponentName('blog-post')).toBe(true);
            expect(PathValidator.isValidComponentName('my_component')).toBe(true);
            expect(PathValidator.isValidComponentName('blog-post_v2')).toBe(true);
        });

        // Subfolder component names (new feature)
        it('should accept subfolder component names with single slash', () => {
            expect(PathValidator.isValidComponentName('ui/Button')).toBe(true);
            expect(PathValidator.isValidComponentName('layout/Header')).toBe(true);
        });

        it('should accept deeply nested component names', () => {
            expect(PathValidator.isValidComponentName('ui/inputs/TextInput')).toBe(true);
            expect(PathValidator.isValidComponentName('ui/forms/inputs/Select')).toBe(true);
            expect(PathValidator.isValidComponentName('a/b/c/d/e')).toBe(true);
        });

        it('should accept subfolder names with hyphens and underscores', () => {
            expect(PathValidator.isValidComponentName('ui-components/my-button')).toBe(true);
            expect(PathValidator.isValidComponentName('my_folder/my_component')).toBe(true);
        });

        // Invalid component names
        it('should reject empty strings', () => {
            expect(PathValidator.isValidComponentName('')).toBe(false);
        });

        it('should reject non-string values', () => {
            expect(PathValidator.isValidComponentName(null)).toBe(false);
            expect(PathValidator.isValidComponentName(undefined)).toBe(false);
            expect(PathValidator.isValidComponentName(123)).toBe(false);
            expect(PathValidator.isValidComponentName({})).toBe(false);
        });

        it('should reject names with double slashes', () => {
            expect(PathValidator.isValidComponentName('ui//Button')).toBe(false);
            expect(PathValidator.isValidComponentName('a//b//c')).toBe(false);
        });

        it('should reject names with leading slash', () => {
            expect(PathValidator.isValidComponentName('/ui/Button')).toBe(false);
            expect(PathValidator.isValidComponentName('/button')).toBe(false);
        });

        it('should reject names with trailing slash', () => {
            expect(PathValidator.isValidComponentName('ui/Button/')).toBe(false);
            expect(PathValidator.isValidComponentName('button/')).toBe(false);
        });

        it('should reject names with empty segments', () => {
            expect(PathValidator.isValidComponentName('ui//inputs/Button')).toBe(false);
        });

        it('should reject names with invalid characters', () => {
            expect(PathValidator.isValidComponentName('ui/Button.html')).toBe(false);
            expect(PathValidator.isValidComponentName('ui/Button@')).toBe(false);
            expect(PathValidator.isValidComponentName('ui/Button#test')).toBe(false);
            expect(PathValidator.isValidComponentName('ui/Button$')).toBe(false);
            expect(PathValidator.isValidComponentName('ui Button')).toBe(false);
        });

        it('should reject names with backslashes', () => {
            expect(PathValidator.isValidComponentName('ui\\Button')).toBe(false);
        });
    });

    describe('sanitize', () => {
        it('should sanitize paths within base directory', () => {
            const result = PathValidator.sanitize('components/button.html', '/project/src');
            expect(result).toContain('components');
            expect(result).toContain('button.html');
        });

        it('should throw error for path traversal attempts', () => {
            expect(() => {
                PathValidator.sanitize('../../../etc/passwd', '/project/src');
            }).toThrow('Invalid path');
        });
    });

    describe('isValidFileName', () => {
        it('should accept valid filenames', () => {
            expect(PathValidator.isValidFileName('button.html')).toBe(true);
            expect(PathValidator.isValidFileName('my-component.html')).toBe(true);
        });

        it('should reject invalid filenames', () => {
            expect(PathValidator.isValidFileName('../button.html')).toBe(false);
            expect(PathValidator.isValidFileName('button')).toBe(false);
        });
    });
});
