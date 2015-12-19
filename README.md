## aframe-component-boilerplate

Boilerplate for creating and sharing [A-Frame](https://aframe.io) VR
[components](https://aframe.io/docs/core/component.html).

The boilerplate comes with a stub component, test suite, examples
infrastructure with [Github pages](https://pages.github.com/), and stubbed
README, which begins below.

A path to using the boilerplate:

- Rename all instances of `example` and `Example` to your component name.
- Write your component.
- Write your unit tests.
- Write examples.
- Remove the boilerplate instructions of this README and everything at the bottom.
- Publish to NPM.
- Share your component on [Slack](http://aframevr.slack.com/) and [awesome-aframe](https://github.com/aframevr/awesome-aframe)!

Example usage of the boilerplate:

- [aframe-layout](https://github.com/ngokevin/aframe-layout)
- [aframe-text-component](https://github.com/ngokevin/aframe-text-component)

## aframe-example-component

An example component for [A-Frame](https://aframe.io) VR.

### Usage

Install.

```bash
npm install aframe-example-component
```

Register.

```js
var exampleComponent = require('aframe-example-component').component;
require('aframe-core').registerComponent('example', exampleComponent);
```

Use.

```html
<a-scene>
  <a-entity example="exampleProp: exampleVal"></a-entity>
</a-scene>
```

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|          |             |               |
