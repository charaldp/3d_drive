<template>
    <div>
        <model v-for="(model, index) in this.models" :key="index+'_model'"
            :model_specifier="model.model_specifier"
            :arguments="model"
        >
        </model>
    </div>
</template>

<script>
export default {
    name: 'models-scene',
    props: [
        'models',
    ],
    data() {
        return {
        }
    },
    methods: {
        mountedActions() {
            this.gui = new dat.GUI({closed: true});
            this.$refs.container.appendChild(this.gui.domElement);

            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2();
            this.sceneGeometry = new THREE.BufferGeometry();
            this.sceneCenter = new THREE.Vector3();
            this.outsideMeshMaterial = new THREE.MeshLambertMaterial({
                color: 0xcccccc,
                opacity: 0.50,
                transparent: true
            });
            this.insideMeshMaterial = new THREE.MeshLambertMaterial({
                color: 0x323232,
                opacity: 0.65,
                transparent: true
            });
            this.intermidiateMeshMaterial = new THREE.MeshLambertMaterial({
                color: 0x3c9dd1,
                opacity: 0.35,
                transparent: true
            });
            this.meshMaterial = {
                inside: this.insideMeshMaterial.clone(),
                outside: this.outsideMeshMaterial.clone(),
                intermidiate: this.intermidiateMeshMaterial.clone()
            };
            // this.onSceneRequestResponse(this.components_in);
        },
        initialize() {
            this.scene = new THREE.Scene();

            this.renderer = new THREE.WebGLRenderer( { antialias: true } );
            this.renderer.setPixelRatio( window.devicePixelRatio );
            // console.log(this.$refs.container.innerWidth);
            this.renderer.setSize( window.innerWidth * 0.98, window.innerHeight * 0.95);
      		this.$refs.container.appendChild(this.renderer.domElement);
            for ( var i = 0; i < this.components.length; i++ ) {
                var geo = new THREE.BufferGeometry();
                // Save root Group's transform in transformation array
                var arr = [[this.components[i].group.rotation.x, this.components[i].group.rotation.y, this.components[i].group.rotation.z,
                            this.components[i].group.position.x, this.components[i].group.position.y, this.components[i].group.position.z, this.components[i].group.rotation.order]];
                VesselUtils.mergeGroupChildren( geo, this.components[i].group, arr );
                this.sceneGeometry.merge( geo.clone() );
            }
            this.sceneGeometry.computeBoundingSphere();
            this.totalLength = 20;//1.65 * this.sceneGeometry.boundingSphere.radius;
            this.sceneCenter = new THREE.Vector3();//this.sceneGeometry.boundingSphere.center.clone();
            this.sceneGeometry.dispose();
            // camera
            this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 50 * this.totalLength);
            this.camera.position.set( this.sceneCenter.x + this.totalLength, this.sceneCenter.y + this.totalLength, this.sceneCenter.z + this.totalLength );
            this.scene.add( this.camera );

            // controls
            this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
            this.controls.listenToKeyEvents( window );
            this.controls.minDistance = this.totalLength / 10;
            this.controls.maxDistance = 10 * this.totalLength;
            this.controls.target0 = this.sceneCenter;
            this.controls.target = this.sceneCenter;
            console.log('sceneCenter',this.sceneCenter);
            console.log('totalLength',this.totalLength);
            this.controls.maxPolarAngle = Math.PI * 2;
            this.controls.screenSpacePanning = true;
            this.controls.update();
            // this.controls.enabled = false;
            this.gui.add( this.params, 'screenSpacePanning' ).name( 'ScreenSpacePanning' ).onChange( function ( value ) {
                this.controls.screenSpacePanning = value;
                this.controls.update();
                this.render();
            }.bind(this) );
            // console.log(controls);

            this.scene.add( new THREE.AmbientLight( 0x222222 ) );

            this.light = new THREE.PointLight( 0xffffff, 1 );
            this.camera.add( this.light );

            // Sky
            this.sky = new THREE.Sky();
            this.sky.scale.setScalar( 450000 );
            this.scene.add( this.sky );
            // Add Sun Helper
            this.sun = new THREE.Vector3();
            var effectController = {
                turbidity: 10,
                rayleigh: 3,
                mieCoefficient: 0.005,
                mieDirectionalG: 0.7,
                elevation: 5,
                azimuth: 180,
                exposure: 0.1//this.renderer.toneMappingExposure
            };
            // this.scene.add( sunSphere );
            this.gui.add( this.params, 'showSky' ).name( 'Sky' ).onChange( function ( value ) {
                if ( value )
                    this.scene.add( this.sky );
                else
                    this.scene.remove( this.sky );
            }.bind(this) );
            // Sky GUI (Unused) The parameters have bee chosen using the library example controller
            const uniforms = this.sky.material.uniforms;
            uniforms[ 'turbidity' ].value = effectController.turbidity;
            uniforms[ 'rayleigh' ].value = effectController.rayleigh;
            uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
            uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

            const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
            const theta = THREE.MathUtils.degToRad( effectController.azimuth );

            this.sun.setFromSphericalCoords( 1, phi, theta );

            uniforms[ 'sunPosition' ].value.copy( this.sun );

            this.renderer.toneMappingExposure = effectController.exposure;
            this.renderer.render( this.scene, this.camera );
            // Axes Helper
            this.axesHelper = new THREE.AxesHelper( 5000 );
            this.scene.add( this.axesHelper );
            this.gui.add( this.params, 'showAxesHelper' ).name( 'ShowAxesHelper' ).onChange( function ( value ) {
                if ( value )
                    this.scene.add( this.axesHelper );
                else
                    this.scene.remove( this.axesHelper );
            }.bind(this) );

            this.group = new THREE.Group();
            this.scene.add( this.group );
        },

    }
}
</script>
