/**
 * @mtb/parcel-transformer - Parser
 * 
 * Parses .mtb single-file component syntax into structured data.
 * 
 * @copyright (c) 2024 Diego Vallejo
 * @license MIT
 */

/**
 * Extract content between opening and closing tags.
 * 
 * @param {string} content - The full file content
 * @param {string} tagName - The tag name to extract (template, style, script)
 * @returns {string|null} The extracted content or null if not found
 */
function extractTag(content, tagName) {
  const openTagRegex = new RegExp(`<${tagName}[^>]*>`, 'i');
  const closeTagRegex = new RegExp(`</${tagName}>`, 'i');
  
  const openMatch = content.match(openTagRegex);
  if (!openMatch) {
    return null;
  }
  
  const openTagEnd = openMatch.index + openMatch[0].length;
  const closeMatch = content.slice(openTagEnd).match(closeTagRegex);
  
  if (!closeMatch) {
    return null;
  }
  
  return content.slice(openTagEnd, openTagEnd + closeMatch.index).trim();
}

/**
 * Parse a .mtb file into its component parts.
 * 
 * @param {string} code - The .mtb file content
 * @returns {{template: string|null, style: string|null, script: string|null}}
 */
export function parse(code) {
  return {
    template: extractTag(code, 'template'),
    style: extractTag(code, 'style'),
    script: extractTag(code, 'script')
  };
}

/**
 * Parse the script section to extract component definition.
 * 
 * @param {string} scriptContent - The content of the script tag
 * @returns {{props: Object, methods: Object}}
 */
export function parseScript(scriptContent) {
  if (!scriptContent) {
    return { props: {}, methods: {} };
  }

  // Extract export default object
  const exportMatch = scriptContent.match(/export\s+default\s*\{([\s\S]*)\}/);
  if (!exportMatch) {
    return { props: {}, methods: {} };
  }

  const result = { props: {}, methods: {} };
  const objectContent = exportMatch[1];
  
  // Parse props section - find props: { ... } with nested braces
  const propsStartMatch = objectContent.match(/props\s*:\s*\{/);
  if (propsStartMatch) {
    const propsStart = propsStartMatch.index + propsStartMatch[0].length;
    // Find matching closing brace
    let depth = 1;
    let i = propsStart;
    while (i < objectContent.length && depth > 0) {
      if (objectContent[i] === '{') depth++;
      if (objectContent[i] === '}') depth--;
      i++;
    }
    const propsContent = objectContent.slice(propsStart, i - 1);
    
    // Match individual prop definitions
    const propRegex = /(\w+)\s*:\s*\{\s*type\s*:\s*(\w+)(?:\s*,\s*default\s*:\s*(?:'([^']*)'|"([^"]*)"|(\w+)))?\s*\}/g;
    let match;
    while ((match = propRegex.exec(propsContent)) !== null) {
      const [, name, type, singleQuote, doubleQuote, bareValue] = match;
      const defaultValue = singleQuote ?? doubleQuote ?? bareValue;
      result.props[name] = {
        type: type,
        default: defaultValue
      };
    }
  }

  // Parse methods section
  const methodsStartMatch = objectContent.match(/methods\s*:\s*\{/);
  if (methodsStartMatch) {
    const methodsStart = methodsStartMatch.index + methodsStartMatch[0].length;
    // Find matching closing brace
    let depth = 1;
    let i = methodsStart;
    while (i < objectContent.length && depth > 0) {
      if (objectContent[i] === '{') depth++;
      if (objectContent[i] === '}') depth--;
      i++;
    }
    const methodsContent = objectContent.slice(methodsStart, i - 1);
    
    // Match method definitions
    const methodRegex = /(\w+)\s*\(\s*([^)]*)\s*\)\s*\{([\s\S]*?)\n\s*\}/g;
    let match;
    while ((match = methodRegex.exec(methodsContent)) !== null) {
      const [, name, params, body] = match;
      result.methods[name] = {
        params: params.trim(),
        body: body.trim()
      };
    }
  }

  return result;
}
