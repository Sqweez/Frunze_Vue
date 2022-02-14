import Vue from 'vue'
import Vuex from 'vuex'
import frontEndModule from "./modules/frontend";
import authModule from "./modules/auth";
import informationModule from "./modules/information";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    frontEndModule,
    authModule,
    informationModule
  }
})
