<template>
  <l-map class="h-100 w-100 u-z-index-0"
    :zoom="16"
    :center="myPosition"
    :options="{ zoomControl: false }"
    ref="map">
    <l-control-zoom position="bottomright"></l-control-zoom>
    <l-tile-layer class="h-100"
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      :attribution="attribution"></l-tile-layer>
    <template v-if="isPosition">
      <l-marker
        :lat-lng="myPosition">
        <l-icon
          :icon-size="[32, 50]"
          :icon-anchor="[16, 50]"
          :shadow-size="[50, 50]"
          :icon-url="require('@/assets/images/icon_nav_me.svg')"
          shadow-url="https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png">
        </l-icon>
      </l-marker>
      <l-circle
        :lat-lng="myPosition"
        :radius="10"></l-circle>
      <l-control
        position="bottomright">
        <div class="leaflet-bar">
          <a href="#" class="leaflet-touch" @click.prevent="goMyPosition()">
            <i class="fas fa-crosshairs fa-lg"></i>
          </a>
        </div>
      </l-control>
    </template>
    <l-marker-cluster :options="{ disableClusteringAtZoom: 18 }">
      <l-marker v-for="(item, key) in allStores" :key="key"
        :lat-lng="[item.geometry.coordinates[1],item.geometry.coordinates[0]]"
        ref="marker"
        @click="$emit('toggleOpen')">
        <l-popup :options="{ closeButton: false }">
            <div class="d-flex mb-18 justify-content-between">
              <div>
                <h4 class="d-inline-block mr-18 mb-4">{{ item.properties.name }}</h4>
                <span class="u-fz-md" v-if="item.properties.distance">
                  {{ item.properties.distance > 1000 ?
                    `${Math.round((item.properties.distance / 1000) * 10) / 10}km` :
                    `${Math.round(item.properties.distance)}m` }}
                </span>
                <div class="text-muted">{{ item.properties.updated }}</div>
              </div>
              <div class="ml-40">
                <a href="#" class="d-block mb-13"
                  @click.prevent.stop="$emit('toggleStared', item.properties.id)">
                  <img src="../assets/images/icon_star_selected.svg" alt="icon_star_selected"
                    v-if="item.properties.stared">
                  <img src="../assets/images/icon_star_unselected.svg" alt="icon_star_unselected"
                    v-else>
                </a>
                <a class="d-block" :href="`https://www.google.com.tw/maps/search/${item.properties.address}`"
                  target="_blank">
                  <img src="../assets/images/icon_nav.svg" alt="icon_nav">
                </a>
              </div>
            </div>
            <div class="d-flex justify-content-between text-center">
              <div class="flex-fill w-100 d-flex align-items-center
                u-border-radius-md text-white u-fz-sm px-13 mr-15"
                :class="item.properties.mask_adult ? 'bg-info' : 'bg-gray-400'">成人
                <span class="u-fz-lg u-letter-spacing-0 flex-grow-1 ml-5">
                  {{ item.properties.mask_adult | number }}
                </span>
              </div>
              <div class="flex-fill w-100 d-flex align-items-center
                u-border-radius-md text-white u-fz-sm px-13"
                :class="item.properties.mask_child ? 'bg-info' : 'bg-gray-400'">兒童
                <span class="u-fz-lg u-letter-spacing-0 flex-grow-1 ml-5">
                  {{ item.properties.mask_child | number }}
                </span>
              </div>
            </div>
        </l-popup>
        <l-icon
          className='p-map__icon text-center'
          :icon-size="[90, 90]"
          :icon-anchor="[45, 90]"
          :popup-anchor="[0, -80]">
          <span style="line-height: 85px" class="text-white">
            {{ item.properties.mask_total >= 2000 ? '2K+' : item.properties.mask_total }}
          </span>
          </l-icon>
      </l-marker>
    </l-marker-cluster>
  </l-map>
</template>
<script>
export default {
  name: 'Map',
  props: {
    allStores: Array,
    myPosition: Array,
    isPosition: Boolean,
    stared: Array,
  },
  data: () => ({
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors | Author <a href="https://github.com/Achun1130/osm_mask" target="_blank">Chin</a> | UI <a href="https://challenge.thef2e.com/user/3509?schedule=4438#works-4438" target="_blank">Christy</a>',
  }),
  methods: {
    showPopup(storePosition) {
      this.$nextTick(() => {
        this.$refs.map.mapObject.setView(storePosition, 18);
        const store = this.$refs.marker.find((el) => (
          el.mapObject._latlng.lat === storePosition[0]
          && el.mapObject._latlng.lng === storePosition[1]
        ));
        store.mapObject.openPopup();
      });
    },
    goMyPosition() {
      this.$refs.map.mapObject.setView(this.myPosition, 18);
    },
  },
};
</script>
