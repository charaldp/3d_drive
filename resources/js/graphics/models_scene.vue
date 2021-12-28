<template>
    <div ref="container">
        <model v-for="(model, index) in this.models" :key="index+'_model'"
            :model_specifier="model.model_specifier"
            :arguments="model"
            :meshMaterial="meshMaterial"
        >
        </model>
    </div>
</template>

<script>
import * as dat from 'dat.gui';
import {OrbitControls} from 'three/examples/js/controls/OrbitControls'
import {Sky} from 'three/examples/js/objects/Sky'

export default {
    name: 'models-scene',
    props: [
        'models',
    ],
    data() {
        return {
            params: {
                screenSpacePanning: true,
                showSky: true,
                showAxesHelper: true,
                groundPlane: true,
            },
            effectController: {
                turbidity: 10,
                rayleigh: 3,
                mieCoefficient: 0.005,
                mieDirectionalG: 0.7,
                elevation: 0,
                azimuth: 180,
                exposure: 0.1//this.renderer.toneMappingExposure
            },
            meshMaterial: null,
        }
    },
    created() {
        this.meshMaterial = {
            tire: new THREE.MeshPhongMaterial( { shininess: 50, color : 0x1b1b1b } ),
            rim: new THREE.MeshPhysicalMaterial( { color: 0xd7d7d7, roughness: 0.17, metalness: 0.47, reflectivity: 1, clearCoat: 0.64, clearCoatRoughness: 0.22 } ),
            building: new THREE.MeshLambertMaterial( { color: 0xcccccc, opacity: 0.95, transparent: true } ),
            ground: new THREE.MeshBasicMaterial( { color: 0x77aa22, side: THREE.FrontSide, opacity: 0.65, transparent: true } )
        };
        this.mountedActions();
        this.initialize();
    },
    mounted() {
        this.$nextTick(() => {
            this.templateRenderActions()
            this.animate()
        })
    },
    methods: {
        templateRenderActions() {
            this.$refs.container.appendChild(this.gui.domElement);
      		this.$refs.container.appendChild(this.renderer.domElement);
        },
        mountedActions() {
            this.gui = new dat.GUI({closed: true});

            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2();
            this.sceneGeometry = new THREE.BufferGeometry();
            this.sceneCenter = new THREE.Vector3();
            // this.onSceneRequestResponse(this.components_in);
        },
        initialize() {
            this.scene = new THREE.Scene();

            this.renderer = new THREE.WebGLRenderer( { antialias: true } );
            const window_size = {width: window.innerWidth * 0.45, height: window.innerHeight * 0.95}
            this.renderer.setPixelRatio( window_size.width / window_size.height );
            // console.log(this.$refs.container.innerWidth);
            this.renderer.setSize( window_size.width, window_size.height);
            // for ( var i = 0; i < this.components.length; i++ ) {
            //     var geo = new THREE.BufferGeometry();
            //     // Save root Group's transform in transformation array
            //     var arr = [[this.components[i].group.rotation.x, this.components[i].group.rotation.y, this.components[i].group.rotation.z,
            //                 this.components[i].group.position.x, this.components[i].group.position.y, this.components[i].group.position.z, this.components[i].group.rotation.order]];
            //     VesselUtils.mergeGroupChildren( geo, this.components[i].group, arr );
            //     this.sceneGeometry.merge( geo.clone() );
            // }
            // this.sceneGeometry.computeBoundingSphere();
            this.totalLength = 1;//1.65 * this.sceneGeometry.boundingSphere.radius;
            this.sceneCenter = new THREE.Vector3();//this.sceneGeometry.boundingSphere.center.clone();
            this.sceneGeometry.dispose();
            // camera
            this.camera = new THREE.PerspectiveCamera( 40, window_size.width / window_size.height, 0.01 * this.totalLength, 50 * this.totalLength);
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

            // this.scene.add( sunSphere );
            this.gui.add( this.params, 'showSky' ).name( 'Sky' ).onChange( function ( value ) {
                if ( value )
                    this.scene.add( this.sky );
                else
                    this.scene.remove( this.sky );
            }.bind(this) );
            // Sky GUI (Unused) The parameters have bee chosen using the library example controller
            const uniforms = this.sky.material.uniforms;
            uniforms[ 'turbidity' ].value = this.effectController.turbidity;
            uniforms[ 'rayleigh' ].value = this.effectController.rayleigh;
            uniforms[ 'mieCoefficient' ].value = this.effectController.mieCoefficient;
            uniforms[ 'mieDirectionalG' ].value = this.effectController.mieDirectionalG;

            const phi = THREE.MathUtils.degToRad( 90 - this.effectController.elevation );
            const theta = THREE.MathUtils.degToRad( this.effectController.azimuth );

            this.sun.setFromSphericalCoords( 1, phi, theta );

            uniforms[ 'sunPosition' ].value.copy( this.sun );

            this.renderer.toneMappingExposure = this.effectController.exposure;
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
        animate() {
            requestAnimationFrame( this.animate );
            this.render();
        },
        render() {
            this.raycaster.setFromCamera( this.mouse, this.camera );
            this.renderer.render( this.scene, this.camera );
        },


    }
}
</script>
