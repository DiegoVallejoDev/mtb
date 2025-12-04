# @mtb-framework/parcel-transformer

Parcel transformer for .mtb Web Components.

## Installation

```bash
npm install @mtb-framework/parcel-transformer @mtb-framework/core
```

## Configuration

Add to your `.parcelrc`:

```json
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.mtb": ["@mtb-framework/parcel-transformer"]
  }
}
```

## Usage

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
</style>

<script>
  export default {
    props: {
      variant: { type: String, default: "primary" },
    },
    methods: {
      handleClick(e) {
        this.emit("click", e);
      },
    },
  };
</script>
```

Import in your JavaScript:

```javascript
import "./components/my-button.mtb";
```

Use in HTML:

```html
<my-button variant="primary">Click me</my-button>
```

## Component Syntax

### Template Section

The `<template>` section contains the component's HTML. Use `${propName}` for property interpolation and `@event="method"` for event handling.

### Style Section

The `<style>` section contains scoped CSS that applies only to the component's Shadow DOM.

### Script Section

The `<script>` section exports a component definition object:

```javascript
export default {
  props: {
    propName: { type: String, default: "value" },
  },
  methods: {
    methodName(arg) {
      // Method implementation
    },
  },
};
```

## License

MIT
