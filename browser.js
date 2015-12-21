// Browser distrubution of the A-Frame component.
(function () {
  if (!AFRAME) {
    console.error('Component attempted to register before AFRAME was available.');
    return;
  }
  // Register all components here.
  AFRAME.registerComponent(require('./index').component);
})();
