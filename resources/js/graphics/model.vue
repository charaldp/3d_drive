<template>
    <div>
        <rim
            v-if="this.model_specifier == this.models.rim"
            :arguments="this.arguments"
            :meshMaterial="this.meshMaterial"

        >
        </rim>
        <tire
            v-else-if="this.model_specifier == this.models.tire"
            :arguments="this.arguments"
            :meshMaterial="this.meshMaterial"
        >
        </tire>
    </div>
</template>

<script>
export default {
    props: [
        'model_specifier',
        'arguments',
        'meshMaterial',
    ],
    data() {
        return {
            models: {
                rim: 'rim',
                tire: 'tire',
                wheel: 'wheel',
                car: 'car',
                bike: 'bike',
            },
        }
    }
}
</script>

<style>

</style>
