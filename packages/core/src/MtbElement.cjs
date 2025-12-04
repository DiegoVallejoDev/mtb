/**
 * @mtb-framework/core - MtbElement Base Class (CommonJS)
 * 
 * @copyright (c) 2024 Diego Vallejo
 * @license MIT
 */

'use strict';

/**
 * Base class for mtb Web Components.
 */
class MtbElement extends HTMLElement {
  static properties = {};

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._props = {};
    this._methods = {};
    this._eventListeners = [];
  }

  connectedCallback() {
    this._initializeProps();
    this._render();
  }

  disconnectedCallback() {
    this._cleanupEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      const config = this.constructor.properties[name];
      this._props[name] = this._coerceValue(newValue, config);
      this._render();
    }
  }

  static get observedAttributes() {
    return Object.keys(this.properties);
  }

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

  _coerceValue(value, config) {
    if (value === null) {
      return config?.default ?? null;
    }

    const type = config?.type;
    if (type === Boolean) {
      return value === '' || value === 'true';
    }
    if (type === Number) {
      const num = Number(value);
      return isNaN(num) ? (config?.default ?? 0) : num;
    }
    return value;
  }

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

  _cleanupEventListeners() {
    for (const { el, eventName, handler } of this._eventListeners) {
      el.removeEventListener(eventName, handler);
    }
    this._eventListeners = [];
  }

  emit(eventName, detail) {
    this.dispatchEvent(new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return '';
  }

  styles() {
    return '';
  }
}

function defineComponent(tagName, componentClass) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, componentClass);
  }
}

module.exports = { MtbElement, defineComponent };
