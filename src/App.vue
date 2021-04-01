<template>
  <main id="app" class="h-100">
    <loading :active.sync="isLoading"></loading>
    <div class="p-sidebar"
      :class="{ 'active': isOpen }">
      <a href="#" class="p-sidebar__toggle d-none d-sm-block"
        @click.prevent="toggleIsOpen(true)">
        <img src="./assets/images/bg_drag.svg" alt="toggle-icon">
      </a>
      <div class="p-sidebar__body h-100">
        <div class="d-flex align-items-center">
          <h1>口罩即時地圖</h1>
          <div class="ml-auto text-right">
            <div class="text-muted">資料來源：衛福部</div>
            <div class="u-fz-md">2020年02月08日</div>
          </div>
        </div>
        <div class="p-sidebar__image">
          <h2>星期六</h2>
          <span class="u-fz-lg u-line-height-20-38 mb-0">今天身分證<span class="h4 mx-2">最後一碼</span>為<br>
            <span class="u-fz-2x text-secondary mr-14">0.2.4.6.8</span>
            的人可購買!
          </span>
        </div>
        <label for="county" class="u-fz-lg">選擇區域</label>
        <div class="form-row">
          <div class="form-group col">
            <select class="custom-select" v-model="location.county" @change="changeCounty()">
              <option value="" disabled>縣市</option>
              <option :value="item.CityName"
                v-for="(item, key) in countyData" :key="key">{{ item.CityName }}</option>
            </select>
          </div>
          <div class="form-group col">
            <select class="custom-select" v-model="location.town"
              @change="filterAndSort(); goStore(stores[0])">
              <option value="" disabled>鄉鎮市區</option>
              <option :value="item.AreaName"
                v-for="(item, key) in AreaList" :key="key">{{ item.AreaName }}</option>
            </select>
          </div>
        </div>
        <label for="location" class="u-fz-lg">或 輸入關鍵字</label>
        <div class="position-relative">
          <input type="text" id="location" class="form-control pr-71" placeholder="中山路"
            v-model="location.keyword"
            @keydown.enter="filterAndSort()">
          <a href="#" class="p-sidebar__search p-8"
            @click.prevent="filterAndSort()">
            <i class="fas fa-search fa-lg fa-fw"></i>
          </a>
        </div>
        <div class="d-flex justify-content-between mt-23">
          <button type="button" class="btn"
            :class="{
              'btn-secondary': mask === 'all',
              'btn-outline-primary': mask !== 'all'
            }"
            @click="mask = 'all'">所有口罩</button>
          <button type="button" class="btn"
            :class="{
              'btn-secondary': mask === 'adult',
              'btn-outline-primary': mask !== 'adult'
            }"
            @click="mask = 'adult'">成人口罩</button>
          <button type="button" class="btn"
            :class="{
              'btn-secondary': mask === 'child',
              'btn-outline-primary': mask !== 'child'
            }"
            @click="mask = 'child'">兒童口罩</button>
        </div>
        <hr class="w-75">
        <div class="d-flex align-items-center mb-33">
          <h3>尚有庫存店家</h3>
          <button type="button"
            class="btn btn-sm ml-14 ml-sm-40 mr-8"
            :class="status.isNear ? 'btn-secondary' : 'btn-outline-primary'"
            @click="status.isNear = true">距離最近</button>
          <button type="button" class="btn btn-sm mr-8"
            :class="!status.isNear ? 'btn-secondary' : 'btn-outline-primary'"
            @click="status.isNear = false;">存量最多</button>
          <button type="button" class="btn btn-sm"
            :class="status.isStared ? 'btn-secondary' : 'btn-outline-primary'"
            @click="status.isStared = !status.isStared">已標星號</button>
        </div>
        <a href="#" class="p-sidebar__card mb-23"
          @click.prevent="goStore(item); toggleIsOpen()"
          v-for="(item, key) in stores" :key="key">
          <div class="d-flex mb-18">
            <div>
              <h4 class="d-inline-block mr-18 mb-6">{{ item.properties.name }}</h4>
              <span class="u-fz-md">10km</span>
              <ul class="list-unstyled mb-0">
                <li class="u-fz-md mb-6">{{ item.properties.address }}</li>
                <li class="u-fz-md mb-6">{{ item.properties.phone }}</li>
                <li class="u-fz-md">{{ item.properties.note }}</li>
              </ul>
            </div>
            <div class="ml-auto">
              <a href="#" class="btn p-sidebar__icon"
                :class="{
                  'btn-outline-primary':  !stared.some((el) => el === item.properties.id),
                  'btn-secondary':  stared.some((el) => el === item.properties.id)
                }"
                @click.prevent.stop="toggleStared(item.properties.id)">
                <i class="far fa-star" v-if="!stared.some((el) => el === item.properties.id)"></i>
                <i class="fas fa-star" v-if="stared.some((el) => el === item.properties.id)"></i>
              </a>
              <a :href="`https://www.google.com.tw/maps/search/${item.properties.address}`"
                class="btn btn-outline-primary p-sidebar__icon" target="_blank">
                <i class="fas fa-location-arrow"></i>
              </a>
            </div>
          </div>
          <div class="d-flex">
            <button type="button" class="btn btn-block
              d-flex align-items-center py-0 mr-29 py-0 px-30"
              :class="{
                'btn-info': item.properties.mask_adult,
                'btn-gray-400': !item.properties.mask_adult,
              }">
              成人
              <span class="h1 u-letter-spacing-0 flex-grow-1">
                {{ item.properties.mask_adult | number }}
              </span>
            </button>
            <button type="button" class="btn btn-block mt-0
              d-flex align-items-center py-0 px-30"
              :class="{
                'btn-info': item.properties.mask_child,
                'btn-gray-400': !item.properties.mask_child,
              }">
              兒童
              <span class="h1 u-letter-spacing-0 flex-grow-1">
                {{ item.properties.mask_child | number }}
              </span>
            </button>
          </div>
          <div class="text-muted text-right mt-5">{{ item.properties.updated }}</div>
        </a>
        <!-- <div class="p-sidebar__card mb-23">
          <div class="d-flex mb-18">
            <div>
              <h4 class="d-inline-block mr-18 mb-6">杏元藥局</h4>
              <span class="u-fz-md">350m</span>
              <ul class="list-unstyled mb-0">
                <li class="u-fz-md mb-6">235新北市中和區員山路172號</li>
                <li class="u-fz-md mb-6">+886 2 2223 6868</li>
                <li class="u-fz-md">今日營業時間：Open now: 9am–10:30pm</li>
              </ul>
            </div>
            <div class="ml-auto">
              <a href="#" class="btn btn-secondary p-sidebar__icon">
                <i class="fas fa-star"></i>
              </a>
              <a href="#" class="btn btn-outline-primary p-sidebar__icon">
                <i class="fas fa-location-arrow"></i>
              </a>
            </div>
          </div>
          <div class="d-flex">
            <button type="button" class="btn btn-block btn-gray-400
              d-flex align-items-center py-0 mr-29 py-0 px-30">
              成人<span class="h1 u-letter-spacing-0 flex-grow-1">777</span>
            </button>
            <button type="button" class="btn btn-block btn-info mt-0
              d-flex align-items-center py-0 px-30">
              兒童<span class="h1 u-letter-spacing-0 flex-grow-1">345</span>
            </button>
          </div>
          <div class="text-muted text-right mt-5">2020/02/08 23:35更新</div>
        </div> -->
      </div>
    </div>
    <!-- <div id="map" class="h-100 u-z-index-0"></div> -->
    <Map :allStores="allStores" :storeLocation="storeLocation"/>
  </main>
