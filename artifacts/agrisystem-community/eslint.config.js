// eslint.config.js
// Agrisystems Community — ESLint flat config
// This app targets Nigerian English speakers as its primary market.
// Full i18n with translation keys is a future roadmap item.
// The i18n enforcement rule is disabled until that work is prioritised.

export default [
  {
    rules: {
      // Disabled: app is English-only for the initial Nigerian-market MVP.
      // i18n support is on the product roadmap.
      'i18next/no-literal-string': 'off',
    },
  },
];
