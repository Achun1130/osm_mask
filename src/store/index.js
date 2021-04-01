import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    stared: JSON.parse(localStorage.getItem('stared')) || [],
    isOpen: true,
  },
  mutations: {
    toggleStared(state, id) {
      if (!state.stared.length || state.stared.indexOf(id) < 0) {
        state.stared.push(id);
      } else {
        state.stared.splice(state.stared.indexOf(id), 1);
      }
      localStorage.setItem('stared', JSON.stringify(state.stared));
    },
    toggleIsOpen(state, boolean) {
      if (boolean) {
        state.isOpen = !state.isOpen;
      } else {
        state.isOpen = false;
      }
    },
  },
  actions: {
  },
  modules: {
  },
  getters: {
    stared: (state) => state.stared,
    isOpen: (state) => state.isOpen,
  },
});
