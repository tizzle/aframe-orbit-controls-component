## aframe-component-boilerplate

Boilerplate for creating and sharing [A-Frame](https://aframe.io) VR
[components](https://aframe.io/docs/core/component.html).

Note this refers to A-Frame components of the [entity-component
system](https://en.wikipedia.org/wiki/Entity_component_system), and not Web
Components.

The boilerplate comes with a stub component, test suite, examples
infrastructure with [Github pages](https://pages.github.com/), and stubbed
README, which begins below.

A path to using the boilerplate:

- Rename all instances of `example` and `Example` to your component name.
- Write your component.
- Write your unit tests.
- Build examples.
- Clean up this README.
- Publish to NPM (`npm publish`).
- Publish examples to Github pages (`npm run ghpages`).
- Share your component on [Slack](http://aframevr.slack.com/) and [awesome-aframe](https://github.com/aframevr/awesome-aframe)!

Example usage of the boilerplate:

- [aframe-layout-component](https://github.com/ngokevin/aframe-layout-component)
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
