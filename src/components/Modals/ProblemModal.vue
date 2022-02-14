<template>
    <div class="dialog" :class="{'dialog--active': state}" @touchstart="touchStartMethod" @touchEndMethod="touchEndMethod">
        <div class="dialog__header">
            <h1>
                Выбранная проблема
            </h1>
            <button @click="$emit('close')">&times;</button>
        </div>
        <div class="dialog__body" v-if="state">
            <h6>Информация:</h6>
            <p class="text">{{ marker.text }}</p>
            <img :src="marker.image" alt="" v-if="marker.image" @load="loaded" v-show="imageLoaded">
            <p class="lat">Широта: {{ marker.position.lat }}</p>
            <p>Долгота: {{ marker.position.lng }}</p>
        </div>
    </div>
</template>

<script>
    import {mdbBtn} from 'mdbvue';
    import messages from "../../localization/languageChoice";
    import { usersRef } from "../../firebase";

    export default {
        components: {
            mdbBtn
        },
        data: () => ({
            messages: messages,
            user: null,
            imageLoaded: false,
        }),
        methods: {
            loaded(e) {
                this.imageLoaded = true;
            },
            touchStartMethod(touchEvent) {
                if (touchEvent.changedTouches.length !== 1) { // We only care if one finger is used
                    return;
                }
                const posYStart = touchEvent.changedTouches[0].clientY;
                addEventListener('touchend', (touchEvent) => this.touchEndMethod(touchEvent, posYStart), {once: true});
            },
            touchEndMethod(e, posYStart) {
                if (e.changedTouches.length !== 1) { // We only care if one finger is used
                    return;
                }
                const posYEnd = e.changedTouches[0].clientY;
                console.log(posYEnd - posYStart);

                if ((posYEnd - posYStart) > 50) {
                    this.$emit('close');
                }
            }
        },
        props: {
            state: {
                type: Boolean,
                default: false,
            },
            marker: {
                type: Object,
                default: () => ({}),
            }
        },
        computed: {
            language() {
                return this.$store.getters.LANGUAGE;
            },
            modalTitle() {
                return this.messages.title[this.language] ?? 'Выберите язык'
            }
        },
        watch: {
            async state(val) {
                if (val) {
                    /*const response = await usersRef.doc(this.marker.user_id).get();
                    this.user = {
                        name: response.data().firstName + ' ' + response.data().lastName,
                        phone: response.data().phone
                    };*/
                } else {
                    this.user = null;
                    this.imageLoaded = false;
                }
            }
        }
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

    h6 {
        font-weight: bold;
    }

    img {
        width: 100%;
        margin: 10px 0;
    }

    .lat {
        margin-top: 30px;
    }

</style>