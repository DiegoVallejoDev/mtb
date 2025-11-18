/* 
 * Copyright (c) 2021 Diego Valejo.
 * Component props parser and interpolator for mtb.js
 */

class PropsParser {
    /**
     * Parse component tag with props
     * Example: {{button text="Click Me" class="primary"}}
     * @param {string} componentTag - Component tag string
     * @returns {object} Object with componentName and props
     */
    static parse(componentTag) {
        // Remove {{ and }}
        const inner = componentTag.slice(2, -2).trim();
        
        // Split by whitespace to get component name and props string
        const parts = inner.split(/\s+/);
        const componentName = parts[0];
        
        if (parts.length === 1) {
            // No props
            return { componentName, props: {} };
        }
        
        // Join remaining parts and parse props
        const propsString = parts.slice(1).join(' ');
        const props = this.parseProps(propsString);
        
        return { componentName, props };
    }

    /**
     * Parse props string into object
     * Example: 'text="Click Me" class="primary" disabled=true'
     * @param {string} propsString - Props string
     * @returns {object} Props object
     */
    static parseProps(propsString) {
        const props = {};
        
        // Match prop="value", prop='value', or prop=value patterns
        const propPattern = /(\w+)=(?:"([^"]*)"|'([^']*)'|(\w+))/g;
        let match;
        
        while ((match = propPattern.exec(propsString)) !== null) {
            const key = match[1];
            const value = match[2] || match[3] || match[4];
            
            // Convert boolean strings
            if (value === 'true') {
                props[key] = true;
            } else if (value === 'false') {
                props[key] = false;
            } else if (!isNaN(value) && value !== '') {
                // Convert numeric strings
                props[key] = Number(value);
            } else {
                props[key] = value;
            }
        }
        
        return props;
    }

    /**
     * Interpolate props into component content
     * Replaces ${propName} with actual values
     * @param {string} content - Component content
     * @param {object} props - Props object
     * @returns {string} Interpolated content
     */
    static interpolate(content, props) {
        if (!props || Object.keys(props).length === 0) {
            return content;
        }
        
        let result = content;
        
        for (const [key, value] of Object.entries(props)) {
            // Replace ${propName} with actual value
            const pattern = new RegExp(`\\$\\{${key}\\}`, 'g');
            result = result.replace(pattern, String(value));
        }
        
        return result;
    }

    /**
     * Check if a component tag has props
     * @param {string} componentTag - Component tag string
     * @returns {boolean} True if tag has props
     */
    static hasProps(componentTag) {
        const inner = componentTag.slice(2, -2).trim();
        return inner.includes(' ') && inner.includes('=');
    }
}

module.exports = PropsParser;
