<template>
    <div>
        <div class="overlay" :class="{'active': SHOW_SIDE_MENU}" @click="$store.commit('DISABLE_SIDE_MENU')" @touchstart="touchStartMethod" @touchEndMethod="touchEndMethod"></div>
        <div class="menu__wrapper" :class="{'nav-active': SHOW_SIDE_MENU}">
            <div class="menu__header">
                <div class="image__wrapper">
                    <img :src="require('../../assets/images/logo__main.png')" alt="Логотип">
                </div>
            </div>
            <div class="menu__section">
                <ul>
                    <li v-if="IS_AUTH">
                        <p>{{ USER.firstName }} {{ USER.lastName }}</p>
                    </li>
                    <li @click="logout" v-if="IS_AUTH">
                        <p>{{ messages.LOGOUT[LANGUAGE] }}</p>
                        <img src="../../assets/icons/login.svg" alt="">
                    </li>
                    <router-link tag="li" to="/login" v-if="!IS_AUTH">
                        <p>{{ messages.LOGIN[LANGUAGE] }}</p>
                        <img src="../../assets/icons/login.svg" alt="">
                    </router-link>
                    <li @click="chooseLanguage">
                        <p>{{ messages.CHANGE_LANGUAGE[LANGUAGE] }}</p>
                        <img src="../../assets/icons/language.svg" alt="">
                    </li>
                    <li @click="showAboutModal">
                        <p>{{ messages.ABOUT_PROJECT[LANGUAGE] }}</p>
                        <img src="../../assets/icons/documents.svg" alt="">
                    </li>
                    <li @click="openSite">
                        <p>{{ messages.OUR_SITE[LANGUAGE] }}</p>
                        <img src="../../assets/icons/www.svg" alt="">
                    </li>
<!--
                    <li></li>
-->
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import messages from "../../localization/sideMenu";
    export default {
        data: () => ({
            messages: messages
        }),
        methods: {
            async logout() {
                await this.$store.dispatch('signOut');
            },
            chooseLanguage() {
                this.$store.commit('DISABLE_SIDE_MENU');
                this.$store.commit('ENABLE_LANGUAGE_MODAL');
            },
            showAboutModal() {
                this.$store.commit('DISABLE_SIDE_MENU');
                this.$store.commit('ENABLE_ABOUT_MODAL');
            },
            touchStartMethod(touchEvent) {
                if (touchEvent.changedTouches.length !== 1) { // We only care if one finger is used
                    return;
                }
                const posXStart = touchEvent.changedTouches[0].clientX;
                addEventListener('touchend', (touchEvent) => this.touchEndMethod(touchEvent, posXStart), {once: true});
            },
            touchEndMethod(e, posXStart) {
                if (e.changedTouches.length !== 1) { // We only care if one finger is used
                    return;
                }
                const posXEnd = e.changedTouches[0].clientX;

                if (posXStart > posXEnd) {
                    this.$store.commit('DISABLE_SIDE_MENU');
                    //this.next(); // swipe left
                }
            },
            openSite() {
                const cta = document.createElement('a');
                cta.href = 'https://www.instagram.com/mdfrunze/';
                cta.click();
            }
        },
        computed: {
            ...mapGetters(['SHOW_SIDE_MENU', 'IS_AUTH', 'USER', 'LANGUAGE']),
        }
    }
</script>

<style scoped lang="scss">
    .overlay {
        width: 100%;
        position: fixed;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 9999;
        visibility: hidden;
        transition: opacity .3s ease-in;

        &.active {
            visibility: visible;
            opacity: 1;
        }
    }

    .menu__wrapper {
        transition-duration: .5s;
        position: fixed;
        z-index: 999999;
        top: 0;
        left: -275px;
        height: 100%;
        overflow-y: auto;
        width: 270px;
        background: #fff;
        box-shadow: 0 1px 2px 0 rgba(31, 38, 135, 0.37);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        border-left: 1px solid rgba(255, 255, 255, 0.18);
        transition: .3s ease;

        &.nav-active {
            left: 0;
        }
    }

    .menu__header {
        height: 150px;
        padding-top: 10px;
        //border-bottom: 1px solid #ced4da;

        .image__wrapper {
            width: 80%;
            margin: auto;
        }
    }

    .menu__section {
        ul {
            li {
                display: flex;
                justify-content: space-between;
                padding: 10px 15px;
                border-bottom: 1px solid #ced4da;
                align-items: center;
                p {
                    font-size: 13px;
                    font-weight: bold;
                    color: #000;
                    font-family: "Yandex Sans Regular", sans-serif;
                }

                img {
                    width: 15px;
                }
            }
        }
    }
</style>