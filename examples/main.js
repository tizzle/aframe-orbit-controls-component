var AFRAME = require('aframe');
var components = require('../index').components;
Object.keys(components).forEach(function (componentName) {
  AFRAME.registerComponent(componentName, components[componentName]);
});
