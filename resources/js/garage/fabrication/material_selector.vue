<template>
    <div>
        <select v-model="material[name]">
            <option v-for="(a_material, id) in this.materials" :key="id" @change="onMaterialChange"
                :value="id"
            >{{a_material.three_material_type+' | '+a_material.name}}
            </option>
        </select>
        <button>Add</button>
    </div>
</template>

<script>
import axios from 'axios';
import {mapState} from 'vuex';

export default {
    props: [
        'name',
        'group',
    ],
    data() {
        return {
            materials: [],
        }
    },
    computed: {
        ...mapState(['material'])
    },
    created() {
        let obj = {changes: {material: {}}};
        obj.changes.material[this.name] = {};
        this.$store.commit('MERGE', obj);
        this.getMaterials();
    },
    mounted() {

    },
    methods: {
        getMaterials() {
            axios.get('/material', {})
            .then(
                response => {
                    this.materials = response.data;
                }
            )
            .catch(error => {
                console.error("There was an error!", error);
            });
        },
        onMaterialChange(event) {
            if (event.target.options.selectedIndex > -1) {
                const value = event.target.options[event.target.options.selectedIndex].value;
                this.$store.commit('MERGE', {type: "material_selection", material_name: this.name, material_id: value})

            }
        },
    }
}
</script>

<style>

</style>
