<template>

</template>

<script>
import Modelmixin from './ModelMixin';
import {mergeBufferGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils'

export default {
    name: 'rim',
    props: [

    ],
    mixins: [Modelmixin],
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
            // console.log(this.mesh);
            // this.mesh.dispose()
            // this.$parent.$parent.scene.remove(this.mesh)
            this.rimGeo.dispose()
            this.transferAguments()
            this.fabricate()
            this.addToScene()
        }
    },
    methods: {
        transferAguments() {
            this.rimType = this.arguments.rim_type
            this.rimDims = this.arguments.type_dimensions
        },
        fabricate() {
            this.rimGeo
            var rimGeo = [];
            console.log(this.rimType);
            switch ( this.rimType ) {
                case 'Ribs':
                    this.points = [
                        [new THREE.Vector2( this.rimDims.DO / 2, this.rimDims.t ), new THREE.Vector2( this.rimDims.DI / 2, this.rimDims.t - this.rimDims.intrWidth ), new THREE.Vector2( this.rimDims.DI / 2, this.rimDims.intrWidth ), new THREE.Vector2( this.rimDims.DO / 2, 0 )],
                        [new THREE.Vector2( this.rimDims.axleDI / 2, this.rimDims.ribsPosition - this.rimDims.tAxle / 2 ), new THREE.Vector2( this.rimDims.axleDO / 2, this.rimDims.ribsPosition - this.rimDims.tAxle / 2 ), new THREE.Vector2( this.rimDims.axleDO / 2, this.rimDims.ribsPosition + this.rimDims.tAxle / 2 - this.rimDims.axleIntrWidth ), new THREE.Vector2( this.rimDims.axleDI / 2, this.rimDims.ribsPosition + this.rimDims.tAxle / 2 ), new THREE.Vector2( 0, this.rimDims.ribsPosition + this.rimDims.tAxle / 2 ) ]]
                    ;
                    var rib = new THREE.CylinderGeometry( this.rimDims.dRib / 2, this.rimDims.dRib / 2, ( this.rimDims.DI - this.rimDims.axleDO ) / 2, 4, 1, true ).rotateY( Math.PI / 4 );
                    const points = rib.attributes.position.array
                    // for ( var i = 0; i < points.length; i+=3 ) {
                    //     points[i+2] *= this.rimDims.tRib / this.rimDims.dRib;
                    // }
                    // rib.setAttribute( 'position', points);
                    rib.attributes.position.needsUpdate = true;

                    rib.translate( 0, ( this.rimDims.DI + this.rimDims.axleDO ) / 4, this.rimDims.ribsPosition );
                    // BoxGeometry( this.rimDims.t, this.rimDims.d, ( this.rimDims.DI - this.rimDims.axleDO ) / 2 )
                    for ( var i = 0; i < this.rimDims.numRibs; i++ ) {
                        rimGeo.push(rib.clone().rotateZ(2 * i * Math.PI / this.rimDims.numRibs ));
                    }

                    break;
                case '':
                default:

                    break;
            }
            console.log(this.rimDims);
            for ( var i = 0; i < this.points.length; i++ ) {
                rimGeo.push(new THREE.LatheGeometry( this.points[i], 64 ).rotateX( Math.PI / 2 ));// + Transform ?
            }
            this.rimGeo = mergeBufferGeometries(rimGeo)
            this.mesh = new THREE.Mesh( this.rimGeo, this.meshMaterial.rim.clone() );
///
        },

    }
}
</script>
