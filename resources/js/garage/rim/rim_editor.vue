<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-5">
                <div class="portlet-header">
                    <div>Dimensions</div>
                </div>
                <div class="portlet-body">
                    <div v-for="(value, dimension) in this.model.type_dimensions" :key="dimension" class="form-group col-md-12">
                        <label class="col-md-5 control-label" :for="'rim_'+dimension" v-html="dimension_names[dimension]"></label>
                        <div class="col-md-5">
                            <input type="text" class="form-control" :id="'rim_'+dimension" style="text-align:right" :value="model.type_dimensions[dimension]" @change="onDimensionChange(dimension, $event.target.value)">
                        </div>
                        <label class="col-md-2 control-label" :for="'rim_'+dimension">{{'mm'}}</label>
                    </div>
                    <button @click="on_submit">{{button_slot}}</button>
                </div>
            </div>
            <div class="col-md-7">
                <div class="portlet-header">
                    <div>Dimensions</div>
                </div>
                <div class="portlet-body">
                    <models-scene
                        :models="[{...this.model,...{model_specifier: 'rim'}}]"
                    >
                    </models-scene>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex';
import utilitiesMixin from '../../utilitiesMixin.js'
import ModelEditor from '../ModelEditor.js'


export default {
    name: 'rim-editor',
    props: [
        'rim_in',
        'dimension_names',
    ],
    mixins: [utilitiesMixin, ModelEditor],
    data() {
        return {
            instance_name: 'rim',
        };
    },
    created() {
        this.$store.commit('model', {model: this.rim_in, type: 'rim'});
        // this.connection = new WebSocket("")
    },
    computed: {
        form_object() {
            return {type_dimensions: this.model.type_dimensions, rim_type: this.model.rim_type}
        },
        ...mapState(['model']),
    },
    methods: {
        onDimensionChange(dimension, value) {
            var obj = {changes: {model: {type_dimensions: {}}}}
            obj.changes.model.type_dimensions[dimension] = +value
            this.$store.commit('MERGE', obj)
            console.log(this.model.type_dimensions);
        }

    }
}
</script>
