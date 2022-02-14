<template>
    <div class="page">
        <div class="image__wrapper">
            <img :src="require('../assets/images/logo__main.png')" alt="Логотип">
        </div>
        <h1>Добро пожаловать</h1>
        <h2>Войдите, чтобы продолжить</h2>
        <form @submit.prevent="onSubmit" v-if="loginStage === 'login'">
            <div class="input__wrapper input__wrapper--phone" :class="($v.phone.$dirty && $v.phone.$invalid) ? 'input__wrapper--error': ''">
                <input type="number" aria-label="Телефон" placeholder="Телефон" v-model="$v.phone.$model">
                <p class="error__message"  v-if="$v.phone.$dirty && $v.phone.$invalid">
                    <i class="far fa-times-circle"></i>
                    <span v-if="!$v.phone.required">
                        Телефон должен быть заполнен
                    </span>
                    <span v-if="!$v.phone.maxLength || !$v.phone.minLength">
                        Телефон должен состоять из 9 символов
                    </span>
                </p>
            </div>
            <mdb-btn color="default" block type="submit">Войти</mdb-btn>
        </form>
        <form @submit.prevent="confirmCode" v-if="loginStage === 'verification'">
            <div class="input__wrapper">
                <v-otp-input
                        ref="otpInput"
                        class="otpContainer"
                        input-classes="otp-input"
                        separator=" "
                        :num-inputs="6"
                        :should-auto-focus="true"
                        :is-input-num="true"
                        @on-change="onChangeOtp"
                        @on-complete="() => {}"
                />
            </div>
            <p class="mt-3 mb-0">Запросить код повторно через {{ timer }} сек.<span class="otp-sec ml-1 text-white"></span></p>
            <mdb-btn color="default" block v-if="timer === 0" @click="resendSMS">Запросить код повторно</mdb-btn>

            <mdb-btn color="default" block type="submit">Подтвердить</mdb-btn>
        </form>
        <!--<div class="social&#45;&#45;text__wrapper">
            <div class="social__line"></div>
            <p class="social__text">
                Или войдите через
            </p>
            <div class="social__line"></div>
        </div>
        <div class="social-buttons__wrapper">
            <a href="#" class="social__button">
                <i class="fab fa-vk"></i>
            </a>
            <a href="#" class="social__button" @click="loginViaGoogle">
                <i class="fab fa-google"></i>
            </a>
            <a href="#" class="social__button" @click.prevent="loginFacebook">
                <i class="fab fa-facebook"></i>
            </a>
        </div>-->
       <!-- <div class="social&#45;&#45;text__wrapper mb-2">
            <div class="social__line"></div>
            <a class="social__text">
                Еще не зарегистрированы?
            </a>
            <div class="social__line"></div>
        </div>-->
<!--
        <mdb-btn color="default" block @click="$router.push('/register')">Зарегистрироваться</mdb-btn>
-->
        <div class="pb-5"></div>
    </div>
</template>

<script>
    import Toolbar from "../components/Navigation/Toolbar";
    import OtpInput from "@bachdgvn/vue-otp-input";

    import { mdbBtn } from 'mdbvue';
    import { required, minLength, maxLength } from 'vuelidate/lib/validators';
    import {facebookAuthProvider, auth} from "../firebase";

    export default {
        components: {Toolbar, mdbBtn, OtpInput},
        data: () => ({
            showPassword: false,
            phone: '',
            password: '',
            code: '',
            timer: 60,
        }),
        methods: {
            async onSubmit() {

                this.$v.$touch()
                if (this.$v.$error) {
                    return null;
                }

                await this.$store.dispatch('login', this.phone);

            },
            async confirmCode() {
                await this.$store.dispatch('checkCode', this.code);
            },
            onChangeOtp(val) {
                this.code = val;
            },
            async loginFacebook() {
                try {
                    await this.$store.dispatch('loginViaFacebook');
                } catch (e) {
                    console.log(e);
                }
            },
            async loginViaGoogle() {
                try {
                    await this.$store.dispatch('loginViaGoogle');
                } catch (e) {
                    console.log(e);
                }
            },
            async resendSMS() {
                await this.$store.dispatch('signInWithPhoneNumber', this.phone);
                this.timer = 60;
            }
        },
        watch: {
            phone(val) {
                if (this.phone.toString().length >= 9) {
                    this.phone = this.phone.slice(0, 9);
                }
            },
            loginStage(val) {
                if (val === 'verification') {
                    setInterval(() => {
                        this.timer = Math.max(0, this.timer - 1);
                    }, 1000);
                }
            }
        },
        computed: {
            loginStage() {
                return this.$store.getters.LOGIN_STAGE;
            }
        },
        validations: {
            phone: {
                minLength: minLength(9),
                maxLength: maxLength(9),
                required
            },
            /*password: {
                required
            }*/
        }
    }
</script>

<style scoped lang="scss">
    .page {
        padding-top: 44px;
    }
    .image__wrapper {
        margin: auto;
        z-index: 1;
        pointer-events: none;
        width: 60%;
    }

    h1 {
        z-index: 2;
        color: #0C9344;
        text-align: center;
        font-size: 26px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    h2 {
        z-index: 2;
        color: #3e3e3e;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
    }

    form {
        z-index: 2;
        margin-top: 10px;
        font-family: "Yandex Sans Regular", Arial, sans-serif;

        .input__wrapper {
            margin-bottom: 15px;
            position: relative;
            display: flex;
            font-size: 14px;
            align-items: center;
            color: #222;
            border-bottom: 1px solid #ced4da;

            &--error {
                border-bottom: 1px solid #BE1E2D;
            }

            &--phone:before {
                content: '+996';
                margin-right: 10px;
            }

            .error__message {
                position: absolute;
                bottom: -19px;
                left: 0;
                font-size: 12px;
                color: #BE1E2D;
            }
        }

        input {
            font-family: inherit;
            border: none;
            outline: none;
            width: 100%;
            padding: 10px 10px 10px 0;
            font-size: 14px;
        }

        .password__toggle {
            width: 25px;
        }

        .forgot__password {
            font-size: 16px;
            margin-top: 5px;
            color: #0C9344;
        }
    }

    .social--text__wrapper {
        width: 100%;
        margin-top: 15px;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        justify-content: space-between;
    }

    .social__line {
        width: 100%;
        height: 1px;
        background: #ced4da;
        //margin-top: 13px;
    }

    .social__text {
        padding: 0 10px;
        text-transform: uppercase;
        font-weight: bold;
    }

    .social-buttons__wrapper {
        width: 70%;
        margin: 10px auto;
        display: flex;
        justify-content: space-between;

        .social__button {
            display: flex;
            //border: 1px solid #3e3e3e;
            width: 40px;
            height: 40px;
            border-radius: 10px;
            justify-content: center;
            align-items: center;

            i {
                font-size: 25px;
            }
        }
    }
</style>