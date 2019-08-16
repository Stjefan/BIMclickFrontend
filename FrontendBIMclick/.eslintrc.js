module.exports = {
  root: true,

  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },

  env: {
    browser: true
  },

  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    '@vue/standard'
  ],

  // required to lint *.vue files
  plugins: [
    'vue'
  ],

  globals: {
    'ga': true, // Google Analytics
    'cordova': true,
    '__statics': true,
    'process': true
  },

  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow paren-less arrow functions
    'arrow-parens': 'off',
    'one-var': 'off',

    'import/first': 'off',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'prefer-promise-reject-errors': 'off',

    // MS added custom rules to end 'ESLint tyranny'
    // Base settings, see https://forum.quasar-framework.org/topic/3055/how-to-end-the-linter-s-tyranny/5
    'quotes': 0,
    'semi': 0,
    'space-infix-ops': 0,
    'indent': 0,
    'spaced-comment': 0,
    'eol-last': 0,
    'no-unused-vars': 0,
    'space-before-function-paren': 0,
    'space-unary-ops': 0,
    'key-spacing': 0,
    'comma-dangle': 'off',
    // See https://palantir.github.io/tslint/rules/no-trailing-whitespace/:
    'no-trailing-whitespace': 0,
    // Others, from various Stackoverflow hints
    'camelcase': 0,
    'no-new': 0,

    // allow console.log during development only
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}