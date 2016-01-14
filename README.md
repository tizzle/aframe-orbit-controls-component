## aframe-keyboard-components

Keyboard components for [A-Frame](https://aframe.io) VR.

### Usage

#### Browser Installation

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>Keyboard Components</title>
  <script src="https://aframe.io/releases/latest/aframe.min.js"></script>
  <script src="https://github.com/ngokevin/aframe-keyboard-components/blob/master/dist/aframe-example-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity id="keyboard" keyboard></a-entity>
    <a-entity keyboard-output="#keyboard"></a-entity>
  </a-scene>
</body>
```

#### NPM Installation

Install via NPM:

```bash
npm install aframe-keyboard-components
```

Then register and use.

```js
var components = require('aframe-keyboard-components').components;
Object.keys(components).forEach(function (componentName) {
  AFRAME.registerComponent(componentName, components[componentName]);
});
```

### keyboard Component

| Property   | Description          | Default Value |
| --------   | -----------          | ------------- |
| characters | Keyboard characters. |               |

### keyboard-output Component

| Property Description  | Default Value |
| --------------------  | ------------- |
| Selector to keyboard. | null          |
