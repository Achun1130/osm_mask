import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { Icon } from 'leaflet';
import {
  LMap, LTileLayer, LControlZoom, LMarker, LPopup, LIcon, LCircle, LControl,
} from 'vue2-leaflet';
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import App from './App.vue';
import number from './filters/number';
import store from './store';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'leaflet/dist/images/marker-icon-2x.png',
  iconUrl: 'leaflet/dist/images/marker-icon.png',
  shadowUrl: 'leaflet/dist/images/marker-shadow.png',
});

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-control-zoom', LControlZoom);
Vue.component('l-marker', LMarker);
Vue.component('l-popup', LPopup);
Vue.component('l-icon', LIcon);
Vue.component('l-circle', LCircle);
Vue.component('l-control', LControl);
Vue.component('l-marker-cluster', Vue2LeafletMarkerCluster);
Vue.component('loading', Loading);

Vue.filter('number', number);

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
