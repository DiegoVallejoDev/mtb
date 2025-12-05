# mtb

Base package for the mtb Web Components Framework. This package re-exports the core functionality from the framework's subpackages, making it easier to import from a single package.

## Installation

```bash
npm install mtb
```

## Usage

### Default Import (Core)

The default import re-exports everything from `@mtb-framework/core`:

```javascript
import { MtbElement, defineComponent, reactive, createStore } from 'mtb';

class MyComponent extends MtbElement {
  static properties = {
    name: { type: String, default: 'World' }
  };

  render() {
    return `<h1>Hello, ${this._props.name}!</h1>`;
  }
}

defineComponent('my-component', MyComponent);
```

### Subpath Exports

You can also use explicit subpath exports:

#### Core

```javascript
import { MtbElement, defineComponent, reactive, createStore } from 'mtb/core';
```

#### Parcel Transformer

```javascript
import transformer from 'mtb/parcel-transformer';
```

## Related Packages

- [`@mtb-framework/core`](../core) - Core runtime for Web Components
- [`@mtb-framework/parcel-transformer`](../parcel-transformer-mtb) - Parcel transformer for .mtb files
- [`create-mtb`](../create-mtb) - CLI tool to scaffold new projects

## License

MIT
