import builtins from 'builtin-modules';

// Rollup plugins
import commonjs from '@rollup/plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import autoExternals from 'rollup-plugin-peer-deps-external';

function createOutput(format) {
  return {
    dir: `dist/${format}`,
    format,
    sourcemap: true,
    preserveModules: true,
    exports: 'named',
    assetFileNames: '[name][extname]',
  };
}

export default {
  input: `src/index.ts`,

  output: [createOutput('cjs'), createOutput('es')],

  external: [...builtins],

  watch: {
    include: 'src/**',
  },

  plugins: [
    autoExternals({ includeDependencies: true }),

    commonjs({ include: /\**node_modules\**/ }),

    typescript({ useTsconfigDeclarationDir: true }),

    sourceMaps(),
  ],
};
