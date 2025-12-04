/**
 * @mtb-framework/core - CommonJS entry point
 * 
 * @copyright (c) 2024 Diego Vallejo
 * @license MIT
 */

'use strict';

// Re-export from ES modules
// Note: This file is provided for CommonJS compatibility
// For best results, use ES modules import syntax

const { MtbElement, defineComponent } = require('./MtbElement.cjs');
const { reactive, computed, createStore } = require('./reactive.cjs');

module.exports = {
  MtbElement,
  defineComponent,
  reactive,
  computed,
  createStore
};
