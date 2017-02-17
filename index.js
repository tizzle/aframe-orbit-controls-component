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
            default: true
        },
        target: {
            default: ''
        },
        distance: {
            default: 1
        },
        enableRotate: {
            default: true
        },
        rotateSpeed: {
            default: 1.0
        },
        enableZoom: {
            default: true
        },
        zoomSpeed: {
            default: 1.0
        },
        enablePan: {
            default: true
        },
        keyPanSpeed: {
            default: 7.0
        },
        enableDamping: {
            default: false
        },
        dampingFactor: {
            default: 0.25
        },
        autoRotate: {
            default: false
        },
        autoRotateSpeed: {
            default: 2.0
        },
        enableKeys: {
            default: true
        },
        minAzimuthAngle: {
            default: -Infinity
        },
        maxAzimuthAngle: {
            default: Infinity
        },
        minPolarAngle: {
            default: 0
        },
        maxPolarAngle: {
            default: Math.PI
        },
        minZoom: {
            default: 0
        },
        maxZoom: {
            default: Infinity
        },
        minDistance: {
            default: 0
        },
        maxDistance: {
            default: Infinity
        },
    },

    /**
     * Set if component needs multiple instancing.
     */
    multiple: false,

    /**
     * Called once when component is attached. Generally for initial setup.
     */
    init: function()
    {
        this.STATE = { NONE : - 1, ROTATE : 0, DOLLY : 1, PAN : 2, TOUCH_ROTATE : 3, TOUCH_DOLLY : 4, TOUCH_PAN : 5 };
        this.state = this.STATE.NONE;

        this.EPS = 0.000001;

        this.spherical = new THREE.Spherical();
        this.sphericalDelta = new THREE.Spherical();

        this.scale = 1.0;
    	this.zoomChanged = false;

        this.rotateStart = new THREE.Vector2();
        this.rotateEnd = new THREE.Vector2();
        this.rotateDelta = new THREE.Vector2();

        this.panStart = new THREE.Vector2();
    	this.panEnd = new THREE.Vector2();
    	this.panDelta = new THREE.Vector2();
        this.panOffset = new THREE.Vector3();

    	this.dollyStart = new THREE.Vector2();
        this.dollyEnd = new THREE.Vector2();
    	this.dollyDelta = new THREE.Vector2();

        this.vector = new THREE.Vector3();

        this.mouseButtons = {
            ORBIT: THREE.MOUSE.LEFT,
            ZOOM: THREE.MOUSE.MIDDLE,
            PAN: THREE.MOUSE.RIGHT
        };

        this.keys = {
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            BOTTOM: 40
        };

        this.bindMethods();
    },

    /**
     * Called when component is attached and when component data changes.
     * Generally modifies the entity based on the data.
     */
    update: function(oldData) {},

    /**
     * Called when a component is removed (e.g., via removeAttribute).
     * Generally undoes all modifications to the entity.
     */
    remove: function() {},

    /**
     * Called on each scene tick.
     */
    tick: function(t)
    {
        this.updateView();
    },

    /**
     * Called when entity pauses.
     * Use to stop or remove any dynamic or background behavior such as events.
     */
    pause: function() {
        this.removeEventListeners();
    },

    /**
     * Called when entity resumes.
     * Use to continue or add any dynamic or background behavior such as events.
     */
    play: function() {
        // console.log( "play");

        this.sceneEl = this.el.sceneEl;
        this.object = this.el.object3D;

        this.targetEl = this.sceneEl.querySelector( this.data.target );
        this.target3D = this.targetEl.object3D;
        this.target = this.target3D.position.clone();

        var camera, cameraType;
        this.object.traverse( function( child )
        {
            if( child instanceof THREE.PerspectiveCamera )
            {
                camera = child;
                cameraType = 'PerspectiveCamera';
            }
            else if ( child instanceof THREE.OrthographicCamera )
            {
                camera = child;
                cameraType = 'OrthographicCamera';
            }
            else {
                camera = undefined;
                cameraType = 'undefined';
            }
        } );

        this.camera = camera;
        this.cameraType = cameraType;

        // console.log( 'targetObject', this.target3D );
        // console.log( 'target', this.target );
        // console.log( 'camera', this.cameraType, this.camera );
        // 0.3.0
        this.sceneEl.addEventListener('render-target-loaded', this.handleRenderTargetLoaded.bind(this) );

        if( this.canvasEl ) this.addEventListeners();
    },


    handleRenderTargetLoaded: function()
	{
	    this.canvasEl = this.sceneEl.canvas;
		this.addEventListeners();
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
    },



