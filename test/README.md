# Testing

This directory contains tests for mtb.js.

## Structure

- `unit/` - Unit tests for individual modules
- `integration/` - Integration tests for the build process
- `fixtures/` - Test fixtures (components, pages, etc.)

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Writing Tests

Tests are written using Jest. Each module should have corresponding unit tests in the `unit/` directory.

Example:
```javascript
describe('ComponentRegistry', () => {
    it('should register components', () => {
        // Test code
    });
});
```
