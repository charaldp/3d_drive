import { getField, updateField } from 'vuex-map-fields';
import {stateMerge} from 'vue-object-merge'
export default {
    state: {
        stateData: {},
        model: {},
        material: {},
    },

    getters: {
        getField,
        getStateData(state){ //take parameter state
            return state.stateData
        },
        getModel(state){ //take parameter state
            return state.model
        },
        getMaterial(state){ //take parameter state
            return state.material
        },
    },
    mutations: {
        updateField,
        stateData(state, payload) {
            return state.stateData = Object.assign({}, state.stateData, payload.stateData)
        },
        model(state, payload) {
            return state.model = Object.assign({}, state.model, payload.model)
        },
        material(state, payload) {
            return state.material = Object.assign({}, state.material, payload.material)
        },
        MERGE(state, value) {
			stateMerge(state, value.changes, null, value.ignoreNull)
		},
    }
}
