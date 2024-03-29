import * as THREE from 'three';
import {mergeBufferGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils';
// import 'three';
  class Rim {
  constructor( rimType, rimDims, meshMaterial ) {
    // new Tire( 'Ribs', { DO: 400, DI: 360, t: 200, intrWidth:  22, numRibs: 8, tRib: 10, dRib: 25, ribsPosition: 100, axleIntrWidth: 20, axleDI: 50 , axleDO: 100, tAxle: 50 },  )

    this.rimGeo = new THREE.BufferGeometry();
    switch ( rimType ) {
      case 'Ribs':
        this.points = [[new THREE.Vector2( rimDims.DO / 2, rimDims.t ), new THREE.Vector2( rimDims.DI / 2, rimDims.t - rimDims.intrWidth ), new THREE.Vector2( rimDims.DI / 2, rimDims.intrWidth ), new THREE.Vector2( rimDims.DO / 2, 0 )],
                       [new THREE.Vector2( rimDims.axleDI / 2, rimDims.ribsPosition - rimDims.tAxle / 2 ), new THREE.Vector2( rimDims.axleDO / 2, rimDims.ribsPosition - rimDims.tAxle / 2 ), new THREE.Vector2( rimDims.axleDO / 2, rimDims.ribsPosition + rimDims.tAxle / 2 - rimDims.axleIntrWidth ), new THREE.Vector2( rimDims.axleDI / 2, rimDims.ribsPosition + rimDims.tAxle / 2 ), new THREE.Vector2( 0, rimDims.ribsPosition + rimDims.tAxle / 2 ) ]];
        var rib = new THREE.CylinderGeometry( rimDims.dRib / 2, rimDims.dRib / 2, ( rimDims.DI - rimDims.axleDO ) / 2, 4, 1, true ).rotateY( Math.PI / 4 );
        const positions = rib.attributes.position.array;
        for ( var i = 0; i < positions.length; i+=3 ) positions[i+2] *= rimDims.tRib / rimDims.dRib;
        rib.setAttribute('position', new THREE.BufferAttribute( positions, 3 ) );
        rib.attributes.normal.needsUpdate = true;
        rib.attributes.uv.needsUpdate = true;
        rib.attributes.position.needsUpdate = true;
        rib.translate( 0, ( rimDims.DI + rimDims.axleDO ) / 4, rimDims.ribsPosition );
        // BoxGeometry( rimDims.t, rimDims.d, ( rimDims.DI - rimDims.axleDO ) / 2 )
        var rimGeos = [];
        for ( var i = 0; i < rimDims.numRibs; i++ ) {
            rimGeos.push(rib.clone().rotateZ(2 * i * Math.PI / rimDims.numRibs ));
        }
        this.rimGeo = mergeBufferGeometries(rimGeos);

        break;
      case '':

        break;
    }
    var rim_outer_parts = [];
    for ( var i = 0; i < this.points.length; i++ ) {
        rim_outer_parts.push(new THREE.LatheGeometry( this.points[i], 64 ).rotateX( Math.PI / 2 ));// + Transform ?
    }
    rim_outer_parts.push(this.rimGeo.clone());

    this.rimGeo = mergeBufferGeometries(rim_outer_parts);
    this.meshOut = new THREE.Mesh( this.rimGeo, meshMaterial.rim.clone() );

  }
}
export default {Rim}
