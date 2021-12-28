import axios from 'axios'

export default {
    data() {
        return {
            model_mode: 'create',
            modes: {
                create: 'Create',
                edit: 'Update',
            }
        }
    },
    computed: {
        button_slot() {
            return this.modes[this.model_mode];
        },
    },
    methods: {
        on_submit() {
            var url = "/"+(this.model_mode == 'create' ? this.instance_name:+this.instance_name+"/"+this.model.id+"/edit")
            console.log(url, this.form_object);
            axios.post(url, this.form_object)
            .then(
                response => {
                    if (this.model_mode == 'create') {
                        this.$store.commit('model', {model: response.data, type: this.instance_name})
                        this.model_mode = 'edit';
                    }
                }
            )
            .catch(error => {
                console.error("There was an error!", error);
            });
        },
    },
}
