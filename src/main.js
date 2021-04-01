import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
// import 'leaflet/dist/leaflet.css';
// import 'leaflet/dist/images/marker-icon.png';
// import 'leaflet/dist/images/marker-shadow.png';

import App from './App.vue';
import '@/assets/scss/all.scss';
import number from './filters/number';
import store from './store';

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);

Vue.filter('number', number);

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
