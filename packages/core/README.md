# @mtb-framework/core

Core runtime for mtb Web Components framework.

## Installation

```bash
npm install @mtb-framework/core
```

## Usage

### Basic Component

```javascript
import { MtbElement, defineComponent } from "@mtb-framework/core";

class MyButton extends MtbElement {
  static properties = {
    variant: { type: String, default: "primary" },
    disabled: { type: Boolean, default: false },
  };

  render() {
    return `
      <button class="btn btn-${this._props.variant}" ${
      this._props.disabled ? "disabled" : ""
    }>
        <slot></slot>
      </button>
    `;
  }

  styles() {
    return `
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
    `;
  }
}

defineComponent("my-button", MyButton);
```

### Reactive State

```javascript
import { reactive, createStore } from "@mtb-framework/core";

// Local reactive state
const state = reactive({ count: 0 }, (prop, value) => {
  console.log(`${prop} changed to ${value}`);
});

state.count++; // Triggers callback

// Shared store
const store = createStore({ user: null, theme: "light" });
store.subscribe((prop, newVal, oldVal) => {
  console.log(`${prop}: ${oldVal} -> ${newVal}`);
});
store.state.theme = "dark";
```

## API Reference

### MtbElement

Base class for creating Web Components.

#### Static Properties

- `properties` - Object defining component properties with type and default values

#### Methods

- `render()` - Override to return the component's HTML template
- `styles()` - Override to return the component's CSS styles
- `emit(eventName, detail)` - Dispatch a custom event

### defineComponent(tagName, componentClass)

Register a custom element.

### reactive(initialState, onChange)

Create a reactive state object.

### createStore(initialState)

Create a shared state store with subscription support.

## License

MIT
