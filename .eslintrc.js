const webpackConf = require('./build/webpack.base.conf');
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/typescript/recommended',
    require.resolve('eslint-config-airbnb-base'),
  ],
  "parser": "vue-eslint-parser",
  settings: {
    'import/resolver': {
      // https://github.com/benmosher/eslint-plugin-import/issues/1396
      [require.resolve('eslint-import-resolver-node')]: {},
      [require.resolve('eslint-import-resolver-webpack')]: {
        config: webpackConf,
      },
    }
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  rules: {
    'import/extensions': ['error', 'always', {
      ts: 'never',
      js: 'never'
    }],
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e', // for e.returnvalue
      ],
    }],
  },
};
