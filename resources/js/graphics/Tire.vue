<template>

</template>

<script>
import MidelMixin from './ModelMixin';
export default {
    name: 'tire',
    mixins: [MidelMixin],
    data() {
        return {
            tireType: this.arguments.tireType,
            tireDims: this.arguments.tireDims,
        }
    },
    methods: {
        transferAguments() {
            this.tireType = this.arguments.tire_type
            this.tireDims = this.arguments.type_dimensions
        },
        fabricate() {
            var points;
            switch( this.tireType ) {
                case 'Flat':
                    points = [new THREE.Vector2( this.tireDims.DI / 2, 0 ), new THREE.Vector2( this.tireDims.DO / 2, 0 ), new THREE.Vector2( this.tireDims.DO / 2, this.tireDims.t ), new THREE.Vector2( this.tireDims.DI / 2, this.tireDims.t )]
                    break;
                case 'Round':
                    points = [new THREE.Vector2( this.tireDims.DI / 2, this.tireDims.intrWidth )]
                    for ( var i = 0; i < 16; i++ )
                        points.push();

            }
            this.geometry = new THREE.LatheGeometry( points, 64 ).rotateX( Math.PI / 2 );
            this.mesh = new THREE.Mesh( this.geometry, this.meshMaterial.tire.clone() );
        }
    }
}
</script>
