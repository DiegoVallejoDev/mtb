/**
 * Tests for @mtb-framework/parcel-transformer parser
 */

import { parse, parseScript } from '../src/parser.js';

describe('parse', () => {
  test('should extract template section', () => {
    const code = `
<template>
  <div>Hello</div>
</template>
`;
    const result = parse(code);
    expect(result.template).toBe('<div>Hello</div>');
  });

  test('should extract style section', () => {
    const code = `
<style>
  .btn { color: red; }
</style>
`;
    const result = parse(code);
    expect(result.style).toBe('.btn { color: red; }');
  });

  test('should extract script section', () => {
    const code = `
<script>
  export default {
    props: {}
  }
</script>
`;
    const result = parse(code);
    expect(result.script).toContain('export default');
  });

  test('should return null for missing sections', () => {
    const code = '<template><div></div></template>';
    const result = parse(code);

    expect(result.template).toBe('<div></div>');
    expect(result.style).toBeNull();
    expect(result.script).toBeNull();
  });

  test('should handle complete .mtb file', () => {
    const code = `
<template>
  <button class="btn">${'${text}'}</button>
</template>

<style>
  .btn { padding: 1rem; }
</style>

<script>
  export default {
    props: {
      text: { type: String, default: 'Click' }
    }
  }
</script>
`;
    const result = parse(code);

    expect(result.template).toContain('button');
    expect(result.style).toContain('.btn');
    expect(result.script).toContain('props');
  });
});

describe('parseScript', () => {
  test('should return empty objects for null input', () => {
    const result = parseScript(null);
    expect(result).toEqual({ props: {}, methods: {} });
  });

  test('should return empty objects for invalid script', () => {
    const result = parseScript('const x = 1;');
    expect(result).toEqual({ props: {}, methods: {} });
  });

  test('should parse props with type', () => {
    const script = `
export default {
  props: {
    variant: { type: String }
  }
}
`;
    const result = parseScript(script);
    expect(result.props.variant).toEqual({ type: 'String', default: undefined });
  });

  test('should parse props with type and default', () => {
    const script = `
export default {
  props: {
    variant: { type: String, default: 'primary' }
  }
}
`;
    const result = parseScript(script);
    expect(result.props.variant).toEqual({ type: 'String', default: 'primary' });
  });

  test('should parse multiple props', () => {
    const script = `
export default {
  props: {
    text: { type: String, default: 'Click' },
    disabled: { type: Boolean, default: false }
  }
}
`;
    const result = parseScript(script);
    expect(result.props.text).toBeDefined();
    expect(result.props.disabled).toBeDefined();
  });
});
