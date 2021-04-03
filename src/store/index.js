import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    stared: JSON.parse(localStorage.getItem('stared')) || [],
    isOpen: true,
  },
  mutations: {
    STARED(state, payload) {
      if (!state.stared.length || state.stared.indexOf(payload) < 0) {
        state.stared.push(payload);
      } else {
        state.stared.splice(state.stared.indexOf(payload), 1);
      }
      localStorage.setItem('stared', JSON.stringify(state.stared));
    },
    ISOPEN(state, payload) {
      if (payload) {
        state.isOpen = !state.isOpen;
      } else {
        state.isOpen = false;
      }
    },
  },
  getters: {
    stared: (state) => state.stared,
    isOpen: (state) => state.isOpen,
  },
});
