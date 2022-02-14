import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbvue/lib/mdbvue.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import OtpInput from "@bachdgvn/vue-otp-input";

Vue.component("v-otp-input", OtpInput);


import Vuelidate from 'vuelidate'
import {auth} from "./firebase";
Vue.use(Vuelidate)

Vue.config.productionTip = false;

let app;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})

