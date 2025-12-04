/**
 * @mtb-framework/core - Reactive System
 * 
 * Simple reactive state management for mtb components.
 * 
 * @copyright (c) 2024 Diego Vallejo
 * @license MIT
 */

/**
 * Create a reactive state object.
 * Changes to the state will trigger the callback function.
 * 
 * @param {Object} initialState - The initial state object
 * @param {Function} onChange - Callback to run when state changes
 * @returns {Proxy} A reactive proxy object
 * 
 * @example
 * const state = reactive({ count: 0 }, () => this._render());
 * state.count++; // Triggers re-render
 */
export function reactive(initialState, onChange) {
  return new Proxy(initialState, {
    set(target, property, value) {
      const oldValue = target[property];
      target[property] = value;
      if (oldValue !== value && typeof onChange === 'function') {
        onChange(property, value, oldValue);
      }
      return true;
    },
    get(target, property) {
      return target[property];
    }
  });
}

/**
 * Create a computed value that updates when dependencies change.
 * 
 * @param {Function} getter - Function that computes the value
 * @returns {Function} A function that returns the computed value
 * 
 * @example
 * const fullName = computed(() => `${state.firstName} ${state.lastName}`);
 * console.log(fullName()); // Recomputes on access
 */
export function computed(getter) {
  return getter;
}

/**
 * Create a simple store for shared state across components.
 * 
 * @param {Object} initialState - The initial state object
 * @returns {{state: Proxy, subscribe: Function, getState: Function}}
 * 
 * @example
 * const store = createStore({ user: null, theme: 'light' });
 * store.subscribe((prop, newVal) => console.log(`${prop} changed to ${newVal}`));
 * store.state.theme = 'dark'; // Notifies all subscribers
 */
export function createStore(initialState) {
  const subscribers = [];

  const state = new Proxy({ ...initialState }, {
    set(target, property, value) {
      const oldValue = target[property];
      target[property] = value;
      if (oldValue !== value) {
        subscribers.forEach(fn => fn(property, value, oldValue));
      }
      return true;
    },
    get(target, property) {
      return target[property];
    }
  });

  return {
    state,
    subscribe(callback) {
      subscribers.push(callback);
      return () => {
        const index = subscribers.indexOf(callback);
        if (index > -1) {
          subscribers.splice(index, 1);
        }
      };
    },
    getState() {
      return { ...state };
    }
  };
}
