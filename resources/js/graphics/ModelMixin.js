export default {
    props: [
        'arguments',
        'meshMaterial',
    ],
    data() {
        return {

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
