<template>
	<div ref="container" @keydown="onKeyDown" @keyUp="onKeyUp"></div>
</template>
<script>
	import * as Three from 'three';
	// const THREE = Three;
    // import Sky from 'three';
    import Utils from './Utils.js';
    // import ammo from '../prev/ammo.js';
	// import 'three/examples/js/controls/OrbitControls';
    // import '../prev/three/controls/OrbitControls.js';
    // import '../prev/three/controls/FlyControls.js';
    // import '../prev/three/controls/DeviceOrientationControls.js';
    // import '../prev/three/controls/MapControls.js';
    // import '../prev/three/controls/FirstPersonControls.js';
	// import '../prev/three/controls/TransformControls.js';
    import {mergeBufferGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils';
    import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
	import { Sky } from 'three/examples/jsm/objects/Sky.js';
    import Wheel from './Wheel.js';
    import Car from './Car.js';
    import Motorbike from './Motorbike.js';
    import Engine from './Engine.js';
    import Construction from './Construction.js';
    import Phys from './Phys.js';
    import Tire from '../Models/Tire.js';
    import Rim from '../Models/Rim.js';
	import { log } from 'three';
    export default {
        nane: 'scene-component',
        props: [
            'json'
        ],
        data: function() {
            return {
                group: '',
                camera: {},
                HUD: '',
                overlay: '',
                sound: '',
                scene: '',
                renderer: '',
                childs: '',
                car: {},
                steerSpeed: 0,
                timer1: 0,
                timer2: 0,
                frameBuffer: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                timestep: 0.01,
                throttle: 1,
                scene_window: {
                    innerWidth: 0,
                    innerHeight: 0,
                },
                brake: 0,
                up: false,
                right: false,
                down: false,
                left: false,
                clutch: false,
                cameraOffset: {},
                components: [],
                sceneGeometry: {},
                totalLength: 0, // Total length is normalized and is used to preview the full !scaled! scene
                sceneCenter: new Three.Vector3(),
                dimDiv: 1, // This variable divides all dimension data in order to provide a better visualization
                utils: {},
                meshMaterial: {
                    // tire: new Three.MeshPhongMaterial( { shininess: 50, color : 0x1b1b1b } ),
                    // rim: new Three.MeshPhysicalMaterial( { color: 0xd7d7d7, roughness: 0.17, metalness: 0.47, reflectivity: 1, clearCoat: 0.64, clearCoatRoughness: 0.22 } ),
                    // building: new Three.MeshLambertMaterial( { color: 0xcccccc, opacity: 0.95, transparent: true } ),
                    // ground: new Three.MeshBasicMaterial( { color: 0x77aa22, side: Three.FrontSide, opacity: 0.65, transparent: true } )
                },
            }
        },
        created() {
            this.renderer = new THREE.WebGLRenderer( { antialias: true } );
            this.renderer.setPixelRatio( window.devicePixelRatio );
            this.scene_window = {innerWidth: innerWidth * 0.98, innerHeight: window.innerHeight * 0.95};
            this.renderer.setSize( this.scene_window.innerWidth, this.scene_window.innerHeight);
		},
        mounted() {
            this.$nextTick().then(() => {
                console.log(Three);
                this.utils = new Utils.Utils( this.dimDiv );
                console.log(this.json);
                this.scene = new Three.Scene();
                this.group = new Three.Group();
                this.sceneGeometry = new Three.BufferGeometry();
                var components = [];
                this.json.vehicles.forEach( vehicle => {
                    // var wheelMaterials = {rim : new Three.MeshPhongMaterial(vehicle.components.wheel[0].meshMaterial.rim), tire : new Three.MeshPhysicalMaterial(vehicle.components.wheel[0].meshMaterial.tire) };
                    // wheelMaterials.rim.color = parseInt(vehicle.components.wheel[0].meshMaterial.rim.colour);
                    // wheelMaterials.tire.color = parseInt(vehicle.components.wheel[0].meshMaterial.tire.colour);
                    this.meshMaterial = {
                        tire: new Three.MeshPhongMaterial( { shininess: 50, color : 0x1b1b1b } ),
                        rim: new Three.MeshPhysicalMaterial( { color: 0xd7d7d7, roughness: 0.17, metalness: 0.47, reflectivity: 1, clearCoat: 0.64, clearCoatRoughness: 0.22 } ),
                        building: new Three.MeshLambertMaterial( { color: 0xcccccc, opacity: 0.95, transparent: true } ),
                        road: new Three.MeshBasicMaterial( { color: 0x333333} ),
                        line: new Three.MeshBasicMaterial( { color: 0xffff1a} ),
                        ground: new Three.MeshBasicMaterial( { color: 0x44aa19, side: Three.FrontSide, opacity: 0.85, transparent: true } )
                    };
                    var wheel = new Wheel.Wheel( vehicle.components.wheel[0].DO, vehicle.components.wheel[0].DI, vehicle.components.wheel[0].t, vehicle.components.wheel[0].tireType, vehicle.components.wheel[0].tireDims, vehicle.components.wheel[0].rimType, vehicle.components.wheel[0].rimDims,
                        vehicle.components.wheel[0].pressure, vehicle.components.wheel[0].frictionOptions, this.meshMaterial );
                    var transmission = {clutch: 1, clutchFrictionCoeff: vehicle.components.clutch.clutchFrictionCoeff, gear: false, gearbox: vehicle.components.transmission.gearbox };
                    console.log(vehicle.components.wheel[0].DI, vehicle.components.wheel[0].DO, vehicle.components.wheel[0].t, vehicle.components.wheel[0].tireType, vehicle.components.wheel[0].tireDims, vehicle.components.wheel[0].rimType, vehicle.components.wheel[0].rimDims,
                        vehicle.components.wheel[0].pressure, vehicle.components.wheel[0].frictionOptions);
                    var engine = new Engine.Engine( vehicle.components.engine.shaft_inertia, vehicle.components.engine.rev_limit, vehicle.components.engine.idle_rot, vehicle.components.engine.maximum_hp );//I = M / 2 * R ^ 2 [kg*m^2]
                    if ( vehicle.type === "Car" ) {
                        var car_geo = Car.Car.makeCarGeo( /*2D front to rear points*/vehicle.geometry.pointArray, vehicle.geometry.wheelsCentersPositions, vehicle.geometry.radius, vehicle.geometry.width, vehicle.geometry.bevelThickness );
                        this.vehicle = new Car.Car( wheel, vehicle.geometry.wheelsCentersPositions, engine, vehicle.mass, transmission, car_geo, vehicle.spawnPosition, this.camera, -1);
                        components.push( this.vehicle );
                    } else if (vehicle.type === "Motorbike" ) {
                        var bike_geo = Motorbike.Motorbike.makeMotorbikeGeo( /*2D front to rear points*/vehicle.geometry.pointArray, vehicle.geometry.wheelsCentersPositions, vehicle.geometry.radius, vehicle.geometry.width, vehicle.geometry.bevelThickness );
                        this.vehicle = new Motorbike.Motorbike( wheel, vehicle.geometry.wheelsCentersPositions, engine, vehicle.mass, transmission, bike_geo, vehicle.spawnPosition, this.camera, -1);
                        components.push( this.vehicle );
                    }
                });

                // var physics = new Phys( 9.81, 0.8, 1, [] );
                // let container = this.$refs.scene_container;
                // console.log(this.$refs);
                this.$refs.container.appendChild(this.renderer.domElement);
                // var renderer = new Three.WebGLRenderer( { antialias: true } );
                // renderer.setPixelRatio( container.devicePixelRatio );
                // renderer.setSize( container.innerWidth, container.innerHeight );
                // document.body.appendChild( renderer.domElement );
                this.HUD = document.createElement('div');
                this.overlay = document.createElement('div');
                this.HUD.style.position = 'absolute';
                this.overlay.style.position = 'absolute';
                this.HUD.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
                this.HUD.style.width = 100;
                this.HUD.style.height = 100;
                this.overlay.style.width = 100;
                this.overlay.style.height = 100;
                this.HUD.style.backgroundColor = "transparent";
                this.HUD.innerHTML = "";
                this.HUD.style.top = '67%';//200 + 'px';
                this.overlay.innerHTML = "Throttle, Brake, Steering: Arrow Keys, Clutch: V, Gears 1-6: Q-A-W-S-E-D, Reverse Gear: R";
                this.overlay.style.top = '0%';//200 + 'px';
                this.HUD.style.left = 20 + 'px';
                this.$refs.container.appendChild(this.HUD);
                this.$refs.container.appendChild(this.overlay);
                var geometries_array = [];
                for ( var i = 0; i < components.length; i++ ) {
                    // Save root Group's transform in transformation array
                    console.log('components[i]', components[i]);
                    var arr = [[components[i].group.rotation.x, components[i].group.rotation.y, components[i].group.rotation.z,
                                components[i].group.position.x, components[i].group.position.y, components[i].group.position.z, components[i].group.rotation.order]];
                    Utils.Utils.mergeGroupChildren( geometries_array, components[i].group, arr );
                }
                this.sceneGeometry = mergeBufferGeometries(geometries_array)
                this.sceneGeometry.computeBoundingSphere();

                this.totalLength = 1.65 * this.sceneGeometry.boundingSphere.radius;
                this.sceneCenter = this.sceneGeometry.boundingSphere.center.clone();
                console.log(this.sceneCenter);
                // camera
                this.cameraOffset = new Three.Vector3()
                this.cameraOffset.set( - 2 * this.totalLength, this.totalLength / 2, 0 );
                this.camera = new Three.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 * this.totalLength);
                this.camera.position.copy( (this.vehicle.center.clone()).add(this.cameraOffset.applyAxisAngle(new Three.Vector3( 0, 1, 0 ), Math.atan(this.vehicle.frontVector.z / this.vehicle.frontVector.x))));
                // camera.matrixAutoUpdate = false;
                this.vehicle.camera = this.camera;
                this.vehicle.camera.cameraOffset = this.cameraOffset;
                // this.vehicle.camera.theta = spawnPosition.rotation * 2 * Math.PI;
                this.scene.add( this.camera );

                var listener = new Three.AudioListener();
                this.camera.add( listener );

                this.sound = new Three.Audio( listener );

                var audioLoader = new Three.AudioLoader();
                audioLoader.load( 'sounds/engine.ogg', function( buffer ) {
                    this.sound.setBuffer( buffer );
                    this.sound.setLoop( true );
                    this.sound.setVolume( 0.5 );
                    this.sound.play();
                }.bind(this));
                // controls
                this.controls = new OrbitControls( this.camera, this.renderer.domElement );
                this.controls.minDistance = this.totalLength / 10;
                this.controls.maxDistance = 100 * this.totalLength;
                this.controls.target0 = this.vehicle.center;
                this.controls.target = this.vehicle.center;
                this.controls.maxPolarAngle = Math.PI * 2;
                this.controls.screenSpacePanning = true;
                this.controls.enableKeys = false;
                this.controls.update();
                // console.log(controls);

                this.scene.add( new Three.AmbientLight( 0x222222 ) );

                var light = new Three.PointLight( 0xffffff, 1 );
                this.camera.add( light );
                // Sky
                var sky = new Sky();
                sky.scale.setScalar( 450000 );
                this.scene.add( sky );
                // Add Sun Helper
                var sunSphere = new Three.Mesh(
                    new Three.SphereBufferGeometry( 20000, 16, 8 ),
                    new Three.MeshBasicMaterial( { color: 0xffffff } )
                );
                sunSphere.position.y = - 700000;
                sunSphere.visible = true;
                this.scene.add( sunSphere );

                // var effectController = {
                // 	turbidity: 10,
                // 	rayleigh: 2,
                // 	mieCoefficient: 0.005,
                // 	mieDirectionalG: 0.8,
                // 	luminance: 1,
                // 	inclination: 0.49, // elevation / inclination
                // 	azimuth: 0.25, // Facing front,
                // 	sun: true
                // };
                var distance = 400000;
                var effectController = {
                    turbidity: 6.1,
                    rayleigh: 1.466,
                    mieCoefficient: 0.016,
                    mieDirectionalG: 0.475,
                    // luminance: 1.1,
                    inclination: 0.0847, // elevation / inclination
                    azimuth: 0.2029, // Facing front,
                    sun: true
                };
                var uniforms = sky.material.uniforms;
                uniforms[ "turbidity" ].value = effectController.turbidity;
                uniforms[ "rayleigh" ].value = effectController.rayleigh;
                // uniforms[ "luminance" ].value = effectController.luminance;
                uniforms[ "mieCoefficient" ].value = effectController.mieCoefficient;
                uniforms[ "mieDirectionalG" ].value = effectController.mieDirectionalG;

                var theta = Math.PI * ( effectController.inclination - 0.5 );
                var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );

                sunSphere.position.x = distance * Math.cos( phi );
                sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
                sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
                sunSphere.visible = effectController.sun;
                uniforms[ "sunPosition" ].value.copy( sunSphere.position );

                // Axes Helper
                this.scene.add( new Three.AxesHelper( 5000 ) );

                this.scene.add( this.group );

                // Preview Overall scene geometry
                // group.add(new Three.Mesh(sceneGeometry.clone(), meshMaterial.outside.clone()));

                // Add ground plane
                var planeGeo = new Three.PlaneGeometry( 1000 * this.totalLength, 1000 * this.totalLength );
                var plane = new Three.Mesh( planeGeo, this.meshMaterial.ground );
                plane.rotation.x = - Math.PI / 2;
                plane.position.y = - 0.001 * this.totalLength;
                this.scene.add(plane);
                var buildingsGeos = [];
                var roadsGeos = [];
                var linesGeos = [];
                var road_width = 9;
                var line_width = 0.1;
                var roadCurve, lineCurves, roadObject;

                roadObject = Construction.Construction.road(0, road_width, 1, Math.PI / 2, line_width);
                roadCurve = roadObject.road;
                lineCurves = roadObject.roadLines;

                for ( i = 0; i < 700 ; i++ ) {
                    let width = Math.random() * 20 + 10;
                    let height = Math.random() * 20 + 10;
                    let depth = Math.random() * 20 + 10;

                    let translation = new THREE.Vector3(
                        (Math.random() * 1000 - 500) * this.totalLength,
                        height / 2,
                        (Math.random() * 1000 - 500) * this.totalLength
                    );
                    let width_road = new Three.PlaneGeometry(road_width, width).rotateX(- Math.PI / 2).rotateY(Math.PI / 2);
                    let depth_road = new Three.PlaneGeometry(road_width, depth).rotateX(- Math.PI / 2);
                    let width_road_line = new Three.PlaneGeometry(line_width, width).rotateX(- Math.PI / 2).rotateY(Math.PI / 2);
                    let depth_road_line = new Three.PlaneGeometry(line_width, depth).rotateX(- Math.PI / 2);
                    let building_road = mergeBufferGeometries([
                        roadCurve.clone().rotateY(Math.PI).translate(- (width) / 2, 0,  - (depth + road_width) / 2),
                        width_road.clone().translate(0, 0.05 * line_width,  - (depth + road_width) / 2),
                        roadCurve.clone().rotateY(Math.PI / 2).translate(+ (width + road_width) / 2, 0,  - (depth) / 2),
                        width_road.clone().translate(0, 0.05 * line_width,  (depth + road_width) / 2),
                        roadCurve.clone().translate(+ (width) / 2, 0,  + (depth + road_width) / 2),
                        depth_road.clone().translate(- (width + road_width) / 2, 0.05 * line_width, 0),
                        roadCurve.clone().rotateY(- Math.PI / 2).translate(- (width + road_width) / 2, 0,  + (depth) / 2),
                        depth_road.clone().translate((width + road_width) / 2, 0.05 * line_width, 0),
                    ]);
                    let road_lines = mergeBufferGeometries([
                        lineCurves.clone().rotateY(Math.PI).translate(- (width) / 2, 0,  - (depth + road_width) / 2),
                        width_road_line.clone().translate(0, 0.1 * line_width,  - (depth + road_width) / 2 + 1.5 * line_width),
                        width_road_line.clone().translate(0, 0.1 * line_width,  - (depth + road_width) / 2 - 1.5 * line_width),
                        lineCurves.clone().rotateY(Math.PI / 2).translate(+ (width + road_width) / 2, 0,  - (depth) / 2),
                        width_road_line.clone().translate(0, 0.1 * line_width,  (depth + road_width) / 2 + 1.5 * line_width),
                        width_road_line.clone().translate(0, 0.1 * line_width,  (depth + road_width) / 2 - 1.5 * line_width),
                        lineCurves.clone().translate(+ (width) / 2, 0,  + (depth + road_width) / 2),
                        depth_road_line.clone().translate(- (width + road_width) / 2 + 1.5 * line_width, 0.1 * line_width, 0),
                        depth_road_line.clone().translate(- (width + road_width) / 2 - 1.5 * line_width, 0.1 * line_width, 0),
                        lineCurves.clone().rotateY(- Math.PI / 2).translate(- (width + road_width) / 2, 0,  + (depth) / 2),
                        depth_road_line.clone().translate((width + road_width) / 2 + 1.5 * line_width, 0.1 * line_width, 0),
                        depth_road_line.clone().translate((width + road_width) / 2 - 1.5 * line_width, 0.1 * line_width, 0),
                    ]);

                    roadsGeos.push(
                        building_road
                    .translate(
                        translation.x,
                        0,
                        translation.z
                    ));

                    linesGeos.push(
                        road_lines
                    .translate(
                        translation.x,
                        0,
                        translation.z
                    ));

                    buildingsGeos.push(new Three.BoxGeometry(
                        width,
                        height,
                        depth
                    ).translate(
                        translation.x,
                        translation.y,
                        translation.z
                    ));
                }
                let transformationNext = new THREE.Matrix4();
                let roadRadius, angle, length, sign;
                for ( i = 0; i < 2000 ; i++ ) {
                    // let roadRadius = Math.random() * 50 + 10;
                    // let angle = Math.random() * 0.6 * Math.PI + 0.1 * Math.PI;
                    let rand1 = Math.random();
                    if (rand1 < 0.7) {
                        length = 30 + Math.random() * 200;
                        roadObject = Construction.Construction.roadLine(length, road_width, line_width);
                    } else if (rand1 < 0.9) {
                        roadRadius = Math.random() * 40;
                        angle = Math.PI / 2;
                        sign = Math.sign(Math.random() - 0.5);
                        roadObject = Construction.Construction.road(roadRadius, road_width, sign, angle, line_width);
                    } else {
                        roadRadius = Math.random() * 140;
                        angle = Math.random() * 3 * Math.PI / 2;
                        sign = Math.sign(Math.random() - 0.5);
                        roadObject = Construction.Construction.road(roadRadius, road_width, sign, angle, line_width);
                    }
                    roadsGeos.push(roadObject.road.applyMatrix4(transformationNext));
                    linesGeos.push(roadObject.roadLines.applyMatrix4(transformationNext));
                    // transformationNext.(roadObject.translationNext.clone());
                    transformationNext.multiply(roadObject.transformationNext.clone());
                }

                var buildingsGeo = mergeBufferGeometries(buildingsGeos);
                var roadsGeo = mergeBufferGeometries(roadsGeos);
                var linesGeo = mergeBufferGeometries(linesGeos);

                var buildingsMesh = new Three.Mesh( buildingsGeo, this.meshMaterial.building );
                var roadsMesh = new Three.Mesh( roadsGeo, this.meshMaterial.road );
                var linesMesh = new Three.Mesh( linesGeo, this.meshMaterial.line );

                this.scene.add(buildingsMesh);
                this.scene.add(roadsMesh);
                this.scene.add(linesMesh);


                // Add components
                for (var i = 0; i < components.length;i++)
                    this.group.add(components[i].group);

                this.childs = [];
                for ( var i = 0; i < this.group.children.length; i++)
                    for ( var j = 0; j < this.group.children[i].children.length; j++)
                        if ( this.group.children[i].children[j].isMesh )
                            this.childs.push( this.group.children[i].children[j] );
                        else
                            for ( var k = 0; k < this.group.children[i].children[j].children.length; k++)
                                this.childs.push( this.group.children[i].children[j].children[k] );

                this.scene.autoUpdate = false;
                this.timer2 = performance.now();
                // this.frameBuffer = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
                document.addEventListener( 'keyup', this.onKeyUp )
                document.addEventListener( 'keydown', this.onKeyDown )
                this.animate();
            })
        },
        methods: {
            onKeyUp(e) {
                if (e.keyCode === 38 /* up */){
                    this.up = false;
                }
                if (e.keyCode === 39 /* right */){
                    this.right = false;
                }
                if (e.keyCode === 40 /* down */){
                    this.down = false;
                }
                if (e.keyCode === 37 /* left */){
                    this.left = false;
                }
                    if (e.keyCode === 86 /* v */){
                    this.clutch = false;
                }

                switch ( e.keyCode ) {
                    case 81: /* q */
                        if (this.vehicle.transmission.gear === 1)
                            this.vehicle.transmission.gear = false;
                        break;
                    case 65: /* a */
                        if (this.vehicle.transmission.gear === 2)
                            this.vehicle.transmission.gear = false;
                        break;
                    case 87: /* w */
                        if (this.vehicle.transmission.gear === 3)
                            this.vehicle.transmission.gear = false;
                        break;
                    case 83: /* s */
                        if (this.vehicle.transmission.gear === 4)
                            this.vehicle.transmission.gear = false;
                        break;
                    case 69: /* e */
                        if (this.vehicle.transmission.gear === 5)
                            this.vehicle.transmission.gear = false;
                        break;
                    case 68: /* d */
                        if (this.vehicle.transmission.gear === 6)
                            this.vehicle.transmission.gear = false;
                        break;
                    case 82: /* r */
                        if (this.vehicle.transmission.gear === 0)
                            this.vehicle.transmission.gear = false;
				}
            },
            onKeyDown(e) {
                if (e.keyCode === 38 /* up */ ){
                    this.up = true;
                }
                if (e.keyCode === 39 /* right */ ){
                    this.right = true;
                }
                if (e.keyCode === 40 /* down */ ){
                    this.down = true;
                }
                if (e.keyCode === 37 /* left */ ){
                    this.left = true;
                }
                if (e.keyCode === 86 /* v */ ){
                    this.clutch = true;
                }

                switch ( e.keyCode ) {
                    case 81: /* q */
                        this.vehicle.transmission.gear = 1;
                        break;
                    case 65: /* a */
                        this.vehicle.transmission.gear = 2;
                        break;
                    case 87: /* w */
                        this.vehicle.transmission.gear = 3;
                        break;
                    case 83: /* s */
                        this.vehicle.transmission.gear = 4;
                        break;
                    case 69: /* e */
                        this.vehicle.transmission.gear = 5;
                        break;
                    case 68: /* d */
                        this.vehicle.transmission.gear = 6;
                        break;
                    case 82: /* r */
                        this.vehicle.transmission.gear = 0;
                        break;
                    // default:
                    // 	car.transmission.gear = false; !!! Wrong! Key release will do the job
                }
            },
            animate: function() {
                requestAnimationFrame( this.animate );
                // this.render();
            // },
            // render() {
                // this.timestep = this.timer2 - this.timer1;
                this.timestep = 0.5;
                // timestep = clock.getDelta();
                this.timer1 = performance.now();
                // console.log(timer1);
                // this.frameBuffer.push( this.timestep );
                // this.overlay.innerHTML = 'Framerate : ' + String( 1000 / ( this.frameBuffer.reduce((a, b) => a + b, 0) / this.frameBuffer.length ).toFixed() ) + ' FPS';
                // this.frameBuffer.shift();
                this.throttle += ( this.up ? ( this.throttle < 2 ? 0.05 * this.timestep : 0 ) : ( this.throttle > 1 ? - 0.1 * this.timestep * (this.throttle - 1) : 0 ) );
                this.brake += ( this.down ? ( this.brake < 1 ? 0.2 * this.timestep : 0 ) : ( this.brake > 0 ? - 0.4 * this.timestep * this.brake : 0 ) );
                if ((this.right && this.vehicle.ackermanSteering.steeringWheelPosition > 0) || (this.left && this.vehicle.ackermanSteering.steeringWheelPosition < 0)) {
                    // When changing steering side make the steer crispier
                    this.vehicle.ackermanSteering.steeringWheelPosition *= 0.3;
                }
                this.steerSpeed =
                    Math.min( 0.02 * this.vehicle.maxSpeed / Math.abs(this.vehicle.speed), 1)
                    * ( (this.left ? 0.6 * this.timestep : 0) - (this.right ? 0.6 * this.timestep : 0) ) - (!(this.left || this.right) ?  this.timestep * this.vehicle.ackermanSteering.steeringWheelPosition : 0);
                // console.log(this.steerSpeed, this.vehicle.maxSpeed);
                this.vehicle.transmission.clutch += !this.clutch ? (this.vehicle.transmission.clutch < 1 ? 0.05 * this.timestep : 0 ) : (this.vehicle.transmission.clutch > 0 ? - 0.2 * this.timestep * this.vehicle.transmission.clutch : 0 );
                if (this.vehicle.transmission.clutch < 0) this.vehicle.transmission.clutch = 0;
                this.HUD.innerHTML =
                    '<table style="opacity: 0.8; background-color:#A3A7AB">' +
                    '<tr><td>Engine RPM : <b>' + String( (this.vehicle.engine._rot * 60).toFixed() ) + '</b>' +
                    '</tr></td><tr><td>Speed : <b>' + String( ( this.vehicle.speed * 3.6 ).toFixed(1) ) + '</b>' +
                    '</tr></td><tr><td>Throttle : <b>' + String( this.throttle.toFixed(1) ) + '</b>' +
                    '</tr></td><tr><td>Gear : <b>' + String( this.vehicle.transmission.gear === false ? 'N' : (this.vehicle.transmission.gear !== 0 ? this.vehicle.transmission.gear : 'R') ) + '</b>' +
                    '</tr></td><tr><td>Accelaration : <b>' + String( this.vehicle.acceleration.toFixed(1) ) + '</b>' +
                    '</tr></td><tr><td>Brake : <b>' + String( this.brake.toFixed(1) ) + '</b>' +
                    '</tr></td><tr><td>Steering : <b>' +	String( (this.vehicle.ackermanSteering.steeringWheelPosition).toFixed(1) ) + '</b>' +
                    '</tr></td><tr><td>Clutch : <b>' + String( this.vehicle.transmission.clutch.toFixed(1) ) + '</b>' +
                    '</tr></td><tr><td>Power : <b>' + String( this.vehicle.engine._currentPower.toFixed() ) + '</b>' +
                    '</tr></td><tr><td>Torque : <b>' + String( this.vehicle.engine._currentTorque.toFixed() ) + '</b>' +
                    '</tr></td><tr><td>Ackerman Steering Point : <b>' + String( Number.isFinite(this.vehicle.ackermanSteering.ackermanPoint)?this.vehicle.ackermanSteering.ackermanPoint.toFixed(2):this.vehicle.ackermanSteering.ackermanPoint ) + '</b>' +
                    '</tr></td></table>';
                    // console.log(this.vehicle.speed.length());

                this.vehicle.updateLoad();
                this.vehicle.updateClutchConnection( this.throttle, this.brake, this.timestep / 5 );
                // if (this.vehicle.engine._rot * 60 < 1000) {
                //     this.sound.setVolume(0.75 + (0.5 * (this.throttle - 1)));
                //     this.vehicle.engine._rot * 60
                // }
                this.sound.setVolume(Math.min((this.vehicle.engine._rot * this.vehicle.engine._rot) / (this.vehicle.engine._idle_rot * this.vehicle.engine._idle_rot), 1) * (0.75 + (0.25 * (this.throttle - 1))));
                this.sound.setPlaybackRate( isNaN(this.vehicle.engine._rot) ? 0 : this.vehicle.engine._rot / this.vehicle.engine._idle_rot * 0.9 );
                this.vehicle.updateWheelTransformation( this.timestep / 5, this.steerSpeed );
                // this.vehicle.moveCar( timestep / 1 );
                this.vehicle.applyTransformation( this.timestep / 5 );
                this.scene.updateMatrixWorld();
                // console.log(this.vehicle.centerTransformation);
                this.controls.target.copy(this.vehicle.center.clone());
                this.controls.update();
                this.renderer.render( this.scene, this.camera );
                this.timer2 = performance.now();
            }
        }
    }
</script>
