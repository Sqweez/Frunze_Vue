<template>
    <div class="dialog" :class="{'dialog--active': state}" @touchstart="touchStartMethod" @touchEndMethod="touchEndMethod">
        <div class="dialog__header">
            <h1>Напишите оператору</h1>
            <button @click="$emit('cancel')">&times;</button>
        </div>
        <div class="dialog__body">
            <textarea name="text" id="text" cols="1" rows="3" aria-label="Ваше сообщение" placeholder="Ваше сообщение" v-model="text"></textarea>
            <mdb-btn color="default" block @click="onSubmit" class="mt-4">Отправить</mdb-btn>
        </div>
    </div>
</template>

<script>
    import { mdbBtn } from 'mdbvue';

    export default {
        components: {
            mdbBtn
        },
        data: () => ({
            text: '',
            image: null,
            file: null,
        }),
        methods: {
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
                    this.$emit('cancel');
                }
            },
            async onSubmit() {
                if (!this.text.length) {
                    this.$store.commit('ENABLE_SNACKBAR', 'Для отправки сообщения вы должны ввести его')
                    return;
                }

                try {
                    await this.$store.dispatch('SEND_OPERATOR_MESSAGE', {
                        text: this.text,
                        operator_id: this.operator_id
                    })
                    this.$emit('cancel');
                } catch (e) {
                    console.log(e);
                }

            },
            onUpload(e) {
                const file = e.target.files[0];
                if (file && FileReader) {
                    this.file = file;
                    const fileReader = new FileReader();
                    fileReader.onload = (e) => {
                        this.image = e.target.result;
                    }
                    fileReader.readAsDataURL(file);
                }
            }
        },
        computed: {},
        watch: {
            state() {
                this.text = '';
                this.image = null;
                this.file = null;
            }
        },
        props: {
            state: {
                type: Boolean,
                default: false,
            },
            operator_id: {
                type: String,
                required: true
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

            textarea {
                width: 100%;
                border: none;
                border-bottom: 1px solid #ced4da;
                resize: none;
                outline: none;
                font-size: 14px;
            }
        }
    }

    .dialog--active {
        bottom: 0;
    }
</style>