</template>

<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import { mapGetters, mapMutations } from 'vuex';

import countyData from './assets/json/county.json';
import Map from './components/Map.vue';

export default {
  name: 'App',
  data: () => ({
    location: {
      keyword: '',
      county: '',
      town: '',
    },
    allStores: [],
    stores: [],
    countyData,
    AreaList: [],
    mask: 'all',
    status: {
      isNear: true,
      isStared: false,
    },
    isLoading: false,
    storeLocation: [],
  }),
  methods: {
    getData() {
      const vm = this;
      const api = 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json';

      vm.$http.get(api).then((response) => {
        vm.allStores = response.data.features.filter((el) => (
          el.properties.mask_adult + el.properties.mask_child
        ));
        vm.allStores.forEach((el) => {
          el.properties.mask_total = el.properties.mask_adult + el.properties.mask_child;
        });
      });
    },
    filterTown() {
      const vm = this;
      vm.AreaList = vm.countyData.filter((el) => el.CityName === vm.location.county)[0].AreaList;
    },
    changeCounty() {
      this.location.town = '';
      this.filterTown();
      this.filterAndSort();
      this.goStore(this.stores[0]);
    },
    filterStore() {
      const vm = this;
      const keyword = vm.location.keyword.split(' ');
      const arr = [vm.location.county, vm.location.town, ...keyword];

      vm.stores = vm.allStores;
      arr.forEach((word) => {
        vm.stores = vm.stores.filter((el) => {
          const {
            address,
            name,
            note,
            phone,
          } = el.properties;
          const condition = address + name + note + phone;
          return condition.indexOf(word) !== -1;
        });
      });
    },
    sortStore() {
      switch (this.mask) {
        case 'adult':
          this.stores = this.stores.sort((a, b) => (
            b.properties.mask_adult - a.properties.mask_adult
          ));
          break;
        case 'child':
          this.stores = this.stores.sort((a, b) => (
            b.properties.mask_child - a.properties.mask_child
          ));
          break;
        default:
          this.stores = this.stores.sort((a, b) => {
            const aTotal = a.properties.mask_adult + a.properties.mask_child;
            const bTotal = b.properties.mask_adult + b.properties.mask_child;
            return bTotal - aTotal;
          });
          break;
      }
    },
    toggleIsOpen(boolean) {
      this.$store.commit('toggleIsOpen', boolean);
    },
    filterStared() {
      const vm = this;
      vm.stores = [];
      vm.stared.forEach((id) => {
        vm.allStores.forEach((el) => {
          if (el.properties.id === id) {
            vm.stores.push(el);
          }
        });
      });
    },
    filterAndSort() {
      if (this.status.isStared) {
        this.filterStared();
      } else {
        this.filterStore();
      }
      this.sortStore();
    },
    ready() {
      this.isLoading = false;
    },
    goStore(latLng) {
      if (!latLng) { return; }

      const storeLat = latLng.geometry.coordinates[1];
      const storeLng = latLng.geometry.coordinates[0];

      this.storeLocation = [storeLat, storeLng];
    },
    ...mapMutations(['toggleStared']),
  },
  computed: {
    ...mapGetters(['stared', 'isOpen']),
  },
  watch: {
    mask: 'sortStore',
    status: {
      handler() {
        this.filterAndSort();
      },
      deep: true,
    },
    stared: 'filterAndSort',
  },
  mounted() {
    this.getData();
  },
  components: {
    Map,
    Loading,
  },
};
</script>

<style lang="scss">
</style>
