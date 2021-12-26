<template>

</template>

<script>
import MidelMixin from './ModelMixin';
export default {
    name: 'rim',
    props: [

    ],
    mixins: [MidelMixin],
    data() {
        return {
            rimType: null,
            rimDims: null,
            rimGeo: null,
        }
    },
    mounted() {
    },
    watch: {
        arguments() {
            this.transferAguments()
            this.fabricate()
        }
    },
    methods: {
        transferAguments() {
            this.rimType = this.arguments.rim_type
            this.rimDims = this.arguments.type_dimensions
        },
        fabricate() {
            this.rimGeo = new THREE.BufferGeometry();
            console.log(this.rimType);
            switch ( this.rimType ) {
                case 'Ribs':
                    this.points = [[new THREE.Vector2( this.rimDims.DO / 2, this.rimDims.t ), new THREE.Vector2( this.rimDims.DI / 2, this.rimDims.t - this.rimDims.intrWidth ), new THREE.Vector2( this.rimDims.DI / 2, this.rimDims.intrWidth ), new THREE.Vector2( this.rimDims.DO / 2, 0 )],
                                [new THREE.Vector2( this.rimDims.axleDI / 2, this.rimDims.ribsPosition - this.rimDims.tAxle / 2 ), new THREE.Vector2( this.rimDims.axleDO / 2, this.rimDims.ribsPosition - this.rimDims.tAxle / 2 ), new THREE.Vector2( this.rimDims.axleDO / 2, this.rimDims.ribsPosition + this.rimDims.tAxle / 2 - this.rimDims.axleIntrWidth ), new THREE.Vector2( this.rimDims.axleDI / 2, this.rimDims.ribsPosition + this.rimDims.tAxle / 2 ), new THREE.Vector2( 0, this.rimDims.ribsPosition + this.rimDims.tAxle / 2 ) ]];
                    var rib = new THREE.CylinderGeometry( this.rimDims.dRib / 2, this.rimDims.dRib / 2, ( this.rimDims.DI - this.rimDims.axleDO ) / 2, 4, 1, true ).rotateY( Math.PI / 4 );
                    const ponits = rib.attributes.position.array
                    for ( var i = 0; i < ponits.length; i+=3 ) {
                        ponits[i+2] *= this.rimDims.tRib / this.rimDims.dRib;
                    }
                    rib.translate( 0, ( this.rimDims.DI + this.rimDims.axleDO ) / 4, this.rimDims.ribsPosition );
                    // BoxGeometry( this.rimDims.t, this.rimDims.d, ( this.rimDims.DI - this.rimDims.axleDO ) / 2 )
                    for ( var i = 0; i < this.rimDims.numRibs; i++ ) {
                    this.rimGeo.merge(rib.clone().rotateZ(2 * i * Math.PI / this.rimDims.numRibs ));
                    }

                    break;
                case '':
                default:

                    break;
            }
            for ( var i = 0; i < this.points.length; i++ ) {
            this.rimGeo.merge( new THREE.LatheGeometry( this.points[i], 64 ).rotateX( Math.PI / 2 ) );// + Transform ?
            }
            this.mesh = new THREE.Mesh( this.rimGeo, this.meshMaterial.rim.clone() );
///
        },

    }
}
</script>
