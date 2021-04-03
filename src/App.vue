<template>
  <main id="app" class="h-100">
    <loading :active.sync="isLoading" :opacity="0.8">
        <span class="h4">資料載入中，請稍後 ...</span>
    </loading>
    <div class="p-sidebar"
      :class="{ 'active': isOpen }">
      <a href="#" class="p-sidebar__toggle"
        @click.prevent="toggleOpen(true)">
        <img src="./assets/images/bg_drag.svg" alt="toggle-icon">
      </a>
      <div class="p-sidebar__body h-100">
        <div class="d-sm-block d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center flex-wrap">
            <h1>口罩即時地圖</h1>
            <div class="w-100 d-sm-none"></div>
            <div class="ml-sm-auto text-sm-right">
              <div class="text-muted">資料來源：衛福部</div>
              <div class="u-fz-md">{{ today.date }}</div>
            </div>
          </div>
          <a href="#" class="d-sm-none d-block text-secondary p-3"
            @click.prevent="toggleOpen(true)">
            <i class="fas fa-arrow-left fa-3x"></i>
          </a>
        </div>
        <div class="p-sidebar__day">
          <h2 class="position-relative u-z-index-1">星期{{ today.week }}</h2>
          <span class="position-relative u-z-index-1 u-fz-lg u-line-height-20-38 mb-0">
            今天身分證<span class="h4 mx-2">最後一碼</span>為<br>
            <span class="u-fz-2x text-secondary mr-14">不分號</span>
            開放所有的人購買！
          </span>
          <img src="./assets/images/banner_announce_fix.png" alt="banner_announce_fix">
        </div>
        <label for="county" class="u-fz-lg">請選擇區域</label>
        <div class="form-row">
          <div class="form-group col">
            <select class="custom-select" v-model="location.county"
              @change="changeCounty(); showMessage();">
              <option value="" disabled>縣市</option>
              <option :value="item.CityName"
                v-for="(item, key) in countyData" :key="key">{{ item.CityName }}</option>
            </select>
          </div>
          <div class="form-group col">
            <select class="custom-select" v-model="location.town"
              @change="filterAndSort(); goStore(stores[0]); showMessage();">
              <option value="">鄉鎮市區</option>
              <option :value="item.AreaName"
                v-for="(item, key) in AreaList" :key="key">{{ item.AreaName }}</option>
            </select>
          </div>
        </div>
        <label for="location" class="u-fz-lg">或 輸入關鍵字</label>
        <div class="position-relative">
          <input type="search" id="location" class="form-control pr-71" placeholder="中山路"
            v-model="location.keyword"
            @keydown.enter="filterAndSort(); goStore(stores[0]); showMessage();">
          <a href="#" class="p-sidebar__search p-8"
            @click.prevent="filterAndSort(); goStore(stores[0]); showMessage();">
            <i class="fas fa-search fa-lg fa-fw"></i>
          </a>
        </div>
        <div class="d-flex justify-content-between mt-23">
          <button type="button" class="btn"
            :class="mask === 'all' ? 'btn-secondary' : 'btn-outline-primary'"
            :disabled="mask === 'none'"
            @click="mask = 'all'">所有口罩</button>
          <button type="button" class="btn"
            :class="mask === 'adult' ? 'btn-secondary' : 'btn-outline-primary'"
            :disabled="mask === 'none'"
            @click="mask = 'adult'">成人口罩</button>
          <button type="button" class="btn"
            :class="mask === 'child' ? 'btn-secondary' : 'btn-outline-primary'"
            :disabled="mask === 'none'"
            @click="mask = 'child'">兒童口罩</button>
        </div>
        <hr class="w-75">
        <div class="d-flex align-items-center flex-wrap mb-sm-33 mb-23">
          <h3>尚有庫存店家</h3>
          <div class="w-100 py-6 d-sm-none"></div>
          <button type="button"
            class="btn btn-sm ml-sm-40 mr-8"
            :class="status.isNear ? 'btn-secondary' : 'btn-outline-primary'"
            :disabled="!isPosition"
            @click="status.isNear = true">距離最近</button>
          <button type="button" class="btn btn-sm mr-8"
            :class="!status.isNear ? 'btn-secondary' : 'btn-outline-primary'"
            @click="status.isNear = false;">存量最多</button>
          <button type="button" class="btn btn-sm"
            :class="status.isStared ? 'btn-secondary' : 'btn-outline-primary'"
            @click="status.isStared = !status.isStared;">已標星號</button>
        </div>
        <p class="u-fz-lg text-center" v-if="message && !stores.length">查無店家，請重新搜尋</p>
        <a href="#" class="p-sidebar__card mb-23"
          @click.prevent="goStore(item); toggleOpen();"
          v-for="(item, key) in stores" :key="key">
          <div class="d-flex mb-18">
            <div>
              <h4 class="d-inline-block mr-18 mb-6">{{ item.properties.name }}</h4>
              <span class="u-fz-md" v-if="item.properties.distance">
                {{ item.properties.distance > 1000 ?
                  `${Math.round((item.properties.distance / 1000) * 10) / 10}km` :
                  `${Math.round(item.properties.distance)}m` }}
              </span>
              <ul class="list-unstyled mb-0">
                <li class="u-fz-md mb-6">{{ item.properties.address }}</li>
                <li class="u-fz-md mb-6">{{ item.properties.phone }}</li>
                <li class="u-fz-md">{{ item.properties.note }}</li>
              </ul>
            </div>
            <div class="ml-auto">
              <a href="#" class="d-block mb-13"
                @click.prevent.stop="toggleStared(item.properties.id)">
                <img src="./assets/images/icon_star_selected.svg" alt="icon_star_selected"
                  v-if="item.properties.stared">
                <img src="./assets/images/icon_star_unselected.svg" alt="icon_star_unselected"
                  v-else>
              </a>
              <a class="d-block" :href="`https://www.google.com.tw/maps/search/${item.properties.address}`"
                target="_blank">
                <img src="./assets/images/icon_nav.svg" alt="icon_nav">
              </a>
            </div>
          </div>
          <div class="d-flex justify-content-between text-center flex-sm-nowrap flex-wrap">
            <div class="flex-fill w-100 d-flex align-items-center
              u-border-radius-md text-white u-fz-lg u-letter-spacing-05
              px-30 mr-sm-29 mb-sm-0 mb-15"
              :class="item.properties.mask_adult ? 'bg-info' : 'bg-gray-400'">成人
              <span class="h1 u-letter-spacing-0 flex-grow-1">
                {{ item.properties.mask_adult | number }}
              </span>
            </div>
            <div class="flex-fill w-100 d-flex align-items-center
              u-border-radius-md text-white u-fz-lg u-letter-spacing-05 px-30"
              :class="item.properties.mask_child ? 'bg-info' : 'bg-gray-400'">兒童
              <span class="h1 u-letter-spacing-0 flex-grow-1">
                {{ item.properties.mask_child | number }}
              </span>
            </div>
          </div>
          <div class="text-muted text-right mt-5">{{ item.properties.updated }}</div>
        </a>
      </div>
    </div>
    <Map
      ref="mymap"
      :allStores="allStores"
      :myPosition="myPosition"
      :isPosition="isPosition"
      :stared="stared"
      @toggleOpen="toggleOpen"
      @toggleStared="toggleStared"/>
  </main>
