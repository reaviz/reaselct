<div align="center">
  <h1>reaselct</h1>
  Select Component for React
  <br /><br />
  <a href="https://github.com/reaviz/reaselct/workflows/build/">
    <img src="https://github.com/reaviz/reaselct/workflows/build/badge.svg?branch=master" />
  </a>
  &nbsp;
  <a href="https://npm.im/reaselct">
    <img src="https://img.shields.io/npm/v/reaselct.svg" />
  </a>&nbsp;
  <a href="https://npm.im/reaselct">
    <img src="https://badgen.net/npm/dw/reaselct" />
  </a>&nbsp;
  <a href="https://github.com/reaviz/reaselct/blob/master/LICENSE">
    <img src="https://badgen.now.sh/badge/license/apache2" />
  </a>&nbsp;
  <a href="https://bundlephobia.com/result?p=reaselct">
    <img src="https://badgen.net/bundlephobia/minzip/reaselct" />
  </a>&nbsp;
  <a href="https://github.com/reaviz/reaselct">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/reaviz/reaselct?style=social" />
  </a>&nbsp;
  <a href="https://discord.gg/tt8wGExq35">
    <img src="https://img.shields.io/discord/773948315037073409?label=discord" />
  </a>
</div>

---

## 🚀 Quick Links
- View the [Docs and Demos](https://master--61dee6b62e6b2c004af20119.chromatic.com)
- Play with examples in [CodeSandbox](https://codesandbox.io/s/reaselct-6gv07)
- Learn about updates from the [changelog](CHANGELOG.md)

## 🪄 Features
- Single Select
- Multi Select
- Filtering with Fuzzy Search
- Async Support
- Groups Support
- Light and Dark Theme

## 📦 Usage
Install the package via NPM:

```
npm i reaselct --save
```

then use it like:

```tsx
import React, { FC, useState } from 'react';
import { Select, SelectOption } from 'reaselct';

const MyComponent: FC = () => {
  const [value, setValue] = useState<string | null>(null);
 
 return (
    <Select
      value={value}
      onChange={setValue}
    >
      <SelectOption value="facebook">facebook</SelectOption>
      <SelectOption value="twitter">twitter</SelectOption>
      <SelectOption value="twitch">twitch</SelectOption>
    </Select>
  );
};
```

## 🔭 Development
If you want to run `reaselct` locally, its super easy!

- Clone the repo
- `yarn install`
- `yarn start`
- Browser opens to Storybook page

## ❤️ Contributors
Thanks to all our contributors!

<a href="https://github.com/reaviz/realayers/graphs/contributors"><img src="https://opencollective.com/reaviz/contributors.svg?width=890" /></a>
