# mtb.js - The Mountain Bike of Static Site Generators 🚵

[![npm version](https://badge.fury.io/js/mtb.svg)](https://badge.fury.io/js/mtb)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Just like a mountain bike, **mtb.js** is **simple**, **lightweight**, **fast**, **reliable**, and built for **all terrain**. It handles any project with ease—from simple landing pages to complex component-based applications—without the bloat of heavier frameworks.

A component-based static site generator with powerful features for building modern static HTML applications. Perfect for creating static websites with reusable components, props, nested components, and watch mode for rapid development.

## ✨ Features

### Core Features
- 🧩 **Component-Based Architecture**: Create reusable HTML components
- 🎯 **Component Props**: Pass dynamic values to components with `{{button text="Click" class="primary"}}`
- 🔄 **Nested Components**: Components can include other components seamlessly
- 📦 **Zero Dependencies Runtime**: No heavy runtime dependencies
- 🚀 **Async Operations**: Parallel I/O for fast builds
- 🔒 **Security**: Path validation prevents directory traversal attacks

### Developer Experience
- 👀 **Watch Mode**: Auto-rebuild on file changes with `mtb --watch`
- 💻 **Professional CLI**: Commander-based interface with multiple commands
- 📘 **TypeScript Support**: Full type definitions included
- ⚙️ **Configuration Files**: Support for `mtb.config.js` and `.mtbrc.json`
- 🧪 **Testing Framework**: Jest configured with unit and integration tests
- 🎨 **Project Initialization**: `mtb init` creates complete project structure

### Quality & Safety
- ✅ **Input Validation**: Comprehensive type checking throughout
- 🛡️ **Error Handling**: Custom error classes with helpful messages
- 🔍 **Circular Dependency Detection**: Prevents infinite loops
- 📊 **Depth Limits**: Maximum 10-level nesting for safety

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g mtb
```

### Local Installation

```bash
npm install mtb
```

## 🚀 Quick Start

### Option 1: Use the Init Command

```bash
# Create and initialize a new project
mkdir my-website && cd my-website
mtb init

# Build your site
mtb

# Or use watch mode
mtb --watch
```

### Option 2: Manual Setup

1. **Create your project structure:**

```bash
mkdir my-website && cd my-website
mkdir -p src/components src/pages public
```

2. **Create a component with props** (`src/components/button.html`):

```html
<button class="${class}" type="${type}">${text}</button>
```

3. **Create a page** (`src/pages/index.html`):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Home</title>
</head>
<body>
  <h1>Welcome!</h1>
  {{button text="Get Started" class="btn-primary" type="button"}}
  {{button text="Learn More" class="btn-secondary" type="button"}}
</body>
</html>
```

4. **Build your site:**

```bash
mtb
```

Your compiled pages will be in the `public/` directory!

## 💻 CLI Usage

### Commands

```bash
# Build all pages
mtb

# Build with explicit command
mtb build

# Watch mode - auto-rebuild on changes
mtb --watch
mtb -w
mtb build --watch

# Initialize a new project
mtb init

# Show help
mtb --help

# Show version
mtb --version
```

### Options

```bash
-w, --watch          Watch for changes and rebuild automatically
-v, --verbose        Enable verbose output
-q, --quiet          Suppress output
-c, --config <path>  Use custom config file
```

### Examples

```bash
# Build with watch mode and verbose output
mtb --watch --verbose

# Build using custom config
mtb --config ./custom-config.js

# Build quietly
mtb --quiet
```

## 🎨 Component System

### Simple Components

Create reusable HTML components:

**Component:** `src/components/header.html`
```html
<header>
  <h1>My Website</h1>
  <nav>
    <a href="/">Home</a>
    <a href="/about.html">About</a>
  </nav>
</header>
```

**Usage:** `src/pages/index.html`
```html
<!DOCTYPE html>
<html>
<body>
  {{header}}
  <main>Content here</main>
</body>
</html>
```

### Component Props

Pass dynamic values to components:

**Component:** `src/components/card.html`
```html
<div class="card ${variant}">
  <h3>${title}</h3>
  <p>${description}</p>
  <a href="${url}">Read More</a>
</div>
```

**Usage:**
```html
{{card title="First Post" description="This is my first post" url="/post-1" variant="featured"}}
{{card title="Second Post" description="Another great post" url="/post-2" variant="regular"}}
```

**Supported Prop Types:**
- Strings: `text="Hello"`
- Numbers: `count=42`
- Booleans: `visible=true`

### Nested Components

Components can include other components:

**Component:** `src/components/nav.html`
```html
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>
```

**Component:** `src/components/header.html`
```html
<header>
  <h1>Site Title</h1>
  {{nav}}
</header>
```

**Usage:**
```html
{{header}}  <!-- Automatically includes nav -->
```

**Features:**
- Maximum nesting depth: 10 levels
- Circular dependency detection
- Clear error messages

## ⚙️ Configuration

### Config Files

Create `mtb.config.js` in your project root:

```javascript
module.exports = {
  directories: {
    components: "src/components/",
    pages: "src/pages/",
    output: "public/"
  },
  verbose: false
};
```

Or use `.mtbrc.json`:

```json
{
  "directories": {
    "components": "src/components/",
    "pages": "src/pages/",
    "output": "dist/"
  }
}
```

### Default Configuration

```javascript
{
  directories: {
    components: "src/components/",
    pages: "src/pages/",
    output: "public/"
  },
  watch: false,
  verbose: false
}
```

## 👀 Watch Mode

Watch mode automatically rebuilds your site when files change:

```bash
mtb --watch
```

**Features:**
- Monitors `src/components/` and `src/pages/`
- Debounced rebuilds (prevents rapid successive rebuilds)
- Shows which files changed
- Graceful shutdown with Ctrl+C

**Output:**
```
👀 Starting watch mode...
   Watching: src/components/
   Watching: src/pages/
✓ Watch mode active. Press Ctrl+C to stop.

📝 File changed: src/components/button.html
┏ mtb.js v0.2
...
✓ Build completed successfully
```

## 📚 API Reference

### Programmatic Usage

```javascript
const mtb = require('mtb');

// Async build
await mtb.run({
  verbose: true,
  configPath: './custom-config.js'
});
```

### Main Classes

#### Config
```javascript
const { Config } = require('mtb');

const config = new Config('./mtb.config.js');
const componentsDir = config.get('directories.components');
```

#### ComponentRegistry
```javascript
const { ComponentRegistry, FileManager, Logger } = require('mtb');

const logger = new Logger({ verbose: true });
const fileManager = new FileManager(config);
const registry = new ComponentRegistry(fileManager, logger);

await registry.register('./components/button.html', 'button');
const buttonHtml = registry.get('button');
```

#### PageCompiler
```javascript
const { PageCompiler } = require('mtb');

const compiler = new PageCompiler(componentRegistry, fileManager, logger);
await compiler.loadAllPages('./src/pages');
const compiled = compiler.compile('index');
```

### Legacy API (Backward Compatible)

```javascript
// Still supported for backward compatibility
mtb.registerComponent('./component.html', 'myComponent');
const component = mtb.getComponent('myComponent');
const compiled = mtb.compileComponents('index');
mtb.createPages();
```

## 📘 TypeScript Support

Full TypeScript definitions are included:

```typescript
import * as mtb from 'mtb';

// Type-safe API usage
const config: mtb.MtbConfig = {
  directories: {
    components: "src/components/",
    pages: "src/pages/",
    output: "public/"
  }
};

// Async with proper typing
await mtb.run({ verbose: true });

// Use classes with full IntelliSense
const logger = new mtb.Logger({ verbose: true });
const fileManager = new mtb.FileManager(new mtb.Config());
```

## 📂 Project Structure

```
my-website/
├── src/
│   ├── components/          # Reusable HTML components
│   │   ├── header.html
│   │   ├── footer.html
│   │   ├── button.html
│   │   └── card.html
│   └── pages/              # Page templates
│       ├── index.html
│       └── about.html
├── public/                 # Compiled output (generated)
│   ├── index.html
│   └── about.html
├── mtb.config.js          # Optional configuration
├── package.json
└── .gitignore
```

## 📖 Examples

For more detailed examples and patterns, check out our **[Examples Guide](./examples.md)** which includes:
- Detailed component patterns
- Layout system examples
- Alpine.js integration examples
- Full project examples

### Example 1: Blog with Props

**Component:** `src/components/post.html`
```html
<article class="post">
  <h2>${title}</h2>
  <time>${date}</time>
  <div class="content">${content}</div>
  <a href="${url}">Read More →</a>
</article>
```

**Usage:**
```html
{{post title="Getting Started with mtb" date="2024-01-15" content="Learn how to use mtb..." url="/posts/getting-started"}}
{{post title="Advanced Features" date="2024-01-20" content="Explore advanced features..." url="/posts/advanced"}}
```

### Example 2: Nested Layout

**Component:** `src/components/nav.html`
```html
<nav>
  <a href="/">Home</a>
  <a href="/blog">Blog</a>
  <a href="/contact">Contact</a>
</nav>
```

**Component:** `src/components/header.html`
```html
<header class="site-header">
  <div class="logo">My Site</div>
  {{nav}}
</header>
```

**Component:** `src/components/layout.html`
```html
<div class="layout">
  {{header}}
  <main class="content">
    <!-- Page content goes here -->
  </main>
  {{footer}}
</div>
```

### Example 3: Alpine.js Integration

**Component:** `src/components/counter.html`
```html
<div x-data="{ count: 0 }" class="counter">
  <button @click="count--">-</button>
  <span x-text="count"></span>
  <button @click="count++">+</button>
</div>
```

**Page:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Interactive Counter</title>
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body>
  {{counter}}
</body>
</html>
```

## 🧪 Testing

mtb includes a comprehensive testing setup with Jest:

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🛠️ Development

### Architecture

mtb v0.2.0 uses a modular architecture:

- **ComponentRegistry**: Manages component registration and retrieval
- **PageCompiler**: Handles page compilation with nested component support
- **FileManager**: Async file operations with proper error handling
- **Config**: Configuration management with file support
- **Logger**: Structured logging with verbose/quiet modes
- **Watcher**: File watching for auto-rebuild
- **PropsParser**: Component props parsing and interpolation
- **PathValidator**: Security validation for file paths

### Security

mtb includes several security features:

- **Path Validation**: Prevents directory traversal attacks
- **Input Validation**: Type checking on all inputs
- **Circular Dependency Detection**: Prevents infinite loops
- **Depth Limits**: Maximum nesting to prevent stack overflow

## 🎯 Component Naming

- Use lowercase: `header.html`, `footer.html`
- Use hyphens for multi-word: `blog-post.html`, `image-card.html`
- Reference without extension: `{{blog-post}}`
- Props use double quotes: `{{button text="Click"}}`

## 🔄 Migration from v0.1

v0.2.0 is **fully backward compatible** with v0.1.x:

✅ All existing code continues to work  
✅ Same directory structure  
✅ Same component syntax  
✅ Legacy API functions still supported

**New in v0.2.0:**
- Component props system
- Nested components
- Watch mode
- CLI enhancements
- TypeScript support
- Async operations
- Configuration files

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Running Tests

```bash
npm test
```

### Code Quality

- All code includes JSDoc comments
- Follows strict equality conventions
- Comprehensive error handling
- Security-focused design

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Diego Vallejo**

- GitHub: [@DiegoVallejoDev](https://github.com/DiegoVallejoDev)

## 🙏 Acknowledgments

- Designed to work seamlessly with [Alpine.js](https://alpinejs.dev/)
- Built with modern JavaScript best practices
- Inspired by component-based architectures

## 📝 Version History

### v0.2.0 (Latest)
- ✅ Component props system
- ✅ Nested components with circular dependency detection
- ✅ Watch mode for development
- ✅ CLI enhancements with commander
- ✅ TypeScript definitions
- ✅ Configuration file support
- ✅ Async operations for better performance
- ✅ Comprehensive testing setup
- ✅ Security improvements

### v0.1.x
- Basic component system
- Simple compilation
- CLI tool

## 🚀 What's Next?

Planned features for future releases:

- Markdown support in components
- Template inheritance
- Partial compilation (build specific pages)
- Plugin system
- Custom template syntax
- Build hooks and events

---

**Happy building with mtb! 🎉**

For more information, visit the [GitHub repository](https://github.com/DiegoVallejoDev/mtb).
