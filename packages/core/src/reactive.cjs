/**
 * @mtb-framework/core - Reactive System (CommonJS)
 * 
 * @copyright (c) 2024 Diego Vallejo
 * @license MIT
 */

'use strict';

function reactive(initialState, onChange) {
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

function computed(getter) {
  return getter;
}

function createStore(initialState) {
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

module.exports = { reactive, computed, createStore };
