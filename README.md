## aframe-orbit-controls-component

A (almost) direct port of the ThreeJS Orbit Controls for [A-Frame](https://aframe.io).
Might be useful in responsive applications, to allow desktop users to rotate the camera around an object.

### API

| Property   | Description | Default Value |
| ---------- | ----------- | ------------- |
| enabled | Boolean – defines if the Orbit Controls are used | false
| target | String – the object the camera is looking at | '' |
| distance | Number – the distnace of the camera to the target | 1 |
| enableRotate | Boolean – defines if the camera can be rotated | true |
| rotateSpeed | Number – rotation speed | 1 |
| enableZoom | Boolean – defines if the camera can be zoomed in or out | true |
| zoomSpeed | Number – zoom speed | 1 |
| enablePan | Boolean – defines if the camera can be panned (using the arrow keys) | true |
| keyPanSpeed | Number – panning speed | 7 |
| enableDamping | Boolean – defines if the rotational movement of the camera is damped / eased | false |
| dampingFactor | Number – damping factor | 0.25 |
| autoRotate | Boolean – defines if the camera automatically rotates around the target | false |
| autoRotateSpeed | Number – speed of the automatic rotation | 2 |
| enableKeys | Boolean – defines if the keyboard can be used | true |
| minAzimuthAngle | Number – minimum azimuth angle | -Infinity |
| maxAzimuthAngle | Number – maximum azimuth angle | Infinity |
| minPolarAngle | Number – minimum polar angle | 0 |
| maxPolarAngle | Number – maximum polar angle | Math.PI |
| minZoom | Number – minimum zoom value | 0 |
| maxZoom | Number – maximum zoom value | Infinity |
| minDistance | Number – minimum distance | 0 |
| maxDistance | Number – maximum distance | Infinity |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>A-Frame using a Camera with Orbit Controls</title>
  <script src="https://aframe.io/releases/0.3.0/aframe.min.js"></script>
  <script src="https://cdn.rawgit.com/tizzle/aframe-orbit-controls-component/master/dist/aframe-orbit-controls-component.min.js"></script>
</head>

<body>
    <a-scene>

        <a-entity
            id="camera"
            camera
            position="0 0 5"
            orbit-controls="
                autoRotate: false;
                target: #target;
                enableDamping: true;
                dampingFactor: 0.125;
                rotateSpeed:0.25;
                minDistance:3;
                maxDistance:100;"
            mouse-cursor="">
        </a-entity>


        <a-entity id="target" geometry="primitive: box" scale="1 1 1" position="0 0 0" material="color: #cc0000"></a-entity>
        <a-entity geometry="primitive: box" scale="1 1 1" position="8 0 0" material="color: #ffffff"></a-entity>
        <a-entity geometry="primitive: box" scale="1 1 1" position="-8 0 0" material="color: #ffffff"></a-entity>
        <a-entity geometry="primitive: box" scale="1 1 1" position="16 0 0" material="color: #ffffff"></a-entity>
        <a-entity geometry="primitive: box" scale="1 1 1" position="-16 0 0" material="color: #ffffff"></a-entity>

        <a-sky color="#000000"></a-sky>

    </a-scene>
</body>
```


#### npm

Install via npm:

```bash
npm install aframe-orbit-controls-component
```

Then register and use.

```js
require('aframe');
require('aframe-orbit-controls-component');
```
