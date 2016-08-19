## aframe-orbit-controls-component

A (almost) direct port of the ThreeJS Orbit Controls for [A-Frame](https://aframe.io).
Might be useful in responsive applications, to allow desktop users to rotate the camera around an object.

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|          |             |               |

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


