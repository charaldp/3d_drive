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
            var url = "/"+(this.model_mode == 'create' ? this.instance_name:this.instance_name+"/"+this.model.id)
            console.log(url, this.form_object);
            this.model_mode
            if (this.model_mode == 'create') {
                axios.post(url, this.form_object)
                .then(
                    response => {
                        if (this.model_mode == 'create') {
                            this.$store.commit('model', {model: response.data, type: this.instance_name})
                            this.model_mode = 'edit';
                            this.$router.replace('/'+this.instance_name+"/"+this.model.id);
                        }
                    }
                )
                .catch(error => {
                    console.error("There was an error!", error);
                });
            } else {
                axios.patch(url, this.form_object)
                .then(
                    response => {
                        this.$store.commit('model', {model: response.data, type: this.instance_name})
                    }
                )
                .catch(error => {
                    console.error("There was an error!", error);
                });
            }
        },
    },
}
