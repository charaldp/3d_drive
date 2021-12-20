<template>
    <div class="portlet-body">
        <div v-for="(value, dimension) in this.rim.type_dimensions" :key="dimension" class="form-group col-md-12">
            <label class="col-md-5 control-label" :for="'rim_'+dimension" v-html="$root.__('vehicle.'+dimension_names.dimension)"></label>
            <div class="col-md-5">
                <input type="text" class="form-control" :id="'rim_'+dimension" style="text-align:right" v-model.number="rim.type_dimensions[dimension]" @change="onDimensionChange(dimension, $event.target.value)">
            </div>
            <label class="col-md-2 control-label" :for="'rim_'+dimension">{{'mm'}}</label>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex';
import utilitiesMixin from '../../utilitiesMixin.js';

export default {
    name: 'rim-editor',
    props: [
        'rim',
        'dimension_names',
    ],
    mixins: [utilitiesMixin],
    data() {
        return {

        };
    },
    created() {
        this.$store.commit('rim', {rim: this.rim, type: 'rim'});
    },
    computed: {
        ...mapState(['rim']),
    },
    methods() {


    }
}
</script>
