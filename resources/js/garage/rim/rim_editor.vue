<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-5">
                <div class="portlet-header">
                    <div>Dimensions</div>
                </div>
                <div class="portlet-body">
                    <div v-for="(value, dimension) in this.rim.type_dimensions" :key="dimension" class="form-group col-md-12">
                        <label class="col-md-5 control-label" :for="'rim_'+dimension" v-html="$trans('vehicle.'+dimension_names[dimension])"></label>
                        <div class="col-md-5">
                            <input type="text" class="form-control" :id="'rim_'+dimension" style="text-align:right" :value="rim.type_dimensions[dimension]" @change="onDimensionChange(dimension, $event.target.value)">
                        </div>
                        <label class="col-md-2 control-label" :for="'rim_'+dimension">{{'mm'}}</label>
                    </div>
                </div>
            </div>
            <div class="col-md-7">
                <div class="portlet-header">
                    <div>Dimensions</div>
                </div>
                <div class="portlet-body">
                    <models-scene
                        :models="[{...this.rim,...{model_specifier: 'rim'}}]"
                    >
                    </models-scene>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex';
import utilitiesMixin from '../../utilitiesMixin.js';

export default {
    name: 'rim-editor',
    props: [
        'rim_in',
        'dimension_names',
    ],
    mixins: [utilitiesMixin],
    data() {
        return {

        };
    },
    created() {
        this.$store.commit('rim', {rim: this.rim_in, type: 'rim'});
    },
    computed: {
        ...mapState(['rim']),
    },
    methods: {
        onDimensionChange(dimension, value) {
            var obj = {changes: {rim: {type_dimensions: {}}}}
            obj.changes.rim.type_dimensions[dimension] = value
            this.$store.commit('MERGE', obj)
        }

    }
}
</script>
