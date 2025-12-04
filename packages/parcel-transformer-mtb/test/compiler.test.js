/**
 * Tests for @mtb-framework/parcel-transformer compiler
 */

import { compile } from '../src/compiler.js';

describe('compile', () => {
  test('should generate valid JavaScript class', () => {
    const parsed = {
      template: '<div>Hello</div>',
      style: '.container { color: red; }',
      script: `
export default {
  props: {
    title: { type: String, default: 'Default' }
  }
}
`
    };

    const result = compile(parsed, '/path/to/my-component.mtb');

    expect(result).toContain("import { MtbElement, defineComponent } from '@mtb-framework/core'");
    expect(result).toContain('class MyComponent extends MtbElement');
    expect(result).toContain("defineComponent('my-component', MyComponent)");
  });

  test('should convert filename to kebab-case tag name', () => {
    const parsed = { template: '<div></div>', style: '', script: '' };

    const result = compile(parsed, '/path/to/MyAwesomeButton.mtb');

    expect(result).toContain("defineComponent('my-awesome-button'");
  });

  test('should add mtb- prefix to simple names', () => {
    const parsed = { template: '<div></div>', style: '', script: '' };

    const result = compile(parsed, '/path/to/button.mtb');

    expect(result).toContain("defineComponent('mtb-button'");
  });

  test('should preserve kebab-case names with hyphen', () => {
    const parsed = { template: '<div></div>', style: '', script: '' };

    const result = compile(parsed, '/path/to/my-button.mtb');

    expect(result).toContain("defineComponent('my-button'");
  });

  test('should include properties definition', () => {
    const parsed = {
      template: '<button>${variant}</button>',
      style: '',
      script: `
export default {
  props: {
    variant: { type: String, default: 'primary' }
  }
}
`
    };

    const result = compile(parsed, '/test/mtb-button.mtb');

    expect(result).toContain('static properties');
    expect(result).toContain('variant');
    expect(result).toContain('String');
  });

  test('should transform @event syntax to data attribute', () => {
    const parsed = {
      template: '<button @click="handleClick">Click</button>',
      style: '',
      script: `
export default {
  props: {},
  methods: {
    handleClick(e) {
      this.emit('click', e);
    }
  }
}
`
    };

    const result = compile(parsed, '/test/mtb-button.mtb');

    expect(result).toContain('data-mtb-event');
    expect(result).toContain('click');
    expect(result).toContain('handleClick');
  });

  test('should escape backticks in template', () => {
    const parsed = {
      template: '<code>`template literal`</code>',
      style: '',
      script: ''
    };

    const result = compile(parsed, '/test/my-code.mtb');

    expect(result).toContain('\\`template literal\\`');
  });

  test('should handle empty component', () => {
    const parsed = {
      template: null,
      style: null,
      script: null
    };

    const result = compile(parsed, '/test/mtb-empty.mtb');

    expect(result).toContain('class MtbEmpty extends MtbElement');
    expect(result).toContain('render()');
    expect(result).toContain('styles()');
  });
});
