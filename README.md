# mtb - Web Components Framework 🚀

[![npm version](https://badge.fury.io/js/@mtb%2Fcore.svg)](https://badge.fury.io/js/@mtb%2Fcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight Web Components framework with Parcel integration. Create reactive custom elements using a simple single-file component syntax.

## ✨ Features

- 🧩 **Single-File Components** - Write template, style, and script in one `.mtb` file
- ⚡ **Reactive Properties** - Automatic re-rendering when properties change
- 🎨 **Scoped Styles** - Shadow DOM encapsulation for isolated styles
- 🔌 **Parcel Integration** - Zero-config build with hot module replacement
- 📦 **Lightweight** - No heavy runtime dependencies
- 🛠️ **Easy Scaffolding** - Create new projects with `npm create mtb`

## 🚀 Quick Start

```bash
# Create a new project
npm create mtb my-app

# Navigate and install
cd my-app
npm install

# Start development server
npm start
```

## 📦 Packages

| Package | Description |
|---------|-------------|
| [@mtb/core](./packages/core) | Core runtime for Web Components |
| [@mtb/parcel-transformer](./packages/parcel-transformer-mtb) | Parcel transformer for .mtb files |
| [create-mtb](./packages/create-mtb) | CLI for project scaffolding |

## 💻 Component Syntax

Create `.mtb` files with template, style, and script sections:

```html
<!-- src/components/my-button.mtb -->
<template>
  <button class="btn btn-${variant}" @click="handleClick">
    <slot></slot>
  </button>
</template>

<style>
  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .btn-primary {
    background: #3498db;
    color: white;
  }
  .btn-secondary {
    background: #95a5a6;
    color: white;
  }
</style>

<script>
  export default {
    props: {
      variant: { type: String, default: 'primary' }
    },
    methods: {
      handleClick(e) {
        this.emit('click', e);
      }
    }
  }
</script>
```

## 📁 Project Structure

```
my-app/
├── src/
│   ├── components/
│   │   ├── mtb-button.mtb
│   │   ├── mtb-card.mtb
│   │   └── mtb-header.mtb
│   ├── index.js
│   └── index.html
├── .parcelrc
└── package.json
```

## ⚙️ Configuration

### .parcelrc

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.mtb": ["@mtb/parcel-transformer"]
  }
}
```

### Using Components

Import `.mtb` files in your JavaScript:

```javascript
// src/index.js
import './components/mtb-header.mtb';
import './components/mtb-button.mtb';
import './components/mtb-card.mtb';
```

Use in HTML:

```html
<mtb-header title="My App"></mtb-header>
<mtb-button variant="primary">Click me</mtb-button>
<mtb-card title="Hello">
  <p>Content goes here</p>
</mtb-card>
```

## 📚 API Reference

### MtbElement

Base class for creating Web Components.

```javascript
import { MtbElement, defineComponent } from '@mtb/core';

class MyComponent extends MtbElement {
  static properties = {
    name: { type: String, default: 'World' }
  };

  render() {
    return `<p>Hello, ${this._props.name}!</p>`;
  }

  styles() {
    return `p { color: blue; }`;
  }
}

defineComponent('my-component', MyComponent);
```

### Reactive State

```javascript
import { reactive, createStore } from '@mtb/core';

// Local reactive state
const state = reactive({ count: 0 }, () => console.log('Changed!'));
state.count++;

// Shared store
const store = createStore({ theme: 'light' });
store.subscribe((prop, val) => console.log(`${prop} = ${val}`));
store.state.theme = 'dark';
```

## 🔄 Migration from v0.x

mtb v1.0.0 is a complete rewrite focused on Web Components. If you're migrating from v0.x:

1. **New Architecture** - v1.0.0 uses Web Components instead of static HTML templates
2. **Different Syntax** - Components use `.mtb` single-file format instead of `.html`
3. **Parcel Integration** - Built as a Parcel transformer instead of standalone CLI
4. **No Backward Compatibility** - v1.0.0 is a breaking release

For legacy static site generation, continue using mtb v0.3.x.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Diego Vallejo**

- GitHub: [@DiegoVallejoDev](https://github.com/DiegoVallejoDev)

---

**Happy building with mtb! 🎉**
