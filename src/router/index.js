import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from "../views/Register";
import Map from "../views/Map";
import Participants from "../views/Participants";
import NewsList from "../views/NewsList";
import News from "../views/News";
import store from "../store/index";
import ParticipantInfo from "../views/ParticipantInfo";

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      pageName: 'Вход',
      pageName_ru: 'Вход',
      pageName_kg: 'Киргизүү',
      sideMenu: false,
      layout: 'Auth',
      guest: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      pageName: 'Регистрация',
      pageName_ru: 'Регистрация',
      pageName_kg: 'Каттоого киргизүү',
      sideMenu: false,
      layout: 'Auth',
      canBack: true,
      backRoute: '/login',
      guest: true,
    }
  },
  {
    path: '/',
    name: 'Map',
    component: Map,
    meta: {
      pageName: 'Отметьте вашу проблему',
      pageName_ru: 'Отметьте вашу проблему',
      pageName_kg: 'Көйгөйүңүздү белгилеңиз',
      sideMenu: true,
      layout: 'Main',
      transparent: true,
      disableSwipe: true,
    }
  },
  {
    path: '/participants',
    name: 'Participants',
    component: Participants,
    meta: {
      pageName: 'Операторы',
      pageName_ru: 'Операторы',
      pageName_kg: 'Операторлар',
      sideMenu: true,
      layout: 'Main',
    }
  },
  {
    path: '/participants/:id',
    name: 'ParticipantInfo',
    component: ParticipantInfo,
    meta: {
      pageName: 'Участник',
      layout: 'Main',
      canBack: true,
      backRoute: '/participants'
    }
  },
  {
    path: '/news',
    name: 'NewsList',
    component: NewsList,
    meta: {
      pageName: 'Новости',
      pageName_ru: 'Новости',
      pageName_kg: 'Жаңылыктар',
      sideMenu: true,
      layout: 'Main',
    }
  },
  {
    path: '/news/:id',
    name: 'News',
    component: News,
    meta: {
      pageName: 'Заголовок новости',
      layout: 'Main',
      canBack: true,
      backRoute: '/news'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  store.commit('DISABLE_SIDE_MENU');
  const secret = to.query.secret || store.getters.SECRET;
  const push_token = to.query.push_token || null;

/*  if (secret !==  process.env.VUE_APP_FRUNZE_SECRET) {
    window.location = 'http://tsjmk.ru/';
    return;
  } else {
    store.commit('setSecret', secret);
  }*/

  if (!store.getters.AUTH_CHECKED) {
    await store.dispatch('setAuthState');
  }

  const isAuth = store.getters.IS_AUTH;
  const authChecked = store.getters.AUTH_CHECKED;
  const isGuestRoute = !!to.meta.guest;

  if (push_token) {
    store.commit('ENABLE_LOADING');
    store.commit('setPushToken', push_token);
    store.commit('DISABLE_LOADING')
  }


  if (!isAuth && authChecked && !isGuestRoute) {
    next('/login');
    return;
  }

  if (isAuth && authChecked && isGuestRoute) {
    next('/');
    return;
  }


  /*if (!isAuth && authChecked) {
    next('/login');
    return;
  }*/

  next();
})

export default router