</template>

<script>
import { latLng } from 'leaflet';

import countyData from './assets/json/county.json';
import Map from './components/Map.vue';

export default {
  name: 'App',
  data: () => ({
    countyData,
    AreaList: [],
    location: {
      keyword: '',
      county: '',
      town: '',
    },
    allStores: [],
    stores: [],
    stared: JSON.parse(localStorage.getItem('stared')) || [],
    mask: 'all',
    isLoading: true,
    isPosition: false,
    isOpen: true,
    status: {
      isNear: false,
      isStared: false,
    },
    myPosition: [25.03746, 121.564558],
    message: '',
    today: {
      date: '',
      week: '',
    },
  }),
  methods: {
    getData() {
      const vm = this;
      const api = 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json';

      vm.$http.get(api).then((response) => {
        vm.allStores = response.data.features.filter((el) => {
          if (vm.isPosition) {
            const storePosition = [el.geometry.coordinates[1], el.geometry.coordinates[0]];
            const distance = latLng(vm.myPosition).distanceTo(storePosition);
            el.properties.distance = distance;
          }
          el.properties.stared = vm.stared.some((id) => id === el.properties.id);
          el.properties.mask_total = el.properties.mask_adult + el.properties.mask_child;
          return el.properties.mask_total;
        });
        vm.isLoading = false;
      });
    },
    filterTown() {
      this.AreaList = this.countyData.filter((el) => (
        el.CityName === this.location.county
      ))[0].AreaList;
    },
    changeCounty() {
      this.location.town = '';
      this.filterTown();
      this.filterAndSort();
      this.goStore(this.stores[0]);
    },
    filterStore() {
      if (!this.location.county && !this.location.keyword.trim()) {
        this.stores = [];
        return;
      }

      const keyword = this.location.keyword.trim().split(' ');
      const arr = [this.location.county, this.location.town, ...keyword];

      this.stores = this.allStores;
      arr.forEach((word) => {
        this.stores = this.stores.filter((el) => {
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
      if (this.status.isNear) {
        this.mask = 'none';
        this.stores = this.stores.sort((a, b) => (
          a.properties.distance - b.properties.distance
        ));
      } else {
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
            this.mask = 'all';
            this.stores = this.stores.sort((a, b) => {
              const aTotal = a.properties.mask_adult + a.properties.mask_child;
              const bTotal = b.properties.mask_adult + b.properties.mask_child;
              return bTotal - aTotal;
            });
            break;
        }
      }
    },
    filterStared() {
      this.stores = this.allStores.filter((el) => el.properties.stared);
    },
    filterAndSort() {
      if (this.status.isStared) {
        this.filterStared();
      } else {
        this.filterStore();
      }
      this.sortStore();
    },
    goStore(store) {
      if (!store) { return; }

      const storeLat = store.geometry.coordinates[1];
      const storeLng = store.geometry.coordinates[0];

      this.$refs.mymap.showPopup([storeLat, storeLng]);
    },
    showMessage() {
      if (!this.stores.length) {
        this.message = '查無店家，請重新搜尋';
      }
    },
    getMyPosition() {
      if (!navigator.geolocation) {
        this.getData();
        return;
      }
      navigator.geolocation.getCurrentPosition(this.success, this.error);
    },
    success(position) {
      this.myPosition = [position.coords.latitude, position.coords.longitude];
      this.isPosition = true;
      this.status.isNear = true;
      this.getData();
    },
    error() {
      this.getData();
    },
    getToday() {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;
      const date = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
      const week = today.getDay();

      this.today.date = `${year}年${month}月${date}日`;
      switch (week) {
        case 1:
          this.today.week = '一';
          break;
        case 2:
          this.today.week = '二';
          break;
        case 3:
          this.today.week = '三';
          break;
        case 4:
          this.today.week = '四';
          break;
        case 5:
          this.today.week = '五';
          break;
        case 6:
          this.today.week = '六';
          break;
        default:
          this.today.week = '日';
          break;
      }
    },
    toggleStared(id) {
      this.allStores.some((el) => {
        if (el.properties.id === id) {
          el.properties.stared = !el.properties.stared;
          return true;
        }
        return false;
      });

      if (!this.stared.length || this.stared.indexOf(id) < 0) {
        this.stared.push(id);
      } else {
        this.stared.splice(this.stared.indexOf(id), 1);
      }
      localStorage.setItem('stared', JSON.stringify(this.stared));
    },
    toggleOpen(isToggle) {
      if (isToggle) {
        this.isOpen = !this.isOpen;
      } else {
        this.isOpen = false;
      }
    },
  },
  watch: {
    mask() {
      this.sortStore();
      this.goStore(this.stores[0]);
    },
    status: {
      handler() {
        this.filterAndSort();
        this.goStore(this.stores[0]);
      },
      deep: true,
    },
    stared: 'filterAndSort',
  },
  created() {
    this.getMyPosition();
    this.getToday();
  },
  components: {
    Map,
  },
};
</script>
<style lang="scss">
  @import "./assets/scss/all";
</style>
