/**
 * @mtb/core - MtbElement Base Class
 * 
 * A lightweight Web Components framework for building reactive custom elements.
 * 
 * @copyright (c) 2024 Diego Vallejo
 * @license MIT
 */

/**
 * Base class for mtb Web Components.
 * Provides reactive properties, event handling, and Shadow DOM support.
 * 
 * @extends HTMLElement
 */
export class MtbElement extends HTMLElement {
  /**
   * Define reactive properties with type and default values.
   * Override in subclass to define component properties.
   * 
   * @static
   * @type {Object.<string, {type: Function, default: *}>}
   * @example
   * static properties = {
   *   variant: { type: String, default: 'primary' },
   *   disabled: { type: Boolean, default: false }
   * };
   */
  static properties = {};

  /**
   * Create a new MtbElement instance.
   * Initializes Shadow DOM and internal state.
   */
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._props = {};
    this._methods = {};
    this._eventListeners = [];
  }

  /**
   * Called when the element is connected to the DOM.
   * Initializes properties and triggers initial render.
   */
  connectedCallback() {
    this._initializeProps();
    this._render();
  }

  /**
   * Called when the element is disconnected from the DOM.
   * Cleans up event listeners.
   */
  disconnectedCallback() {
    this._cleanupEventListeners();
  }

  /**
   * Called when an observed attribute changes.
   * Updates the corresponding property and triggers re-render.
   * 
   * @param {string} name - The attribute name
   * @param {string|null} oldValue - The previous value
   * @param {string|null} newValue - The new value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      const config = this.constructor.properties[name];
      this._props[name] = this._coerceValue(newValue, config);
      this._render();
    }
  }

  /**
   * Returns the list of attributes to observe for changes.
   * Automatically derived from the static properties definition.
   * 
   * @static
   * @returns {string[]} Array of attribute names to observe
   */
  static get observedAttributes() {
    return Object.keys(this.properties);
  }

  /**
   * Initialize properties from attributes and defaults.
   * @private
   */
  _initializeProps() {
    const props = this.constructor.properties;
    for (const [key, config] of Object.entries(props)) {
      const attrValue = this.getAttribute(key);
      if (attrValue !== null) {
        this._props[key] = this._coerceValue(attrValue, config);
      } else {
        this._props[key] = config.default ?? null;
      }
    }
  }

  /**
   * Coerce a string attribute value to the correct type.
   * @private
   * @param {string|null} value - The attribute value
   * @param {Object} config - The property configuration
   * @returns {*} The coerced value
   */
  _coerceValue(value, config) {
    if (value === null) {
      return config?.default ?? null;
    }

    const type = config?.type;
    if (type === Boolean) {
      return value === '' || value === 'true' || value === key;
    }
    if (type === Number) {
      const num = Number(value);
      return isNaN(num) ? (config?.default ?? 0) : num;
    }
    // Default to String
    return value;
  }

  /**
   * Render the component to the Shadow DOM.
   * @private
   */
  _render() {
    this._cleanupEventListeners();
    
    const template = this.render();
    const styles = this.styles?.() || '';
    
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      ${template}
    `;
    
    this._attachEventListeners();
  }

  /**
   * Attach event listeners defined with @event syntax in the template.
   * @private
   */
  _attachEventListeners() {
    const elements = this.shadowRoot.querySelectorAll('[data-mtb-event]');
    elements.forEach(el => {
      const eventData = el.getAttribute('data-mtb-event');
      if (eventData) {
        try {
          const events = JSON.parse(eventData);
          for (const [eventName, methodName] of Object.entries(events)) {
            const handler = (e) => {
              if (typeof this[methodName] === 'function') {
                this[methodName](e);
              }
            };
            el.addEventListener(eventName, handler);
            this._eventListeners.push({ el, eventName, handler });
          }
        } catch {
          // Invalid JSON, skip
        }
      }
    });
  }

  /**
   * Remove all attached event listeners.
   * @private
   */
  _cleanupEventListeners() {
    for (const { el, eventName, handler } of this._eventListeners) {
      el.removeEventListener(eventName, handler);
    }
    this._eventListeners = [];
  }

  /**
   * Emit a custom event from this component.
   * 
   * @param {string} eventName - The event name
   * @param {*} detail - Event detail data
   */
  emit(eventName, detail) {
    this.dispatchEvent(new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Override in subclass to return the component's template.
   * Use ${this._props.propName} to interpolate property values.
   * 
   * @returns {string} HTML template string
   */
  render() {
    return '';
  }

  /**
   * Override in subclass to return the component's styles.
   * 
   * @returns {string} CSS styles string
   */
  styles() {
    return '';
  }
}

/**
 * Define a custom element from a component class.
 * 
 * @param {string} tagName - The custom element tag name (must contain a hyphen)
 * @param {typeof MtbElement} componentClass - The component class
 */
export function defineComponent(tagName, componentClass) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, componentClass);
  }
}
