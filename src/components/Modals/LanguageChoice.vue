<template>
    <div class="dialog" :class="{'dialog--active': state}">
        <div class="dialog__header">
            <h1>
                {{ modalTitle }}
            </h1>
            <button v-if="language" @click="$store.commit('DISABLE_LANGUAGE_MODAL')">&times;</button>
        </div>
        <div class="dialog__body">
            <img src="../../assets/images/logo__main.png" alt="Logo">
            <ul>
                <li @click="chooseLang('ru')">
                    <img class="img__flag" src="../../assets/icons/Flag_of_Russia.svg" alt="">
                    <span>Русский язык</span>
                    <button>
                        <img src="../../assets/icons/right-arrow.svg" alt="">
                    </button>
                </li>
                <li @click="chooseLang('kg')">
                    <img class="img__flag" src="../../assets/icons/Flag_of_Kyrgyzstan.svg" alt="">
                    <span>Кыргыз тили</span>
                    <button>
                        <img src="../../assets/icons/right-arrow.svg" alt="">
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import { mdbBtn } from 'mdbvue';
    import messages from "../../localization/languageChoice";

    export default {
        components: {
            mdbBtn
        },
        data: () => ({
            messages: messages,
        }),
        methods: {
            chooseLang(lang) {
                this.$store.commit('SET_LANGUAGE', lang);
                this.$store.commit('DISABLE_LANGUAGE_MODAL');
                return this.$emit('submit');
            }
        },
        computed: {
            state() {
                return this.$store.getters.SHOW_LANGUAGE_MODAL;
            },
            language() {
                return this.$store.getters.LANGUAGE;
            },
            modalTitle() {
                return this.messages.title[this.language] ?? 'Выберите язык'
            }
        },
    }
</script>

<style scoped lang="scss">
    .dialog {
        height: 100vh;
        width: 100vw;
        position: fixed;
        bottom: -100vh;
        left: 0;
        background: #fff;
        z-index: 999;
        -webkit-transition-duration: 400ms;
        -o-transition-duration: 400ms;
        transition-duration: 400ms;
        overflow-y: scroll;

        .dialog__header {
            padding: 10px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #ced4da;

            h1 {
                font-weight: 600;
                font-size: 16px;
                margin-bottom: 0;
            }

            button {
                font-family: "Yandex Sans Regular", sans-serif;
                border: none;
                background: none;
                outline: none;
                font-size: 20px;
                color: #2c2c2c;
            }
        }

        .dialog__body {
            padding: 10px 15px;
        }

        li {
            padding: 10px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #ced4da;

            font-weight: bold;
            font-size: 14px;

            .img__flag {
                width: 30px;
                height: 20px;
                margin-right: 10px;
            }

            button {
                width: 15px;
                margin-left: auto;
                border: none;
                outline: none;
                background: transparent;
            }
        }
    }

    .dialog--active {
        bottom: 0;
    }
</style>