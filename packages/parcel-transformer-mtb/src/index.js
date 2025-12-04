/**
 * @mtb-framework/parcel-transformer
 * 
 * Parcel transformer plugin for .mtb Web Components.
 * Transforms .mtb single-file components into JavaScript Web Components.
 * 
 * @copyright (c) 2024 Diego Vallejo
 * @license MIT
 */

import { Transformer } from '@parcel/plugin';
import { parse } from './parser.js';
import { compile } from './compiler.js';

export default new Transformer({
  async transform({ asset }) {
    const code = await asset.getCode();
    const parsed = parse(code);
    const compiled = compile(parsed, asset.filePath);

    asset.type = 'js';
    asset.setCode(compiled);

    return [asset];
  }
});
