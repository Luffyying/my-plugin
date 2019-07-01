import vue from 'rollup-plugin-vue';
import commonjs from 'rollup-plugin-commonjs';
export default {
    input: 'src/index.js',
    output: {
      name:'vtable',
      file: 'dist/vue-schema-table.js',
      format: 'umd'
    },
    plugins:[
        commonjs(),
        vue()
    ],
    name: 'vtable',
    watch: {
      include: 'src/**'
    }
  };