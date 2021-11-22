<div align="center">
  <h1>Storybook Poleaxe</h1>
  <br/>
  <img src="https://raw.githubusercontent.com/theKashey/storybook-addon-poleaxe/master/assets/logo.svg" alt="storybook a11y poleaxe" width="200" align="center">
  <br/>
  <br/>
   a11y axe 🪓 on a stick
  <br/> 
  <br/>
  <br/>

  <a href="https://www.npmjs.com/package/storybook-addon-poleaxe">
    <img src="https://img.shields.io/npm/v/storybook-addon-poleaxe.svg?style=flat-square" />
  </a>

  <a href="https://www.npmjs.com/package/storybook-addon-poleaxe">
   <img src="https://img.shields.io/npm/dm/storybook-addon-poleaxe.svg" alt="npm downloads">
  </a>
 <br/>
</div>

# Idea

Inspired by [HTML-tree](https://github.com/yoksel/html-tree)

## Provides:
- 👁 highlighting for Headings on the page, helping to understand their placement
- 🌳 tree view of a page structure, creating a capability to "see" your page as a glossary 

<img width="469" alt="Screen Shot 2021-11-22 at 7 49 35 pm" src="https://user-images.githubusercontent.com/582410/142830942-435d879b-e4ce-491d-999c-2c3e6a990015.png">

<img width="477" alt="Screen Shot 2021-11-22 at 7 49 56 pm" src="https://user-images.githubusercontent.com/582410/142830998-727fb77b-bc32-4732-98b9-35cf001a00e2.png">

# Installation
```js
// .storybook/main.js
module.exports = {
addons: [require.resolve('storybook-addon-poleaxe/preset')],
};
```

# Configuration
You can enable or disable highlighting by default for a specific story via story parameters
```js
HighlightedByDefault.parameters = {
  poleaxe: {
    highlighter: true,
  }
}
```

You can also control the behavior of `MutationObserver` 
```js
StaticStory.parameters = {
  poleaxe: {
    mutationObserver: true | false, // enabled of disabled for all
    mutationObserver: 'highlighter' | 'panel', // enabled only for some pieces
  }
}
```

# See also
- [HeadingsMap Chrome addon](https://chrome.google.com/webstore/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi?hl=en)
- [HTML tree](https://yoksel.github.io/html-tree/en/)

# License

MIT
