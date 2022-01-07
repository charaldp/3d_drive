export default {
    props: [
        'arguments',
        'meshMaterial',
    ],
    data() {
        return {
            geometry: null
        }
    },
    watch: {
        arguments() {
            // console.log(this.mesh);
            // this.mesh.dispose()
            this.$parent.$parent.scene.remove(this.mesh)
            this.geometry.dispose()
            this.transferAguments()
            this.fabricate()
            this.addToScene()
        }
    },
    created() {

    },
    mounted() {
        this.$nextTick(() => {
            this.transferAguments()
            this.fabricate()
            this.addToScene()
        })
    },
    methods: {
        addToScene() {
            console.log(this.$parent, this.$parent.$parent, this.mesh);
            this.$parent.$parent.scene.add(this.mesh)
        },

    }
}
