/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');
window.THREE = require('three');
import Vuex from 'vuex';
import { mapState } from 'vuex';
import * as Three from 'three';
import storeData from "./store/index.js"

import VueRouter from 'vue-router'
Vue.use(VueRouter)
Vue.use(Three)

// import VueThreejs from 'vue-threejs'
// Vue.use(VueThreejs)
/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

// Vue.component('example-component', require('./components/ExampleComponent.vue').default);
Vue.component('scene-component', require('./components/scene.vue').default);
Vue.component('scene-simple', require('./components/sceneSimple.vue').default);
Vue.component('material-selector', require('./garage/fabrication/material_selector.vue').default);
Vue.component('material-editor', require('./garage/fabrication/material_editor.vue').default);

Vue.component('tire-editor', require('./garage/tire/tire_editor.vue').default);
Vue.component('rim-editor', require('./garage/rim/rim_editor.vue').default);
Vue.component('models-scene', require('./graphics/models_scene.vue').default);
Vue.component('model', require('./graphics/model.vue').default);
Vue.component('rim', require('./graphics/Rim.vue').default);
Vue.component('tire', require('./graphics/Tire.vue').default);

import Vue from 'vue';
import VueLang from '@eli5/vue-lang-js'
window.THREE = require('three')

Vue.use(VueLang, {
    messages: 'messages.js', // Provide locale file
    locale: 'en', // Set locale
    fallback: 'en' // Set fallback lacale
})

const store = new Vuex.Store(
    storeData
 )

 const routes = [];

 const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
  })


/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    store, //vuex
    router,
    data() {
        return {
        }
    },
    methods: {
    //     __(search_string = '', translation_object={}) {
    //         var path_localization_array = search_string.split('.');
    //         if (path_localization_array.length > 1) {
    //             var localization_object = Object.assign({}, this.$root.$refs.lang.lang[path_localization_array[0]]);
    //             for (var i = 1; i < path_localization_array.length - 1; i++) {
    //                 localization_object = Object.assign({},localization_object[path_localization_array[i]]);
    //             }
    //             var localizationString = localization_object[path_localization_array[i]];
    //         } else {
    //             var localizationString = this.$root.$refs.lang.lang[path_localization_array[0]];
    //         }
    //         if (typeof localizationString === 'string') {
    //             for (var key in translation_object) {
    //                 localizationString = localizationString.replace(':'+key,translation_object[key]);
    //             }
    //         }
    //         return localizationString;
    //     },
    }
});
