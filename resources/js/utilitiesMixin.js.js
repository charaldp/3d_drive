export default {
    data() {
        return {
            fixed_number_decimals: 4,
        }
    },
    methods: {
        num_form(value) {
            return (+value).toFixed(this.fixed_number_decimals);
        },
        changeDimension(dimension, value, path = '', type = 'component_geometry') {
            var component_obj = {};
            if (isNaN(value) && value < 0) {
                value = 0;
            }
            if (path != '') {
                component_obj[path] = {};
                component_obj[path][dimension] = this.num_form(value);
            } else {
                component_obj[dimension] = this.num_form(value);
            }
            this.$store.commit('MERGE', {changes: {component: component_obj}, type: type, dimension: dimension});
        },
    }
}
