## aframe-component-boilerplate

Boilerplate for creating and sharing [A-Frame](https://aframe.io) VR
[components](https://aframe.io/docs/core/component.html).

The boilerplate comes with a stub component, test suite, examples
infrastructure with [Github pages](https://pages.github.com/), and stubbed
README. It frequently keeps up-to-date with the A-Frame API as things change.
Check out the [dev
branch](https://github.com/ngokevin/aframe-component-boilerplate/tree/dev) to
see the boilerplate following A-Frame's [dev
branch](https://github.com/aframevr/aframe/tree/dev).

General usage of the boilerplate:

- Rename all instances of `example` and `Example` to your component name.
- Write your component.
- Build examples (`npm run dev` to watch for changes to build example bundles).
- Clean up this README.
- Check `browser.js` and see if components are required and registered correctly. `browser.js`
is used to generate `dist` files.
- Publish to NPM (`npm publish`). This will also generate a browser distribution to commit.
- Publish examples to Github pages (`npm run ghpages`).
- Share your component on [Slack](http://aframevr.slack.com/) and [awesome-aframe](https://github.com/aframevr/awesome-aframe)!

Example usage of the boilerplate:

- [aframe-layout-component](https://github.com/ngokevin/aframe-layout-component)
- [aframe-text-component](https://github.com/ngokevin/aframe-text-component)
- [aframe-extrude-and-lathe](https://github.com/JosePedroDias/aframe-extrude-and-lathe)
- [aframe-obj-loader-component](https://github.com/donmccurdy/aframe-obj-loader-component)
- [aframe-physics-component](https://github.com/ngokevin/aframe-physics-component)

How to write a component:

- [Tutorial (WIP)](https://github.com/ngokevin/ngokevin/blob/master/content/blog/092-aframe_component.mkd)
- [Documentation](https://aframe.io/docs/core/component.html#Building_a_Component)

## aframe-example-component

An example component for [A-Frame](https://aframe.io) VR.

### Properties

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|          |             |               |

### Usage

#### Browser Installation

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/latest/aframe.min.js"></script>
  <script src="https://github.com/ngokevin/aframe-component-boilerplate/blob/master/dist/aframe-example-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity example="exampleProp: exampleVal"></a-entity>
  </a-scene>
</body>
```

#### NPM Installation

Install via NPM:

```bash
npm install aframe-example-component
```

Then register and use.

```js
var AFRAME = require('aframe-core');
var exampleComponent = require('aframe-example-component').component;
AFRAME.registerComponent('example', exampleComponent);
```
