import { getField, updateField } from 'vuex-map-fields';
import {stateMerge} from 'vue-object-merge'
export default {
    state: {
        stateData: {},
        model: {},
    },

    getters: {
        getField,
        getStateData(state){ //take parameter state
            return state.stateData
        },
        getModel(state){ //take parameter state
            return state.model
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
        MERGE(state, value) {
			stateMerge(state, value.changes, null, value.ignoreNull)
		},
    }
}
