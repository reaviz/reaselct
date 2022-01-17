# reaselct
reaselct is a select component for ReactJS.

## 🚀 Quick Links
- [Docs and Demos](https://master--61dee6b62e6b2c004af20119.chromatic.com)

## 🪄 Features
- Single Select
- Multi Select
- Filtering
- Async
- Groups
- Tags
- Light and Dark Theme

## 📦 Usage
Install the package via NPM:

```
npm i reaselct --save
```

then use it like:

```tsx
import React, { FC, useState } from 'react';
import { Select } from 'reaselct';

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
