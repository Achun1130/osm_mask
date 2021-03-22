<template>
  <main id="app">
    <div class="p-sidebar">
      <a href="#">
        <img src="./assets/images/bg_drag.svg" alt="toggle-icon"
          class="p-sidebar__toggle img-fluid d-none d-sm-block">
      </a>
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
      <label for="" class="u-fz-lg">現在位置</label>
      <div class="position-relative">
        <input type="text" class="form-control pr-71" placeholder="新北市中和區中山路123號">
        <a href="#" class="p-sidebar__search p-8">
          <i class="fas fa-search fa-lg fa-fw"></i>
        </a>
      </div>
      <div class="d-flex justify-content-between mt-23">
        <button type="button" class="btn btn-secondary">所有口罩</button>
        <button type="button" class="btn btn-outline-primary">成人口罩</button>
        <button type="button" class="btn btn-outline-primary">兒童口罩</button>
      </div>
      <hr class="w-75">
      <div class="d-flex align-items-center mb-33">
        <h3>尚有庫存店家</h3>
        <button type="button"
          class="btn btn-sm btn-outline-primary ml-14 ml-sm-40 mr-8">距離最近</button>
        <button type="button" class="btn btn-sm btn-secondary mr-8">存量最多</button>
        <button type="button" class="btn btn-sm btn-outline-primary">已標星號</button>
      </div>
      <div class="p-sidebar__card mb-23">
        <div class="d-flex mb-18">
          <div>
            <h4 class="d-inline-block mr-18 mb-6">皇秦大藥局</h4>
            <span class="u-fz-md">10km</span>
            <ul class="list-unstyled mb-0">
              <li class="u-fz-md mb-6">235新北市中和區中山路三段39號</li>
              <li class="u-fz-md mb-6">+886 2 2226 9636</li>
              <li class="u-fz-md">今日營業時間：Closing soon: 9am–10pm</li>
            </ul>
          </div>
          <div class="ml-auto">
            <a href="#" class="btn btn-outline-primary p-sidebar__icon">
              <i class="far fa-star"></i>
            </a>
            <a href="#" class="btn btn-outline-primary p-sidebar__icon">
              <i class="fas fa-location-arrow"></i>
            </a>
          </div>
        </div>
        <div class="d-flex">
          <button type="button" class="btn btn-block btn-gray-400
            d-flex align-items-center py-0 mr-29 py-0 px-30">
            成人<span class="h1 u-letter-spacing-0 flex-grow-1">0</span>
          </button>
          <button type="button" class="btn btn-block btn-info mt-0
            d-flex align-items-center py-0 px-30">
            兒童<span class="h1 u-letter-spacing-0 flex-grow-1">1,234</span>
          </button>
        </div>
        <div class="text-muted text-right mt-5">2020/02/08 23:35更新</div>
      </div>
      <div class="p-sidebar__card mb-23">
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
              <!-- <i class="far fa-star"></i> -->
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
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="scss">
</style>