// EVENT LISTENERS //

    // CONTEXT MENU

    onContextMenu: function(event) {
        event.preventDefault();
    },


    // MOUSE

    onMouseDown: function(event) {

        if( this.data.enabled === false ) return;

        if ( event.button === this.mouseButtons.ORBIT )
        {
            this.panOffset.set( 0, 0, 0 );
			if ( this.data.enableRotate === false ) return;
			this.handleMouseDownRotate( event );
			this.state = this.STATE.ROTATE;
		}
        else if ( event.button === this.mouseButtons.ZOOM )
        {
            this.panOffset.set( 0, 0, 0 );
            if ( this.data.enableZoom === false ) return;
            this.handleMouseDownDolly( event );
            this.state = this.STATE.DOLLY;
        }
        else if ( event.button === this.mouseButtons.PAN )
        {
            if ( this.data.enablePan === false ) return;
            this.handleMouseDownPan( event );
            this.state = this.STATE.PAN;
        }

        if ( this.state !== this.STATE.NONE ) {
			this.canvasEl.addEventListener( 'mousemove', this.onMouseMove, false );
			this.canvasEl.addEventListener( 'mouseup', this.onMouseUp, false );
			this.canvasEl.addEventListener( 'mouseout', this.onMouseUp, false );

            this.el.emit('start-drag-orbit-controls', null, false);
		}
    },


    onMouseMove: function(event) {
        // console.log('onMouseMove');

        if( this.data.enabled === false ) return;

        event.preventDefault();

        if ( this.state === this.STATE.ROTATE ) {
			if ( this.data.enableRotate === false ) return;
			this.handleMouseMoveRotate( event );
		}
        else if ( this.state === this.STATE.DOLLY ) {
			if ( this.data.enableZoom === false ) return;
			this.handleMouseMoveDolly( event );
		}
        else if ( this.state === this.STATE.PAN ) {
			if ( this.data.enablePan === false ) return;
			this.handleMouseMovePan( event );
		}
    },


    onMouseUp: function(event) {

        if( this.data.enabled === false ) return;

        event.preventDefault();
        event.stopPropagation();

		this.handleMouseUp( event );

		this.canvasEl.removeEventListener( 'mousemove', this.onMouseMove, false );
		this.canvasEl.removeEventListener( 'mouseup', this.onMouseUp, false );
		this.canvasEl.removeEventListener( 'mouseout', this.onMouseUp, false );

		this.state = this.STATE.NONE;

        this.el.emit('end-drag-orbit-controls', null, false);
    },


    // MOUSE WHEEL

    onMouseWheel: function(event) {
        if (this.data.enabled === false || this.data.enableZoom === false || ( this.state !== this.STATE.NONE && this.state !== this.STATE.ROTATE)) return;
        event.preventDefault();
        event.stopPropagation();
        this.handleMouseWheel(event);
    },


    // TOUCH

    onTouchStart: function(event)
    {

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
                this.handleTouchStartPan( event );
                this.state = this.STATE.TOUCH_PAN;
                break;
            default:
                this.state = this.STATE.NONE;
        }

        if ( this.state !== this.STATE.NONE )
        {
            // this.canvasEl.emit('startDragOrbitControls');
            this.el.emit('start-drag-orbit-controls', null, false);
        }
    },


    onTouchMove: function(event) {
        // console.log('onTouchMove');

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
        // console.log('onTouchEnd');

        if ( this.data.enabled === false ) return;

        this.handleTouchEnd(event);

        // this.canvasEl.emit('endDragOrbitControls');
        this.el.emit('end-drag-orbit-controls', null, false);

        this.state = this.STATE.NONE;
    },


    // KEYBOARD

    onKeyDown: function(event) {
        // console.log('onKeyDown');

        if ( this.data.enabled === false || this.data.enableKeys === false || this.data.enablePan === false ) return;

        this.handleKeyDown( event );
    },


