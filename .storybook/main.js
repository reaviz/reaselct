module.exports = {
  stories: ['../docs/**/*.story.mdx', '../docs/**/*.story.tsx'],
  addons: [
    'storybook-css-modules-preset',
    '@storybook/addon-storysource',
    '@storybook/addon-docs/preset',
    '@storybook/addon-essentials',
    'storybook-dark-mode'
  ]
};
