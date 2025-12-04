/**
 * Tests for @mtb-framework/core reactive system
 */

import { reactive, computed, createStore } from '../src/reactive.js';
import { jest, describe, test, expect } from '@jest/globals';

describe('reactive', () => {
  test('should create a reactive proxy', () => {
    const onChange = jest.fn();
    const state = reactive({ count: 0 }, onChange);

    state.count = 1;

    expect(onChange).toHaveBeenCalledWith('count', 1, 0);
    expect(state.count).toBe(1);
  });

  test('should not trigger onChange for same value', () => {
    const onChange = jest.fn();
    const state = reactive({ count: 5 }, onChange);

    state.count = 5;

    expect(onChange).not.toHaveBeenCalled();
  });

  test('should track multiple properties', () => {
    const onChange = jest.fn();
    const state = reactive({ a: 1, b: 2 }, onChange);

    state.a = 10;
    state.b = 20;

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(1, 'a', 10, 1);
    expect(onChange).toHaveBeenNthCalledWith(2, 'b', 20, 2);
  });
});

describe('computed', () => {
  test('should return a getter function', () => {
    const getter = () => 42;
    const result = computed(getter);

    expect(result()).toBe(42);
  });

  test('should recompute on each call', () => {
    let counter = 0;
    const getter = () => ++counter;
    const result = computed(getter);

    expect(result()).toBe(1);
    expect(result()).toBe(2);
    expect(result()).toBe(3);
  });
});

describe('createStore', () => {
  test('should create a store with initial state', () => {
    const store = createStore({ theme: 'light', count: 0 });

    expect(store.getState()).toEqual({ theme: 'light', count: 0 });
  });

  test('should allow state mutations', () => {
    const store = createStore({ theme: 'light' });

    store.state.theme = 'dark';

    expect(store.getState()).toEqual({ theme: 'dark' });
  });

  test('should notify subscribers on change', () => {
    const store = createStore({ count: 0 });
    const subscriber = jest.fn();

    store.subscribe(subscriber);
    store.state.count = 5;

    expect(subscriber).toHaveBeenCalledWith('count', 5, 0);
  });

  test('should allow unsubscribing', () => {
    const store = createStore({ count: 0 });
    const subscriber = jest.fn();

    const unsubscribe = store.subscribe(subscriber);
    unsubscribe();
    store.state.count = 5;

    expect(subscriber).not.toHaveBeenCalled();
  });

  test('should support multiple subscribers', () => {
    const store = createStore({ value: 'initial' });
    const sub1 = jest.fn();
    const sub2 = jest.fn();

    store.subscribe(sub1);
    store.subscribe(sub2);
    store.state.value = 'updated';

    expect(sub1).toHaveBeenCalledWith('value', 'updated', 'initial');
    expect(sub2).toHaveBeenCalledWith('value', 'updated', 'initial');
  });
});
