<template>
  <l-map class="h-100 w-100 u-z-index-0"
    :zoom="zoom"
    :center="center"
    :options="{ zoomControl: false }"
    ref="map">
    <l-control-zoom position="bottomright"></l-control-zoom>
    <l-tile-layer class="h-100"
      :url="url"
      :attribution="attribution"></l-tile-layer>
    <l-marker-cluster :options="{ disableClusteringAtZoom: 16 }">
      <l-marker v-for="(item, key) in allStores" :key="key"
        :lat-lng="[item.geometry.coordinates[1],item.geometry.coordinates[0]]"
        ref="marker">
        <l-popup :options="{ closeButton: false }">
            <div class="d-flex mb-18 justify-content-between">
              <div>
                <h4 class="d-inline-block mr-18 mb-4">{{ item.properties.name }}</h4>
                <span class="u-fz-md">10km</span>
                <div class="text-muted">{{ item.properties.updated }}</div>
              </div>
              <div class="ml-40">
                <a href="#" class="btn p-sidebar__icon js-stared"
                  :class="stared.some((el) => el === item.properties.id) ?
                  'btn-secondary' : 'btn-outline-primary'"
                  @click.prevent="toggleStared(item.properties.id)">
                  <i class="fa-star"
                    :class="stared.some((el) => el === item.properties.id) ? 'fas' : 'far'"></i>
                </a>
                <a :href="`https://www.google.com.tw/maps/search/${item.properties.address}`"
                  class="btn btn-outline-primary p-sidebar__icon mb-0" target="_blank">
                  <i class="fas fa-location-arrow"></i>
                </a>
              </div>
            </div>
            <div class="d-flex">
              <button type="button" class="btn btn-block
                d-flex align-items-center py-0 mr-15 py-0 px-13 u-fz-sm text-white"
                :class="item.properties.mask_adult ? 'btn-info' : 'btn-gray-400'">
                成人
                <span class="u-fz-lg u-letter-spacing-0 flex-grow-1">
                  {{ item.properties.mask_adult | number }}
                </span>
              </button>
              <button type="button" class="btn btn-block mt-0
                d-flex align-items-center py-0 px-13 u-fz-sm text-white"
                :class="item.properties.mask_child ? 'btn-info' : 'btn-gray-400'">
                兒童
                <span class="u-fz-lg u-letter-spacing-0 flex-grow-1">
                  {{ item.properties.mask_child | number }}
                </span>
              </button>
            </div>
        </l-popup>
        <l-icon
          className='p-map__icon text-center'
          :icon-size="[97, 97]"
          :icon-anchor="[48, 97]"
          :popup-anchor="[0, -80]">
          <span style="line-height: 97px" class="text-white">
            {{ item.properties.mask_total >= 2000 ? '2K+' : item.properties.mask_total }}
          </span>
          </l-icon>
      </l-marker>
    </l-marker-cluster>
  </l-map>
</template>
<script>
import {
  LMap, LTileLayer, LControlZoom, LMarker, LPopup, LIcon,
} from 'vue2-leaflet';
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster';
import { mapGetters } from 'vuex';

export default {
  name: 'Map',
  props: {
    allStores: Array,
    storeLocation: Array,
  },
  data: () => ({
    zoom: 18,
    center: [25.040859, 121.528648],
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors | Author Chin | UI <a href="https://challenge.thef2e.com/user/3509?schedule=4438#works-4438" target="_blank">Christy</a>',
  }),
  methods: {
    toggleStared(id) {
      this.$store.commit('toggleStared', id);
    },
    test() {
      this.$nextTick(() => {
        this.$refs.map.mapObject.setView(this.storeLocation, 18);
        const store = this.$refs.marker.find((el) => (
          // eslint-disable-next-line no-underscore-dangle
          el.mapObject._latlng.lat === this.storeLocation[0]
        ));
        store.mapObject.openPopup();
      });
    },
  },
  computed: {
    ...mapGetters(['stared']),
  },
  watch: {
    storeLocation: 'test',
  },
  mounted() {
    this.$nextTick(() => {
      if (this.allStores.length) {
        this.$refs.marker.forEach((el) => {
          el.mapObject.on('click', () => {
            this.$store.commit('toggleIsOpen');
          });
        });
      }
    });
  },
  components: {
    LMap,
    LTileLayer,
    LControlZoom,
    'l-marker-cluster': Vue2LeafletMarkerCluster,
    LMarker,
    LPopup,
    LIcon,
  },
};
</script>
