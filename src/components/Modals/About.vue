<template>
    <div class="dialog" :class="{'dialog--active': state}">
        <div class="dialog__header">
            <h1>О проекте</h1>
            <button @click="$store.commit('DISABLE_ABOUT_MODAL')">&times;</button>
        </div>
        <div class="dialog__body">
            <p>Если Вы обнаружили нарушения в содержании объектов городского хозяйства (дворов, дорог, парков и иных
                объектов) – направьте сообщение (и фото) в приложении «Фрунзе». После отправки сообщение будет
                автоматически направлено в нашу базу, после этого наши активисты свяжутся с ответственными органами
                власти/учреждениями для устранения проблемы. </p>
        </div>
    </div>
</template>

<script>

    export default {
        data: () => ({
            text: "",
        }),
        methods: {
            onSubmit() {
                return this.$emit('submit', this.text);
            }
        },
        computed: {
            state() {
                return this.$store.getters.SHOW_ABOUT_MODAL;
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
        padding-bottom: 40px;

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
            padding: 10px 15px 30px 15px;

            p {
                margin: 15px 0;
            }
        }
    }

    .dialog--active {
        bottom: 0;
    }
</style>