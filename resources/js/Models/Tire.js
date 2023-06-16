import * as THREE from 'three';
// import 'three';
class Tire {
  constructor( tireType, tireDims, meshMaterial ) {

    switch( tireType ) {
      case 'Flat':
        this.points = [new THREE.Vector2( tireDims.DI / 2, 0 ), new THREE.Vector2( tireDims.DO / 2, 0 ), new THREE.Vector2( tireDims.DO / 2, tireDims.t ), new THREE.Vector2( tireDims.DI / 2, tireDims.t )]
        break;
      case 'Round':
        var prototype_vector = new THREE.Vector2( tireDims.DI / 2, tireDims.intrWidth / 2);
        var rotating_vector = new THREE.Vector2( 0, -tireDims.intrWidth / 2)
        var zero_vector = new THREE.Vector2(0, 0);
        this.points = [prototype_vector.clone().add(rotating_vector)];
        for ( var i = 0; i <= tireDims.numPoints; i++ )
          this.points.push( prototype_vector.clone().add(rotating_vector.clone().rotateAround(zero_vector, Math.PI * i / tireDims.numPoints)));

    }
    this.tireGeo = new THREE.LatheGeometry( this.points, 64 ).rotateX( Math.PI / 2 );
    this.meshOut = new THREE.Mesh( this.tireGeo, meshMaterial.tire.clone() );
  }

}
export default {Tire};
