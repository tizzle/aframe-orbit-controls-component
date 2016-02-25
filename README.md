## aframe-component-boilerplate

Boilerplate for sharing [A-Frame](https://aframe.io) VR [components](https://aframe.io/docs/core/component.html):

- Stubbed component
- Stubbed README
- Examples
- [Github pages](https://pages.github.com/)

Steps:

1. `npm install && npm run name` to rename the placeholders to your component name.
2. Write your component.
3. Build examples (`npm run dev` to watch for changes to build example bundles).
4. Clean up this README.
5. `npm publish` and commit the `dist/` files.
6. `npm run ghpages`.
7. Share your component on [Slack](http://aframevr.slack.com/) and [awesome-aframe](https://github.com/aframevr/awesome-aframe)!

Example usage:

- [aframe-layout-component](https://github.com/ngokevin/aframe-layout-component)
- [aframe-text-component](https://github.com/ngokevin/aframe-text-component)
- [aframe-extrude-and-lathe](https://github.com/JosePedroDias/aframe-extrude-and-lathe)
- [aframe-obj-loader-component](https://github.com/donmccurdy/aframe-obj-loader-component)
- [aframe-physics-component](https://github.com/ngokevin/aframe-physics-component)
- [aframe-template-component](https://github.com/ngokevin/aframe-template-component)

Resources:

- [Tutorial](https://github.com/ngokevin/ngokevin/blob/master/content/blog/092-aframe_component.mkd)
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
  <script src="https://raw.githubusercontent.com/ngokevin/aframe-component-boilerplate/master/dist/aframe-example-component.min.js"></script>
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
require('aframe');
require('aframe-example-component');
```
