<template>
    <div class="dialog" :class="{'dialog--active': state}" @touchstart="touchStartMethod" @touchEndMethod="touchEndMethod">
        <div class="dialog__header">
            <h1>Сообщите о проблеме</h1>
            <button @click="$emit('cancel')">&times;</button>
        </div>
        <div class="dialog__body">
            <textarea name="text" id="text" cols="1" rows="3" aria-label="Описание проблемы" placeholder="Описание проблемы" v-model="text"></textarea>
            <input type="file" ref="fileInput" @change="onUpload" style="display:none;">
            <ImageUploader
                    v-if="state"
                    :preview="true"
                    :className="['fileinput', 'd-none', { 'fileinput--loaded': hasImage }]"
                    capture="environment"
                    :debug="1"
                    :maxWidth="700"
                    doNotResize="gif"
                    :autoRotate="true"
                    outputFormat="blob"
                    @input="setImage"
                    id="fileInput"
            >
                <label for="fileInput" slot="upload-label" style="width: 100%;">
                    <mdb-btn slot="upload-label" color="default" block class="mt-4" @click="onClick">Добавить фото</mdb-btn>
                </label>
            </ImageUploader>
            <mdb-btn color="default" block @click="onSubmit" class="mt-4">Сообщить о проблеме</mdb-btn>
            <p class="mt-5">
                Долгота: {{ lat }}
            </p>
            <p>
                Широта: {{ lng }}
            </p>
        </div>
    </div>
</template>

<script>
    import { mdbBtn } from 'mdbvue';
    import ImageUploader from 'vue-image-upload-resize'

    export default {
        components: {
            mdbBtn, ImageUploader
        },
        data: () => ({
            text: '',
            image: null,
            fileImage: null,
            file: null,
            hasImage: false,
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
                    this.$store.commit('ENABLE_SNACKBAR', 'Для отправки обращения введите текст и/или загрузите фото!')
                    return;
                }

                try {
                    await this.$store.dispatch('SUBMIT_APPLICATION', {
                        text: this.text,
                        lat: this.lat,
                        lng: this.lng,
                        file: this.fileImage,
                        image: null
                    })
                    this.$emit('submit');
                } catch (e) {
                    console.log(e);
                }

            },
            onUpload(e) {
                /*const file = e.target.files[0];
                if (file && FileReader) {
                    this.file = file;
                    const fileReader = new FileReader();
                    fileReader.onload = (e) => {
                        this.image = e.target.result;
                    }
                    fileReader.readAsDataURL(file);
                }*/
            },
            onClick(e) {
                const parent = e.target.parentElement;
                parent.click();
            },
            setImage(output, kek) {
                this.hasImage = true;
                this.fileImage = output;
                console.log(output);
                console.log(kek);
            }
        },
        computed: {},
        watch: {
            state() {
                this.text = '';
                this.image = null;
                this.file = null;
                this.fileImage = null;
                this.hasImage = false;
            }
        },
        props: {
            state: {
                type: Boolean,
                default: false,
            },
            lat: {
                type: Number
            },
            lng: {
                type: Number,
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

    .d-none {
        display: none;
    }
</style>