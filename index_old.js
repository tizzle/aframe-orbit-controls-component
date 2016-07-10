/* global AFRAME */

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Example component for A-Frame.
 */
AFRAME.registerComponent('orbit-controls', {
    schema: {
        enabled: {
            type: 'boolean',
            default: true
        },
        target: {
            type: 'string',
            default: null
        },
        minDistance: {
            type: 'number',
            default: 0
        },
        maxDistance: {
            type: 'number',
            default: Infinity
        },
        minZoom: {
            type: 'number',
            default: 0
        },
        maxZoom: {
            type: 'number',
            default: Infinity
        },
        minPolarAngle: {
            type: 'number',
            default: 0
        },
        maxPolarAngle: {
            type: 'number',
            default: Math.PI
        },
        minAzimuthAngle: {
            type: 'number',
            default: Infinity
        },
        maxAzimuthAngle: {
            type: 'number',
            default: Infinity
        },
        enableDamping: {
            type: 'boolean',
            default: false
        },
        dampingFactor: {
            type: 'number',
            default: 0.25
        },
        enableZoom: {
            type: 'boolean',
            default: true
        },
        zoomSpeed: {
            type: 'number',
            default: 1.0
        },
        enableRotate: {
            type: 'boolean',
            default: true
        },
        rotateSpeed: {
            type: 'number',
            default: 1.0
        },
        enablePan: {
            type: 'boolean',
            default: true
        },
        keyPanSpeed: {
            type: 'number',
            default: 7.0
        },
        autoRotate: {
            type: 'boolean',
            default: false
        },
        autoRotateSpeed: {
            type: 'number',
            default: 2.0
        },
        enableKeys: {
            type: 'boolean',
            default: true
        },
        keys: {
            default: {
                LEFT: 37,
                UP: 38,
                RIGHT: 39,
                BOTTOM: 40
            }
        },
        mouseButtons: {
            default: {
                ORBIT: THREE.MOUSE.LEFT,
                ZOOM: THREE.MOUSE.MIDDLE,
                PAN: THREE.MOUSE.RIGHT
            }
        }
    },


    /**
     * Set if component needs multiple instancing.
     */
    multiple: false,

    /**
     * Called once when component is attached. Generally for initial setup.
     */
    init: function() {
        console.log( "data", this.data );

        // this.sceneEl = document.querySelector('a-scene');
        // console.log( "scene", this.sceneEl )
        //
        // this.canvasEl = document.querySelector('a-scene').canvas;
        // console.log( "canvas", this.canvasEl )

        this.target = new THREE.Vector3();

        // this.object = document.getElementById(this.data.target.replace('#', '')).object3D;
         this.object = this.el.object3D.children[0]

        console.log( 'object', this.object );

        this.target0 = this.target.clone();
        this.position0 = this.object.position.clone();
        this.zoom0 = this.object.zoom;

        this.changeEvent = {
            type: 'change'
        };

        this.startEvent = {
            type: 'start'
        };

        this.endEvent = {
            type: 'end'
        };

        this.STATE = {
            NONE: -1,
            ROTATE: 0,
            DOLLY: 1,
            PAN: 2,
            TOUCH_ROTATE: 3,
            TOUCH_DOLLY: 4,
            TOUCH_PAN: 5
        };

        this.state = this.STATE.NONE;

        this.EPS = 0.000001;

        // current position in spherical coordinates
        // console.log( 'three ', THREE );
        this.spherical = new THREE.Spherical();
        this.sphericalDelta = new THREE.Spherical();

        this.scale = 1;
        this.panOffset = new THREE.Vector3();
        this.zoomChanged = false;

        this.rotateStart = new THREE.Vector2();
        this.rotateEnd = new THREE.Vector2();
        this.rotateDelta = new THREE.Vector2();

        this.panStart = new THREE.Vector2();
        this.panEnd = new THREE.Vector2();
        this.panDelta = new THREE.Vector2();

        this.dollyStart = new THREE.Vector2();
        this.dollyEnd = new THREE.Vector2();
        this.dollyDelta = new THREE.Vector2();

        this.bindMethods();
    },

    /**
     * Called when component is attached and when component data changes.
     * Generally modifies the entity based on the data.
     */
    update: function(oldData) {

    },


    tick: function( t ) {
        updateView();
    }

    /**
     * Called when a component is removed (e.g., via removeAttribute).
     * Generally undoes all modifications to the entity.
     */
    remove: function() {
        this.removeEventListeners();
    },

    /**
     * update  the camera postion and rotation.
     */
    updateView: function() {

        console.log( 'tick' );
        var offset = new THREE.Vector3();

        // so camera.up is the orbit axis
        var quat = new THREE.Quaternion().setFromUnitVectors( this.object.up, new THREE.Vector3(0, 1, 0) );
        var quatInverse = quat.clone().inverse();

        var lastPosition = new THREE.Vector3();
        var lastQuaternion = new THREE.Quaternion();

        var position = this.object.position;

        offset.copy(position).sub( this.target );

        // rotate offset to "y-axis-is-up" space
        offset.applyQuaternion(quat);

        // angle from z-axis around y-axis
        this.spherical.setFromVector3(offset);

        if (this.data.autoRotate && this.state === STATE.NONE) {
            this.rotateLeft(getAutoRotationAngle());
        }

        this.spherical.theta += this.sphericalDelta.theta;
        this.spherical.phi += this.sphericalDelta.phi;

        // restrict theta to be between desired limits
        this.spherical.theta = Math.max( this.data.minAzimuthAngle, Math.min( this.data.maxAzimuthAngle, this.spherical.theta ) );

        // restrict phi to be between desired limits
        this.spherical.phi = Math.max( this.data.minPolarAngle, Math.min( this.data.maxPolarAngle, this.spherical.phi ) );
        this.spherical.makeSafe();
        this.spherical.radius *= this.scale;

        // restrict radius to be between desired limits
        this.spherical.radius = Math.max( this.data.minDistance, Math.min( this.data.maxDistance, this.spherical.radius));

        // move target to panned location
        this.target.add( this.panOffset );

        offset.setFromSpherical( this.spherical );

        // rotate offset back to "camera-up-vector-is-up" space
        offset.applyQuaternion( quatInverse );

        position.copy( this.target ).add( offset );
        this.object.lookAt( this.target );

        if ( this.data.enableDamping === true )
        {
            this.sphericalDelta.theta *= (1 - this.data.dampingFactor);
            this.sphericalDelta.phi *= (1 - this.data.dampingFactor);
        } else
        {
            this.sphericalDelta.set(0, 0, 0);
        }

        this.scale = 1;
        this.panOffset.set(0, 0, 0);

        // update condition is:
        // min(camera displacement, camera rotation in radians)^2 > EPS
        // using small-angle approximation cos(x/2) = 1 - x^2 / 8

        if ( this.zoomChanged || lastPosition.distanceToSquared( this.object.position ) > this.EPS || 8 * (1 - lastQuaternion.dot( this.object.quaternion ) ) > this.EPS )
        {
            // this.dispatchEvent( this.changeEvent );

            lastPosition.copy( this.object.position );
            lastQuaternion.copy( this.object.quaternion );
            this.zoomChanged = false;

            return true;

        }

        return false;

    },

    /**
     * Called when entity pauses.
     * Use to stop or remove any dynamic or background behavior such as events.
     */
    pause: function() {
        this.removeEventListeners()
    },

    /**
     * Called when entity resumes.
     * Use to continue or add any dynamic or background behavior such as events.
     */
    play: function() {
        console.log( 'play' );

        this.sceneEl = this.el.sceneEl;
        this.canvasEl = this.sceneEl.canvas;

        this.addEventListeners()
    },


    bindMethods: function () {
        this.onContextMenu = this.onContextMenu.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    },


    addEventListeners: function() {

        console.log( 'canvasEl', this.canvasEl );

        this.canvasEl.addEventListener('contextmenu', this.onContextMenu, false);

        this.canvasEl.addEventListener('mousedown', this.onMouseDown, false);
        this.canvasEl.addEventListener('mousewheel', this.onMouseWheel, false);
        this.canvasEl.addEventListener('MozMousePixelScroll', this.onMouseWheel, false); // firefox

        this.canvasEl.addEventListener('touchstart', this.onTouchStart, false);
        this.canvasEl.addEventListener('touchend', this.onTouchEnd, false);
        this.canvasEl.addEventListener('touchmove', this.onTouchMove, false);

        window.addEventListener('keydown', this.onKeyDown, false);
    },


    removeEventListeners: function() {
        var sceneEl = this.el.sceneEl;
        var canvasEl = sceneEl.canvas;

        this.canvasEl.removeEventListener('contextmenu', this.onContextMenu, false);
        this.canvasEl.removeEventListener('mousedown', this.onMouseDown, false);
        this.canvasEl.removeEventListener('mousewheel', this.onMouseWheel, false);
        this.canvasEl.removeEventListener('MozMousePixelScroll', this.onMouseWheel, false); // firefox

        this.canvasEl.removeEventListener('touchstart', this.onTouchStart, false);
        this.canvasEl.removeEventListener('touchend', this.onTouchEnd, false);
        this.canvasEl.removeEventListener('touchmove', this.onTouchMove, false);

        this.canvasEl.removeEventListener('mousemove', this.onMouseMove, false);
        this.canvasEl.removeEventListener('mouseup', this.onMouseUp, false);
        this.canvasEl.removeEventListener('mouseout', this.onMouseUp, false);

        window.removeEventListener('keydown', this.onKeyDown, false);

        //scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?
    },


    getAutoRotationAngle: function() {
        return 2 * Math.PI / 60 / 60 * this.data.autoRotateSpeed;
    },


    getZoomScale: function() {
        return Math.pow(0.95, this.data.zoomSpeed);
    },


    rotateLeft: function(angle) {
        this.sphericalDelta.theta -= angle;
    },


    rotateUp: function(angle) {
        this.sphericalDelta.phi -= angle;
    },


    panLeft: function() {
        var v = new THREE.Vector3();
        return function panLeft( distance, objectMatrix )
        {
            v.setFromMatrixColumn( objectMatrix, 0 ); // get X column of objectMatrix
            v.multiplyScalar( -distance );
            panOffset.add( v );
        };
    },


    panUp: function() {
        var v = new THREE.Vector3();
        return function panUp( distance, objectMatrix )
        {
            v.setFromMatrixColumn( objectMatrix, 1 ); // get Y column of objectMatrix
            v.multiplyScalar( distance );
            panOffset.add( v );
        };
    },


    // deltaX and deltaY are in pixels; right and down are positive
    pan: function() {

        var offset = new THREE.Vector3();

        return function( deltaX, deltaY )
        {
            var element = scope.domElement === document ? this.canvasEl.body : this.canvasEl;
            if ( this.object instanceof THREE.PerspectiveCamera )
            {
                // perspective
                var position = this.object.position;
                offset.copy( position ).sub( this.target );
                var targetDistance = offset.length();
                // half of the fov is center to top of screen
                targetDistance *= Math.tan(( this.object.fov / 2 ) * Math.PI / 180.0 );
                // we actually don't use screenWidth, since perspective camera is fixed to screen height
                panLeft(2 * deltaX * targetDistance / element.clientHeight, this.object.matrix);
                panUp(2 * deltaY * targetDistance / element.clientHeight, this.object.matrix);
            }
            else if ( this.object instanceof THREE.OrthographicCamera )
            {
                // orthographic
                panLeft(deltaX * ( this.object.right - this.object.left ) / this.object.zoom / element.clientWidth, this.object.matrix );
                panUp(deltaY * ( this.object.top - this.object.bottom ) / this.object.zoom / element.clientHeight, this.object.matrix);

            } else {

                // camera neither orthographic nor perspective
                console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
                this.data.enablePan = false;

            }

        };

    },

    dollyIn: function(dollyScale) {
        if ( this.object instanceof THREE.PerspectiveCamera )
        {
            this.scale /= dollyScale;
        }
        else if ( this.object instanceof THREE.OrthographicCamera )
        {
            this.object.zoom = Math.max( this.data.minZoom, Math.min( this.data.maxZoom, this.object.zoom * dollyScale));
            this.object.updateProjectionMatrix();
            this.zoomChanged = true;
        } else {

            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            this.data.enableZoom = false;
        }
    },


    dollyOut: function( dollyScale ) {
        if ( this.object instanceof THREE.PerspectiveCamera )
        {
            this.scale *= this.dollyScale;
        }
        else if ( this.object instanceof THREE.OrthographicCamera )
        {
            this.object.zoom = Math.max( this.data.minZoom, Math.min(this.data.maxZoom, this.object.zoom / this.dollyScale));
            this.object.updateProjectionMatrix();
            this.zoomChanged = true;
        }
        else
        {
            console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            this.data.enableZoom = false;
        }
    },

    //
    // event callbacks - update the object state
    //

    handleMouseDownRotate: function(event) {
        // console.log( 'handleMouseDownRotate', event.clientX, event.clientY );
        this.rotateStart.set( event.clientX, event.clientY );
    },


    handleMouseDownDolly: function(event) {
        //console.log( 'handleMouseDownDolly' );
        this.dollyStart.set( event.clientX, event.clientY );
    },


    handleMouseDownPan: function(event) {
        //console.log( 'handleMouseDownPan' );
        this.panStart.set( event.clientX, event.clientY );
    },


    handleMouseMoveRotate: function(event) {
        console.log( 'handleMouseMoveRotate' );
        this.rotateEnd.set( event.clientX, event.clientY );
        this.rotateDelta.subVectors( this.rotateEnd, this.rotateStart );

        // var element = this.canvasEl === document ? this.canvasEl.body : this.canvasEl;
        var element = document;

        // rotating across whole screen goes 360 degrees around
        this.rotateLeft(2 * Math.PI * this.rotateDelta.x / element.clientWidth * this.data.rotateSpeed);

        // rotating up and down along whole screen attempts to go 360, but limited to 180
        this.rotateUp(2 * Math.PI * this.rotateDelta.y / element.clientHeight * this.data.rotateSpeed);
        this.rotateStart.copy( this.rotateEnd );

        this.updateView();
    },


    handleMouseMoveDolly: function(event) {
        //console.log( 'handleMouseMoveDolly' );
        this.dollyEnd.set( event.clientX, event.clientY );
        this.dollyDelta.subVectors( this.dollyEnd, this.dollyStart );

        if ( this.dollyDelta.y > 0 ) {
            this.dollyIn( this.getZoomScale() );
        }
        else if ( dollyDelta.y < 0 ) {
            this.dollyOut( this.getZoomScale() );
        }

        this.dollyStart.copy( this.dollyEnd );
        this.updateView()
    },


    handleMouseMovePan: function(event) {
        //console.log( 'handleMouseMovePan' );
        this.panEnd.set( event.clientX, event.clientY );
        this.panDelta.subVectors( this.panEnd, this.panStart );
        this.pan( this.panDelta.x, this.panDelta.y );
        this.panStart.copy( this.panEnd );
        this.updateView();
    },


    handleMouseUp: function(event) {
        //console.log( 'handleMouseUp' );
    },


    handleMouseWheel: function(event) {
        //console.log( 'handleMouseWheel' );
        var delta = 0;
        if (event.wheelDelta !== undefined) {
            // WebKit / Opera / Explorer 9
            delta = event.wheelDelta;
        }
        else if ( event.detail !== undefined ) {
            // Firefox
            delta = -event.detail;
        }

        if ( delta > 0 ) {
            this.dollyOut( this.getZoomScale() );
        }
        else if ( delta < 0 ) {
            this.dollyIn( this.getZoomScale() );
        }

        this.updateView();
    },


    handleKeyDown: function(event) {
        //console.log( 'handleKeyDown' );
        switch ( event.keyCode ) {
            case this.data.keys.UP:
                this.pan(0, this.data.keyPanSpeed);
                this.updateView();
                break;
            case this.data.keys.BOTTOM:
                this.pan(0, -this.data.keyPanSpeed);
                this.updateView();
                break;
            case this.data.keys.LEFT:
                this.pan( this.data.keyPanSpeed, 0);
                this.updateView();
                break;
            case this.data.keys.RIGHT:
                this.pan(-this.data.keyPanSpeed, 0);
                this.updateView();
                break;
        }
    },


    handleTouchStartRotate: function(event) {
        //console.log( 'handleTouchStartRotate' );
        rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
    },


    handleTouchStartDolly: function(event) {
        //console.log( 'handleTouchStartDolly' );
        var dx = event.touches[0].pageX - event.touches[1].pageX;
        var dy = event.touches[0].pageY - event.touches[1].pageY;
        var distance = Math.sqrt(dx * dx + dy * dy);
        this.dollyStart.set(0, distance);
    },


    handleTouchStartPan: function(event) {
        //console.log( 'handleTouchStartPan' );
        this.panStart.set(event.touches[0].pageX, event.touches[0].pageY);
    },


    handleTouchMoveRotate: function(event) {
        //console.log( 'handleTouchMoveRotate' );
        this.rotateEnd.set( event.touches[0].pageX, event.touches[0].pageY );
        this.rotateDelta.subVectors( this.rotateEnd, this.rotateStart );

        var element = this.canvasEl === document ? scope.domElement.body : this.canvasEl;
        // rotating across whole screen goes 360 degrees around
        this.rotateLeft( 2 * Math.PI * this.rotateDelta.x / element.clientWidth * this.datarotateSpeed );
        // rotating up and down along whole screen attempts to go 360, but limited to 180
        this.rotateUp( 2 * Math.PI * this.rotateDelta.y / element.clientHeight * this.data.rotateSpeed );
        this.rotateStart.copy( this.rotateEnd );
        this.updateView();
    },


    handleTouchMoveDolly: function(event) {
        //console.log( 'handleTouchMoveDolly' );
        var dx = event.touches[0].pageX - event.touches[1].pageX;
        var dy = event.touches[0].pageY - event.touches[1].pageY;

        var distance = Math.sqrt(dx * dx + dy * dy);

        this.dollyEnd.set(0, distance);
        this.dollyDelta.subVectors( this.dollyEnd, this.dollyStart);
        if ( this.dollyDelta.y > 0 ) {
            this.dollyOut( this.getZoomScale() );
        } else if ( this.dollyDelta.y < 0 ) {
            this.dollyIn( this.getZoomScale() );
        }

        this.dollyStart.copy( this.dollyEnd );
        this.updateView();
    },


    handleTouchMovePan: function( event ) {
        //console.log( 'handleTouchMovePan' );
        this.panEnd.set( event.touches[0].pageX, event.touches[0].pageY );
        this.panDelta.subVectors( this.panEnd, this.panStart );
        this.pan( this.panDelta.x, this.panDelta.y );
        this.panStart.copy( this.panEnd );
        this.updateView();
    },


    handleTouchEnd: function(event) {
        //console.log( 'handleTouchEnd' );
    },

    //
    // event handlers - FSM: listen for events and reset state
    //

    onMouseDown: function(event)
    {
        // console.log( 'onMouseDown', event.button );

        if ( this.data.enabled === false ) return;
        event.preventDefault();

        if ( event.button === this.data.mouseButtons.ORBIT )
        {
            // console.log( 'ORBIT' );
            if ( this.data.enableRotate === false ) return;
            this.handleMouseDownRotate( event );
            this.state = this.STATE.ROTATE;
        }
        else if ( event.button === this.data.mouseButtons.ZOOM )
        {
            console.log( 'ZOOM' );
            if ( this.data.enableZoom === false ) return;
            this.handleMouseDownDolly( event );
            this.state = this.STATE.DOLLY;
        }
        else if ( event.button === this.data.mouseButtons.PAN )
        {
            console.log( 'PAN' );
            if ( this.data.enablePan === false) return;
            this.handleMouseDownPan( event );
            this.state = this.STATE.PAN;
        }
        if ( this.state !== this.STATE.NONE ) {
            console.log( "adding mouseMove and mouseUp events" );
            this.canvasEl.addEventListener('mousemove', this.onMouseMove, false);
            this.canvasEl.addEventListener('mouseup', this.onMouseUp, false);
            this.canvasEl.addEventListener('mouseout', this.onMouseUp, false);
            // dispatchEvent( this.startEvent );
        }
    },


    onMouseMove: function(event) {

        console.log( 'onMouseMove' );
        if (this.data.enabled === false) return;

        event.preventDefault();

        if ( this.state === this.STATE.ROTATE) {
            if ( this.data.enableRotate === false) return;
            this.handleMouseMoveRotate(event);
        }
        else if ( this.state === this.STATE.DOLLY ) {
            if (this.data.enableZoom === false) return;
            this.handleMouseMoveDolly(event);
        }
        else if (this.state === this.STATE.PAN) {
            if (this.data.enablePan === false) return;
            this.handleMouseMovePan(event);
        }
    },


    onMouseUp: function(event) {
        if (this.data.enabled === false) return;
        this.handleMouseUp(event);

        this.canvasEl.removeEventListener('mousemove', this.onMouseMove, false);
        this.canvasEl.removeEventListener('mouseup', this.onMouseUp, false);
        this.canvasEl.removeEventListener('mouseout', this.onMouseUp, false);
        // this.dispatchEvent( this.endEvent );
        this.state = this.STATE.NONE;
    },


    onMouseWheel: function(event) {
        if (this.data.enabled === false || this.data.enableZoom === false || ( this.state !== this.STATE.NONE && this.state !== this.STATE.ROTATE)) return;
        event.preventDefault();
        event.stopPropagation();
        this.handleMouseWheel(event);
        // this.dispatchEvent( this.startEvent ); // not sure why these are here...
        // this.dispatchEvent( this.endEvent );
    },


    onKeyDown: function(event) {
        if ( this.data.enabled === false || this.data.enableKeys === false || this.data.enablePan === false ) return;
        this.handleKeyDown( event );
    },


    onTouchStart: function(event) {
        if ( this.data.enabled === false ) return;

        switch (event.touches.length)
        {
            case 1: // one-fingered touch: rotate
                if ( this.data.enableRotate === false ) return;
                this.handleTouchStartRotate(event);
                this.state = this.STATE.TOUCH_ROTATE;
                break;
            case 2: // two-fingered touch: dolly
                if ( this.data.enableZoom === false ) return;
                this.handleTouchStartDolly(event);
                this.state = this.STATE.TOUCH_DOLLY;
                break;
            case 3: // three-fingered touch: pan
                if ( this.data.enablePan === false ) return;
                handleTouchStartPan( event );
                this.state = this.STATE.TOUCH_PAN;
                break;
            default:
                this.state = this.STATE.NONE;
        }

        if ( this.state !== this.STATE.NONE )
        {
            // this.dispatchEvent( this.startEvent );
        }
    },


    onTouchMove: function(event) {

        console.log( 'onTouchMove' );

        if ( this.data.enabled === false ) return;
        event.preventDefault();
        event.stopPropagation();
        switch (event.touches.length) {
            case 1: // one-fingered touch: rotate
                if ( this.enableRotate === false ) return;
                if ( this.state !== this.STATE.TOUCH_ROTATE ) return; // is this needed?...
                this.handleTouchMoveRotate(event);
                break;

            case 2: // two-fingered touch: dolly
                if ( this.data.enableZoom === false ) return;
                if ( this.state !== this.STATE.TOUCH_DOLLY ) return; // is this needed?...
                this.handleTouchMoveDolly(event);
                break;

            case 3: // three-fingered touch: pan
                if ( this.data.enablePan === false ) return;
                if ( this.state !== this.STATE.TOUCH_PAN ) return; // is this needed?...
                this.handleTouchMovePan(event);
                break;

            default:
                this.state = this.STATE.NONE;
        }

    },


    onTouchEnd: function(event) {

        if ( this.data.enabled === false ) return;
        this.handleTouchEnd(event);
        // this.dispatchEvent(endEvent);
        this.state = this.STATE.NONE;
    },


    onContextMenu: function(event) {
        event.preventDefault();
    }

});