// EVENT HANDLERS //

    // MOUSE

    handleMouseDownRotate: function( event ) {
        // console.log( 'handleMouseDownRotate' );
        this.rotateStart.set( event.clientX, event.clientY );
    },


    handleMouseDownDolly: function(event) {
        // console.log( 'handleMouseDownDolly' );
        this.dollyStart.set( event.clientX, event.clientY );
    },


    handleMouseDownPan: function(event) {
        //console.log( 'handleMouseDownPan' );
        this.panStart.set( event.clientX, event.clientY );
    },


    handleMouseMoveRotate: function ( event ) {
        // console.log( 'handleMouseMoveRotate' );

        this.rotateEnd.set( event.clientX, event.clientY );
		this.rotateDelta.subVectors( this.rotateEnd, this.rotateStart );

		var element = this.canvasEl === document ? this.canvasEl.body : this.canvasEl;

		// rotating across whole screen goes 360 degrees around
		this.rotateLeft( 2 * Math.PI * this.rotateDelta.x / element.clientWidth * this.data.rotateSpeed );

		// rotating up and down along whole screen attempts to go 360, but limited to 180
		this.rotateUp( 2 * Math.PI * this.rotateDelta.y / element.clientHeight * this.data.rotateSpeed );

		this.rotateStart.copy( this.rotateEnd );

		this.updateView();
    },


    handleMouseMoveDolly: function ( event ) {
        // console.log( 'handleMouseMoveDolly' );

        this.dollyEnd.set( event.clientX, event.clientY );
        this.dollyDelta.subVectors( this.dollyEnd, this.dollyStart );

        if ( this.dollyDelta.y > 0 ) {
            this.dollyIn( this.getZoomScale() );
        }
        else if ( this.dollyDelta.y < 0 ) {
            this.dollyOut( this.getZoomScale() );
        }

        this.dollyStart.copy( this.dollyEnd );

        this.updateView();
    },


    handleMouseMovePan: function ( event ) {
        // console.log( 'handleMouseMovePan' );

        this.panEnd.set( event.clientX, event.clientY );
        this.panDelta.subVectors( this.panEnd, this.panStart );
        this.pan( this.panDelta.x, this.panDelta.y );
        this.panStart.copy( this.panEnd );

        this.updateView();
    },


    handleMouseUp: function ( event )
    {
        // console.log( 'handleMouseUp' );
    },


    // MOUSE WHEEL

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


    // TOUCH

    handleTouchStartRotate: function(event) {
        // console.log( 'handleTouchStartRotate' );
        this.rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
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

        var element = this.canvasEl === document ? this.canvasEl.body : this.canvasEl;
        // rotating across whole screen goes 360 degrees around
        this.rotateLeft( 2 * Math.PI * this.rotateDelta.x / element.clientWidth * this.data.rotateSpeed );
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
            this.dollyIn( this.getZoomScale() );
        } else if ( this.dollyDelta.y < 0 ) {
            this.dollyOut( this.getZoomScale() );
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


    // KEYBOARD

    handleKeyDown: function(event) {
        //console.log( 'handleKeyDown' );

        switch ( event.keyCode ) {
            case this.keys.UP:
                this.pan(0, this.data.keyPanSpeed);
                this.updateView();
                break;
            case this.keys.BOTTOM:
                this.pan(0, -this.data.keyPanSpeed);
                this.updateView();
                break;
            case this.keys.LEFT:
                this.pan( this.data.keyPanSpeed, 0);
                this.updateView();
                break;
            case this.keys.RIGHT:
                this.pan(-this.data.keyPanSpeed, 0);
                this.updateView();
                break;
        }
    },



// HELPER FUNCTIONS //


    getAutoRotationAngle: function () {
        return 2 * Math.PI / 60 / 60 * this.data.autoRotateSpeed;
    },

    getZoomScale: function() {
        return Math.pow(0.95, this.data.zoomSpeed);
    },

    rotateLeft: function ( angle ) {
		this.sphericalDelta.theta -= angle;
	},

	rotateUp: function ( angle ) {
		this.sphericalDelta.phi -= angle;
	},


    panHorizontally: function(distance, objectMatrix) {
        // console.log('pan horizontally', distance, objectMatrix);
        var v = new THREE.Vector3();
        v.setFromMatrixColumn( objectMatrix, 0 ); // get X column of objectMatrix
        v.multiplyScalar( -distance );
        this.panOffset.add( v );
    },


    panVertically: function( distance, objectMatrix ) {
        // console.log('pan vertically', distance, objectMatrix);
        var v = new THREE.Vector3();
        v.setFromMatrixColumn( objectMatrix, 1 ); // get Y column of objectMatrix
        v.multiplyScalar( distance );
        this.panOffset.add( v );
    },

    pan: function( deltaX, deltaY ) { // deltaX and deltaY are in pixels; right and down are positive
        // console.log('panning', deltaX, deltaY );
        var offset = new THREE.Vector3();
        var element = this.canvasEl === document ? this.canvasEl.body : this.canvasEl;

        if ( this.cameraType === 'PerspectiveCamera'  )
        {
            // perspective
            var position = this.object.position;
            offset.copy( position ).sub( this.target );
            var targetDistance = offset.length();
            targetDistance *= Math.tan(( this.camera.fov / 2 ) * Math.PI / 180.0 ); // half of the fov is center to top of screen

            this.panHorizontally(2 * deltaX * targetDistance / element.clientHeight, this.object.matrix); // we actually don't use screenWidth, since perspective camera is fixed to screen height
            this.panVertically(2 * deltaY * targetDistance / element.clientHeight, this.object.matrix);
        }
        else if ( this.cameraType === 'OrthographicCamera' )
        {
            // orthographic
            this.panHorizontally(deltaX * ( this.object.right - this.object.left ) / this.camera.zoom / element.clientWidth, this.object.matrix );
            this.panVertically(deltaY * ( this.object.top - this.object.bottom ) / this.camera.zoom / element.clientHeight, this.object.matrix);
        }
        else {
            // camera neither orthographic nor perspective
            console.warn('Trying to pan: WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
            this.data.enablePan = false;
        }

    },

    dollyIn: function( dollyScale ) {
        // console.log( "dollyIn camera" );
        if ( this.cameraType === 'PerspectiveCamera' )
        {
            this.scale *= dollyScale;
        }
        else if ( this.cameraType === 'OrthographicCamera' )
        {
            this.camera.zoom = Math.max( this.data.minZoom, Math.min( this.data.maxZoom, this.camera.zoom * dollyScale));
            this.camera.updateProjectionMatrix();
            this.zoomChanged = true;
        }
        else {
            console.warn('Trying to dolly in: WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            this.data.enableZoom = false;
        }
    },


    dollyOut: function( dollyScale ) {
        // console.log( "dollyOut camera" );
        if ( this.cameraType === 'PerspectiveCamera' )
        {
            this.scale /= dollyScale;
        }
        else if ( this.cameraType === 'OrthographicCamera' )
        {
            this.camera.zoom = Math.max( this.data.minZoom, Math.min(this.data.maxZoom, this.camera.zoom / dollyScale));
            this.camera.updateProjectionMatrix();
            this.zoomChanged = true;
        }
        else
        {
            console.warn('Trying to dolly out: WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');
            this.data.enableZoom = false;
        }
    },



// UPDATE VIEW //

    updateView: function()
    {
        // console.log( 'update view' );

        var offset = new THREE.Vector3();

		var quat = new THREE.Quaternion().setFromUnitVectors( this.object.up, new THREE.Vector3( 0, 1, 0 ) ); // so camera.up is the orbit axis
		var quatInverse = quat.clone().inverse();

		var lastPosition = new THREE.Vector3();
		var lastQuaternion = new THREE.Quaternion();

        var position = this.el.object3D.position;

		offset.copy( position ).sub( this.target );

        // console.log( 'offset', offset );
        // console.log( 'object position', position );
        // console.log( 'target', this.target );

		offset.applyQuaternion( quat ); // rotate offset to "y-axis-is-up" space
		this.spherical.setFromVector3( offset ); // angle from z-axis around y-axis

		if ( this.data.autoRotate && this.state === this.STATE.NONE ) this.rotateLeft( this.getAutoRotationAngle() );

		this.spherical.theta += this.sphericalDelta.theta;
		this.spherical.phi += this.sphericalDelta.phi;
		this.spherical.theta = Math.max( this.data.minAzimuthAngle, Math.min( this.data.maxAzimuthAngle, this.spherical.theta ) ); // restrict theta to be between desired limits
		this.spherical.phi = Math.max( this.data.minPolarAngle, Math.min( this.data.maxPolarAngle, this.spherical.phi ) ); // restrict phi to be between desired limits
		this.spherical.makeSafe();
		this.spherical.radius *= this.scale;
		this.spherical.radius = Math.max( this.data.minDistance, Math.min( this.data.maxDistance, this.spherical.radius ) ); // restrict radius to be between desired limits

		this.target.add( this.panOffset ); // move target to panned location

		offset.setFromSpherical( this.spherical );
        offset.applyQuaternion( quatInverse ); // rotate offset back to "camera-up-vector-is-up" space
        position.copy( this.target ).add( offset );


        if ( this.target)
        {
            this.lookAwayFrom( this.object, this.target );
        }

		if ( this.data.enableDamping === true ) {
			this.sphericalDelta.theta *= ( 1 - this.data.dampingFactor );
			this.sphericalDelta.phi *= ( 1 - this.data.dampingFactor );
		} else {
			this.sphericalDelta.set( 0, 0, 0 );
		}

		this.scale = 1;
		this.panOffset.set( 0, 0, 0 );

		// update condition is:
		// min(camera displacement, camera rotation in radians)^2 > EPS
		// using small-angle approximation cos(x/2) = 1 - x^2 / 8

		if ( this.zoomChanged ||
			lastPosition.distanceToSquared( this.object.position ) > this.EPS ||
			8 * ( 1 - lastQuaternion.dot( this.object.quaternion ) ) > this.EPS ) {

            // this.canvasEl.dispatchEvent( this.changeEvent );
            this.el.emit('change-drag-orbit-controls', null, false);

			lastPosition.copy( this.object.position );
			lastQuaternion.copy( this.object.quaternion );
			this.zoomChanged = false;

			return true;
		}

		return false;
	},


    lookAwayFrom : function( object, target) {
        var v = new THREE.Vector3();
        v.subVectors( object.position, target ).add( object.position );
        object.lookAt(v);
    }


});
