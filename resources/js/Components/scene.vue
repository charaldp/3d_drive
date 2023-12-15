<template>
	<div ref="container" @keydown="onKeyDown" @keyUp="onKeyUp"></div>
</template>
<script>
	import * as Three from 'three';
    import * as CANNON from 'cannon'
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
                meshMaterial: {},
                wheels: {
                    representation: [null, null, null, null],
                    phys: [null, null, null, null],
                    constraint: [null, null, null, null],
                    axes: [null, null, null, null],
                },
                rotatingAngle: 0,
                body: {
                    representation: null,
                    phys: null
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
                this.$refs.container.appendChild(this.renderer.domElement);
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
                var distance = 400000;
                var effectController = {
                    turbidity: 6.1,
                    rayleigh: 1.466,
                    mieCoefficient: 0.016,
                    mieDirectionalG: 0.475,
                    inclination: 0.0847, // elevation / inclination
                    azimuth: 0.2029, // Facing front,
                    sun: true
                };
                var uniforms = sky.material.uniforms;
                uniforms[ "turbidity" ].value = effectController.turbidity;
                uniforms[ "rayleigh" ].value = effectController.rayleigh;
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
                for ( i = 0; i < 200 ; i++ ) {
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
                this.init();
                document.addEventListener( 'keyup', this.onKeyUp )
                document.addEventListener( 'keydown', this.onKeyDown )
                this.animate();
            })
        },
        methods: {
            init() {
                this.world = new CANNON.World();
                this.world.gravity.set(0, -9.82, 0); // m/s²
                var wheelPointsDetail = 16;
                console.log(this.json.vehicles[0]);
                const wheel_D = this.json.vehicles[0].components.wheel[0].DO;
                const wheel_positions = this.json.vehicles[0].geometry.wheelsCentersPositions;
                var radius = wheel_D / 2; // m
                // console.log();
                let vehicle_position = new THREE.Vector3(0, 0.5, 0);
                var positions = [
                    new CANNON.Vec3( + wheel_positions[1][0],  + 1, - wheel_positions[1][1]),
                    new CANNON.Vec3( - wheel_positions[1][0],  + 1, - wheel_positions[1][1]),
                    new CANNON.Vec3( - wheel_positions[1][0],  + 1, + wheel_positions[1][1]),
                    new CANNON.Vec3( + wheel_positions[1][0],  + 1, + wheel_positions[1][1])
                ];
                this.wheels.axes = [
                    new CANNON.Vec3(0, 0, -1),
                    new CANNON.Vec3(0, 0, -1),
                    new CANNON.Vec3(0, 0, 1),
                    new CANNON.Vec3(0, 0, 1)
                ];
                for (let i = 0;i < positions.length ;i++) {
                    this.wheels.phys[i] = new CANNON.Body({
                        mass: 25, // kg
                        position: positions[i], // m
                        shape: new CANNON.Cylinder(radius, radius, 0.3*radius, wheelPointsDetail)
                    });
                    this.world.addBody(this.wheels.phys[i]);
                }
                var vehicle_body_dims = {
                    x: wheel_positions[1][0] - 0.2 * radius,
                    y: 0.2,
                    z: wheel_positions[1][1] - 0.2 * radius,
                }
                this.body.phys = new CANNON.Body({
                        mass: 500, // kg
                        position: new CANNON.Vec3(vehicle_position.x, vehicle_position.y, vehicle_position.z), // m
                        shape: new CANNON.Box(new CANNON.Vec3(vehicle_body_dims.x, vehicle_body_dims.y, vehicle_body_dims.z))
                });
                this.world.addBody(this.body.phys);
                for (let i = 0;i < positions.length ;i++) {
                    this.wheels.constraint[i] = new CANNON.HingeConstraint(
                        this.body.phys,
                        this.wheels.phys[i],
                        {
                            pivotA: new CANNON.Vec3(positions[i].x, 0, positions[i].z),
                            axisA: this.wheels.axes[i],
                            pivotB: new CANNON.Vec3(0, 0, 0),
                            axisB: new CANNON.Vec3(0, 0, 1),
                        }
                    );
                    this.wheels.constraint[i].collideConnected = false;
                    this.wheels.constraint[i].update();
                    this.world.addConstraint(this.wheels.constraint[i]);
                }
                this.groundBody = new CANNON.Body({
                    mass: 0 // mass == 0 makes the body static
                });
                var groundShape = new CANNON.Plane();
                this.groundBody.addShape(groundShape);
                var axis = new CANNON.Vec3(1,0,0);
                this.groundBody.quaternion.setFromAxisAngle(axis, - Math.PI / 2);
                this.world.addBody(this.groundBody);

                const geometry = new THREE.CylinderGeometry(radius, radius, 0.3 * radius, wheelPointsDetail, 4).rotateX(-Math.PI / 2);
                const vehicle_body_geometry = new THREE.BoxGeometry(2 * vehicle_body_dims.x, 2 * vehicle_body_dims.z, 2 * vehicle_body_dims.y).rotateX(-Math.PI / 2);
                const material = new THREE.MeshPhysicalMaterial({ color: 0xffff00, clearcoat: 0.1, clearcoatRoughness: 0.3, reflectivity: 0.9, metalness: 0.3 })
                const body_material = new THREE.MeshPhysicalMaterial({ color: 0x333333, clearcoat: 0.1, clearcoatRoughness: 0.3, reflectivity: 0.9, metalness: 0.3 })

                for (let i = 0;i < positions.length ;i++) {
                    this.wheels.representation[i] = new THREE.Mesh(geometry, material.clone());
                    this.scene.add(this.wheels.representation[i])
                }
                this.body.representation = new THREE.Mesh(vehicle_body_geometry, body_material.clone());
                this.scene.add(this.body.representation)
                    for (let i = 0;i < 4 ;i++) {
                    if (i == 1 || i == 2) {
                        // this.wheels.constraint[i].motorEquation.enabled = true;
                        // this.wheels.constraint[i].motorEquation.maxForce = 10;
                        // this.wheels.constraint[i].motorEquation.minForce = -10;
                        // this.wheels.constraint[i].motorEquation.targetVelocity = 1;
                    }
                }
            },
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
                    default:
                }
            },
            updatePhysicsStep() {
                // Canonjs
                this.world.step(1/60, 0.1 * this.timestep, 4);
                this.rotatingAngle += Math.PI / 1200;
                for (let i = 0;i < 4 ;i++) {
                    this.wheels.representation[i].position.x = this.wheels.phys[i].position.x;
                    this.wheels.representation[i].position.y = this.wheels.phys[i].position.y;
                    this.wheels.representation[i].position.z = this.wheels.phys[i].position.z;
                    this.wheels.representation[i].quaternion.x = this.wheels.phys[i].quaternion.x;
                    this.wheels.representation[i].quaternion.y = this.wheels.phys[i].quaternion.y;
                    this.wheels.representation[i].quaternion.z = this.wheels.phys[i].quaternion.z;
                    this.wheels.representation[i].quaternion.w = this.wheels.phys[i].quaternion.w;
                    if (i == 0 || i == 3) {
                        const angle = i == 0? this.vehicle.wheelSteerAngle[2]: this.vehicle.wheelSteerAngle[3];
                        this.wheels.constraint[i].axisA.x = this.wheels.axes[i].z * Math.sin(angle);
                        this.wheels.constraint[i].axisA.z = this.wheels.axes[i].z * Math.cos(angle);
                    } else {
                        // this.wheels.constraint[i].motorEquation.maxForce *= 1.001;
                        // this.wheels.constraint[i].motorEquation.minForce *= 1.001;
                        // this.wheels.constraint[i].motorEquation.targetVelocity *= 1.001;
                    }
                }
                this.body.representation.position.x = this.body.phys.position.x;
                this.body.representation.position.y = this.body.phys.position.y;
                this.body.representation.position.z = this.body.phys.position.z;
                this.body.representation.quaternion.x = this.body.phys.quaternion.x;
                this.body.representation.quaternion.y = this.body.phys.quaternion.y;
                this.body.representation.quaternion.z = this.body.phys.quaternion.z;
                this.body.representation.quaternion.w = this.body.phys.quaternion.w;
            },
            animate: function() {
                requestAnimationFrame( this.animate );
                this.timestep = 0.5;
                this.updatePhysicsStep();

                this.throttle += ( this.up ? ( this.throttle < 2 ? 0.05 * this.timestep : 0 ) : ( this.throttle > 1 ? - 0.1 * this.timestep * (this.throttle - 1) : 0 ) );
                this.brake += ( this.down ? ( this.brake < 1 ? 0.2 * this.timestep : 0 ) : ( this.brake > 0 ? - 0.4 * this.timestep * this.brake : 0 ) );
                if ((this.right && this.vehicle.ackermanSteering.steeringWheelPosition > 0) || (this.left && this.vehicle.ackermanSteering.steeringWheelPosition < 0)) {
                    // When changing steering side make the steer crispier
                    this.vehicle.ackermanSteering.steeringWheelPosition *= 0.3;
                }
                this.steerSpeed =
                    Math.min( 0.02 * this.vehicle.maxSpeed / Math.abs(this.vehicle.speed), 1)
                    * ( (this.left ? 0.6 * this.timestep : 0) - (this.right ? 0.6 * this.timestep : 0) ) - (!(this.left || this.right) ?  this.timestep * this.vehicle.ackermanSteering.steeringWheelPosition : 0);
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

                this.vehicle.updateLoad();
                this.vehicle.updateClutchConnection( this.throttle, this.brake, this.timestep / 5 );
                // if (this.vehicle.engine._rot * 60 < 1000) {
                //     this.sound.setVolume(0.75 + (0.5 * (this.throttle - 1)));
                //     this.vehicle.engine._rot * 60
                // }
                this.sound.setVolume(Math.min((this.vehicle.engine._rot * this.vehicle.engine._rot) / (this.vehicle.engine._idle_rot * this.vehicle.engine._idle_rot), 1) * (0.75 + (0.25 * (this.throttle - 1))));
                this.sound.setPlaybackRate( isNaN(this.vehicle.engine._rot) ? 0 : this.vehicle.engine._rot / this.vehicle.engine._idle_rot * 0.9 );
                this.vehicle.updateWheelTransformation( this.timestep / 5, this.steerSpeed );
                this.vehicle.applyTransformation( this.timestep / 5 );
                this.scene.updateMatrixWorld();
                this.controls.target.copy(this.vehicle.center.clone());
                this.controls.update();
                this.renderer.render( this.scene, this.camera );
            }
        }
    }
</script>
