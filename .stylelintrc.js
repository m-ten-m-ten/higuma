const sortOrderSmacss = require('stylelint-config-property-sort-order-smacss/generate')

module.exports = {
  extends: [
    'stylelint-config-recommended-scss',
    'stylelint-prettier/recommended',
  ],
  plugins: ['stylelint-order'],
  rules: {
    'order/properties-order': [sortOrderSmacss()],
  },
}
