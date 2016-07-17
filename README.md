## aframe-orbit-controls-component

A (almost) direct port of the ThreeJS Orbit Controls for [A-Frame](https://aframe.io).

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|          |             |               |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.2.0/aframe.min.js"></script>
  <script src="https://rawgit.com/ngokevin/aframe-component-boilerplate/master/dist/aframe-example-component.min.js"></script>
</head>

<body>
    <a-entity id="camera" camera position="0 0 10" orbit-controls="target: #target;"></a-entity>

    <a-entity id="target" geometry="primitive: box" scale="1 1 1" position="0 0 0" material="color: #cc0000"></a-entity>
    <a-entity geometry="primitive: box" scale="1 1 1" position="8 0 0" material="color: #ffffff"></a-entity>
    <a-entity geometry="primitive: box" scale="1 1 1" position="-8 0 0" material="color: #ffffff"></a-entity>

    <a-sky color="#000000"></a-sky>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-example-component
```

Then register and use.

```js
require('aframe');
require('aframe-example-component');
```
