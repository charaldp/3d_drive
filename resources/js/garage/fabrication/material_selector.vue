<template>
    <div>
        <select v-model="material[this.name]">
            <option v-for="(material, id) in this.materials" :key="id"
                :value="id"
            >{{material.three_material_type+' | '+material.name}}<button>Delete</button>
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
        }
    }
}
</script>

<style>

</style>
