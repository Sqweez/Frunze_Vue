<template>
  <div id="app">
    <Toolbar :title="title" :side-menu="sideMenu" :can-back="canBack" :back-route="backRoute" :transparent="transparent"/>
    <LanguageChoice />
    <About />
    <Loader />
    <SnackBar />
    <component :is="layout" v-if="language">
      <router-view></router-view>
    </component>
    <div id="recaptcha-container" class="recaptcha-container"></div>
  </div>
</template>

<style lang="scss">
$image-path: '~@/../mdb/mdbvue/img';
@import '~@/../mdb/mdbvue/scss/mdb-free.scss';
@import "scss/app";
</style>
<script>
  import Toolbar from "./components/Navigation/Toolbar";
  import EmptyLayout from "./components/layouts/EmptyLayout";
  import AuthLayout from "./components/layouts/AuthLayout";
  import MainLayout from "./components/layouts/MainLayout";
  import LanguageChoice from "./components/Modals/LanguageChoice";
  import About from "./components/Modals/About";
  import Loader from "./components/Modals/Loader";
  import SnackBar from "./components/Modals/SnackBar";
  export default {
    components: {SnackBar, Loader, About, LanguageChoice, Toolbar, AuthLayout, MainLayout, EmptyLayout},
    async created() {
      if (!this.language) {
        this.$store.commit('ENABLE_LANGUAGE_MODAL');
      }
    },
    computed: {
      title() {
        return this.$route.query.pageName ?? (this.$route.meta[`pageName_${this.language}`] ?? this.$route.meta.pageName) ?? 'Фрунзе'
      },
      canBack() {
        return this.$route.meta.canBack;
      },
      transparent() {
        return !!this.$route.meta.transparent;
      },
      backRoute() {
        return this.$route.meta.backRoute;
      },
      sideMenu() {
        return !!this.$route.meta.sideMenu;
      },
      hasHistory () {
        return window.history.length > 2
      },
      layout() {
        return (this.$route.meta.layout ?? 'Auth') + 'Layout';
      },
      language() {
        return this.$store.getters.LANGUAGE;
      }
    }
  }
</script>