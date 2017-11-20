## aframe-orbit-controls-component

A (almost) direct port of the ThreeJS Orbit Controls for [A-Frame](https://aframe.io).
It allows users to rotate the camera around an object. Might be useful as a fallback to VR mode. Automatically switches to look-controls in VR mode.

Have a look at the [examples](https://tizzle.github.io/aframe-orbit-controls-component/)

### API

| Property   | Description | Default Value |
| ---------- | ----------- | ------------- |
| enabled | Boolean – defines if the Orbit Controls are used | false
| target | String – the object the camera is looking at and orbits around | '' |
| distance | Number – the distance of the camera to the target | 1 |
| enableRotate | Boolean – defines if the camera can be rotated | true |
| rotateSpeed | Number – rotation speed | 1 |
| enableZoom | Boolean – defines if the camera can be zoomed in or out | true |
| invertZoom | Boolean – defines if zooming is inverted | false |
| zoomSpeed | Number – zoom speed | 1 |
| enablePan | Boolean – defines if the camera can be panned (using the arrow keys) | true |
| keyPanSpeed | Number – panning speed | 7 |
| enableDamping | Boolean – defines if the rotational movement of the camera is damped / eased | false |
| dampingFactor | Number – damping factor | 0.25 |
| autoRotate | Boolean – defines if the camera automatically rotates around the target | false |
| autoRotateSpeed | Number – speed of the automatic rotation | 2 |
| enableKeys | Boolean – defines if the keyboard can be used | true |
| minAzimuthAngle | Number – minimum azimuth angle – Defines how far you can orbit horizontally, lower limit | -Infinity |
| maxAzimuthAngle | Number – maximum azimuth angle – Defines how far you can orbit horizontally, upper limit | Infinity |
| minPolarAngle | Number – minimum polar angle – Defines how far you can orbit vertically, lower limit | 0 |
| maxPolarAngle | Number – maximum polar angle – Defines how far you can orbit vertically, upper limit | Math.PI |
| minZoom | Number – minimum zoom value – Defines how far you can zoom out for Orthographic Cameras | 0 |
| maxZoom | Number – maximum zoom value – Defines how far you can zoom in for Orthographic Cameras | Infinity |
| minDistance | Number – minimum distance – Defines how far you can zoom in for Perspective Cameras | 0 |
| maxDistance | Number – maximum distance – Defines how far you can zoom out for Perspective Cameras | Infinity |
| rotateTo | Vector3 – position to rotate automatically to | {x:0,y:0,z:0} |
| rotateToSpeed | Number – rotateTo speed | 0.05 |
| logPosition | Boolean – prints out camera position to console.log() when rotating | true |
| autoVRLookCam | Boolean - automatically switch over to look-controls in VR mode? | true |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>A-Frame using a Camera with Orbit Controls</title>
  <script src="https://aframe.io/releases/0.5.0/aframe.min.js"></script>
  <script src="https://cdn.rawgit.com/tizzle/aframe-orbit-controls-component/v0.1.14/dist/aframe-orbit-controls-component.min.js"></script>
</head>

<body>
    <a-scene>

      <a-entity
          id="camera"
          camera="fov: 80; zoom: 1;"
          position="0 2 5"
          orbit-controls="
              autoRotate: false;
              target: #target;
              enableDamping: true;
              dampingFactor: 0.125;
              rotateSpeed:0.25;
              minDistance:3;
              maxDistance:100;
              "
          mouse-cursor="">
          <a-entity geometry="primitive:cone; radius-bottom:1; radius-top:0" scale=".33 1 .33" position="0 0 0" rotation="90 0 0" material="color: #0099ff; transparent: true; opacity:0.5"></a-entity>
      </a-entity>

      <a-entity id="target">
          <a-box id="box" position="-1 0.5 1" rotation="0 45 0" color="#4CC3D9"></a-box>
          <a-sphere id="sphere" position="0 1.25 -1" radius="1.25" color="#EF2D5E"></a-sphere>
          <a-cylinder id="cylinder" position="1 0.75 1" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
          <a-plane position="0 0 0" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
      </a-entity>

      <a-sky color="#ECECEC"></a-sky>

    </a-scene>
</body>
```


#### npm

Install via npm:

```bash
npm install aframe-orbit-controls-component-2
```

Then register and use.

```js
require('aframe');
require('aframe-orbit-controls-component-2');
```

Alternatively, include as a `<script>` tag:
```
<script src="https://cdn.rawgit.com/tizzle/aframe-orbit-controls-component/v0.1.14/dist/aframe-orbit-controls-component.min.js"></script>
```
When the user enters VR mode, `orbit-controls` will pause itself and switch to the `look-controls` attached to the same camera. If no `look-controls` is specified on the current camera, one will be created with the default settings (this usually works fine). If you do not want this behaviour (probably becuase you want to control the camera juggling behaviour yourself) just specify `autoVRLookCam:false`.
