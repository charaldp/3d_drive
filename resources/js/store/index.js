import { getField, updateField } from 'vuex-map-fields';
import {stateMerge} from 'vue-object-merge'
export default {
    state: {
        stateData: {},
        rim: {},
    },

    getters: {
        getField,
        getStateData(state){ //take parameter state
            return state.stateData
        },
        getRim(state){ //take parameter state
            return state.rim
        },
    },
    mutations: {
        updateField,
        stateData(state, payload) {
            return state.stateData = Object.assign({}, state.stateData, payload.stateData)
        },
        rim(state, payload) {
            return state.rim = Object.assign({}, state.rim, payload.rim)
        },
        MERGE(state, value) {
			stateMerge(state, value.changes, null, value.ignoreNull)
		},
    }
}
