/**
 * @mtb-framework/parcel-transformer - Compiler
 * 
 * Compiles parsed .mtb components into JavaScript Web Components.
 * 
 * @copyright (c) 2024 Diego Vallejo
 * @license MIT
 */

import path from 'path';
import { parseScript } from './parser.js';

/**
 * Convert a filename to a valid custom element tag name.
 * 
 * @param {string} filePath - The file path
 * @returns {string} A valid custom element tag name
 */
function fileNameToTagName(filePath) {
  const baseName = path.basename(filePath, '.mtb');
  // Convert to kebab-case and ensure it has a hyphen
  const kebab = baseName
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();

  // Ensure name contains a hyphen (required for custom elements)
  if (!kebab.includes('-')) {
    return `mtb-${kebab}`;
  }
  return kebab;
}

/**
 * Convert a tag name to a valid JavaScript class name.
 * 
 * @param {string} tagName - The custom element tag name
 * @returns {string} A valid class name
 */
function tagNameToClassName(tagName) {
  return tagName
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * Escape special characters in a string for use in template literals.
 * 
 * @param {string} str - The string to escape
 * @returns {string} The escaped string
 */
function escapeTemplateString(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
}

/**
 * Transform template syntax to JavaScript template literals.
 * Converts ${prop} to ${this._props.prop} for property interpolation.
 * Converts @event="method" to data-mtb-event attribute.
 * 
 * @param {string} template - The template string
 * @param {Object} props - The props definition
 * @param {Object} methods - The methods definition
 * @returns {string} The transformed template
 */
function transformTemplate(template, props, methods) {
  if (!template) return '';

  let result = template;

  // Transform @event="method" syntax to data attributes
  // Matches @click="handleClick", @input="onInput", etc.
  const eventRegex = /@(\w+)="(\w+)"/g;
  const eventMappings = {};

  result = result.replace(eventRegex, (match, eventName, methodName) => {
    // Store event mapping
    if (!eventMappings[methodName]) {
      eventMappings[methodName] = [];
    }
    eventMappings[methodName].push(eventName);
    return `data-mtb-event='{"${eventName}":"${methodName}"}'`;
  });

  // Transform ${propName} to use this._props
  // Match ${identifier} but not ${this.something}
  result = result.replace(/\$\{(?!this\.)(\w+)\}/g, (match, propName) => {
    if (props[propName]) {
      return '${this._props.' + propName + '}';
    }
    return match;
  });

  return result;
}

/**
 * Compile a parsed .mtb component into JavaScript code.
 * 
 * @param {{template: string|null, style: string|null, script: string|null}} parsed - Parsed component
 * @param {string} filePath - The original file path
 * @returns {string} Compiled JavaScript code
 */
export function compile(parsed, filePath) {
  const tagName = fileNameToTagName(filePath);
  const className = tagNameToClassName(tagName);

  // Parse script content for props and methods
  const { props, methods } = parseScript(parsed.script);

  // Build properties definition
  const propsDefinition = Object.entries(props).map(([name, config]) => {
    const typeStr = config.type || 'String';
    const defaultStr = config.default !== undefined
      ? `, default: ${JSON.stringify(config.default)}`
      : '';
    return `    ${name}: { type: ${typeStr}${defaultStr} }`;
  }).join(',\n');

  // Build methods
  const methodsCode = Object.entries(methods).map(([name, config]) => {
    return `  ${name}(${config.params}) {\n    ${config.body}\n  }`;
  }).join('\n\n');

  // Transform template
  const transformedTemplate = transformTemplate(parsed.template, props, methods);
  const escapedTemplate = escapeTemplateString(transformedTemplate);

  // Escape styles
  const escapedStyles = escapeTemplateString(parsed.style);

  // Generate the JavaScript code
  const code = `import { MtbElement, defineComponent } from '@mtb-framework/core';

class ${className} extends MtbElement {
  static properties = {
${propsDefinition}
  };

${methodsCode}

  render() {
    return \`${escapedTemplate || ''}\`;
  }

  styles() {
    return \`${escapedStyles || ''}\`;
  }
}

defineComponent('${tagName}', ${className});

export default ${className};
`;

  return code;
}
