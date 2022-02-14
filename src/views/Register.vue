<template>
    <div class="page">
        <h1>Добро пожаловать</h1>
        <h2>Создайте аккаунт</h2>
        <form @submit.prevent="onSubmit" v-if="loginStage === 'login'">
            <div class="input__wrapper input__wrapper--phone" v-if="registerType !== 'phone'">
                <input type="number" aria-label="Телефон" placeholder="Телефон" v-model="phone">
               <!-- <p class="error__message"  v-if="$v.phone.$dirty && $v.phone.$invalid">
                    <i class="far fa-times-circle"></i>
                    <span v-if="!$v.phone.required">
                        Телефон должен быть заполнен
                    </span>
                    <span v-if="!$v.phone.maxLength || !$v.phone.minLength">
                        Телефон должен состоять из 10 символов
                    </span>
                </p>-->
            </div>
            <div class="input__wrapper">
                <input :type="showPassword ? 'text' : 'password'" aria-label="Пароль" placeholder="Пароль" v-model="$v.password.$model">
                <a class="password__toggle" @click="showPassword = !showPassword">
                    <img :src="showPassword ? require('../assets/icons/eye-on.svg') : require('../assets/icons/eye-off.svg')">
                </a>
                <p class="error__message"  v-if="$v.password.$dirty && $v.password.$invalid">
                    <i class="far fa-times-circle"></i>
                    <span v-if="!$v.password.required">
                        Пароль должен быть заполнен
                    </span>
                </p>
            </div>
            <div class="input__wrapper">
                <input :type="showConfirmationPassword ? 'text' : 'password'" aria-label="Пароль" placeholder="Подтверждение пароля" v-model="$v.passwordConfirmation.$model">
                <a class="password__toggle" @click="showConfirmationPassword = !showConfirmationPassword">
                    <img :src="showConfirmationPassword ? require('../assets/icons/eye-on.svg') : require('../assets/icons/eye-off.svg')">
                </a>
                <p class="error__message"  v-if="$v.passwordConfirmation.$dirty && $v.passwordConfirmation.$invalid">
                    <i class="far fa-times-circle"></i>
                    <span v-if="!$v.passwordConfirmation.required">
                        Потверждение пароля должно быть заполнено
                    </span>
                    <span v-if="password !== passwordConfirmation">
                        Пароли не совпадают
                    </span>
                </p>
            </div>
            <div class="input__wrapper">
                <input type="text" aria-label="Имя" placeholder="Имя" v-model="$v.firstName.$model">
                <p class="error__message"  v-if="$v.firstName.$dirty && $v.firstName.$invalid">
                    <i class="far fa-times-circle"></i>
                    <span v-if="!$v.firstName.required">
                        Имя должно быть заполнено
                    </span>
                    <span v-else-if="!$v.firstName.maxLength || !$v.firstName.minLength">
                        Имя должно состоять минимум из 2-х символов
                    </span>
                </p>
            </div>
            <div class="input__wrapper">
                <input type="text" aria-label="Фамилия" placeholder="Фамилия" v-model="$v.lastName.$model">
                <p class="error__message"  v-if="$v.lastName.$dirty && $v.lastName.$invalid">
                    <i class="far fa-times-circle"></i>
                    <span v-if="!$v.lastName.required">
                        Фамилия должна быть заполнена
                    </span>
                    <span v-else-if="!$v.lastName.maxLength || !$v.lastName.minLength">
                        Фамилия должна состоять минимум из 2-х символов
                    </span>
                </p>
            </div>
            <div class="input__wrapper">
                <input type="text" aria-label="Отчество" placeholder="Отчество" v-model="fatherName">
            </div>
            <div class="input__wrapper">
                <input type="text" aria-label="Улица проживания" placeholder="Улица проживания" v-model="$v.address.$model">
                <p class="error__message"  v-if="$v.address.$dirty && $v.address.$invalid">
                    <i class="far fa-times-circle"></i>
                    <span v-if="!$v.address.required">
                        Улица проживания должна быть заполнена
                    </span>
                </p>
            </div>
            <div class="input__wrapper" v-if="registerType !== 'facebook'">
                <input type="email" aria-label="Email" placeholder="Email" v-model="$v.emailAddress.$model">
                <p class="error__message"  v-if="$v.emailAddress.$dirty && $v.emailAddress.$invalid">
                    <i class="far fa-times-circle"></i>
                    <span v-if="!$v.emailAddress.required">
                        E-mail должен быть заполнен
                    </span>
                    <span v-if="!$v.emailAddress.email">
                        Введенный e-mail неверный
                    </span>
                </p>
            </div>
            <div class="input__wrapper">
                <input :type="birthDateType" aria-label="Возраст" placeholder="Дата рождения" v-model="birth_date" style="background: transparent;" @focus="birthDateType = 'date'">
            </div>
            <mdb-btn color="default" block type="submit">Зарегистрироваться</mdb-btn>
        </form>
        <form @submit.prevent="confirmCode" v-if="loginStage === 'verification'">
            <div class="input__wrapper">
                <v-otp-input
                        ref="otpInput"
                        v-model="code"
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
            <mdb-btn color="default" block type="submit">Подтвердить</mdb-btn>
        </form>
        <div class="social--text__wrapper mb-2">
            <div class="social__line"></div>
            <a class="social__text">
                Уже есть аккаунт?
            </a>
            <div class="social__line"></div>
        </div>
        <mdb-btn color="default" block @click="$router.push('/login')">Войти</mdb-btn>
        <div class="pb-3"></div>
    </div>
</template>

<script>
    import Toolbar from "../components/Navigation/Toolbar";
    import { mdbBtn } from 'mdbvue';
    import { required, minLength, maxLength, email} from 'vuelidate/lib/validators';

    export default {
        components: {Toolbar, mdbBtn},
        data: () => ({
            showPassword: false,
            showConfirmationPassword: false,
           /* phone: '',*/
            password: '',
            passwordConfirmation: '',
            emailAddress: '',
            firstName: '',
            lastName: '',
            fatherName: '',
            address: '',
            birth_date: null,
            push_token: null,
            code: '',
            birthDateType: 'text',
            phone: '',
        }),
        methods: {
            async onSubmit() {
                this.$v.$touch()
                console.log(this.$v);
                if (this.$v.$error) {
                    return null;
                }

                const user = {
                    phone: this.phone,
                    password: this.password,
                    emailAddress: this.emailAddress,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    fatherName: this.fatherName,
                    address: this.address,
                    birth_date: this.birth_date,
                    push_token: null,
                };

                await this.$store.dispatch('register', user);
            },
            async confirmCode() {
                await this.$store.dispatch('checkCode', this.code);
            },
            onChangeOtp(val) {
                this.code = val;
            }
        },
        watch: {
            phone(val) {
                if (this.phone.toString().length >= 10) {
                    this.phone = this.phone.slice(0, 10);
                }
            },
           /* age(val) {
                if (this.age.toString().length > 2) {
                    this.age = 99;
                }
            }*/
        },
        computed: {
            loginStage() {
                return this.$store.getters.LOGIN_STAGE;
            },
            registerType() {
                const value = this.$route.query.type ?? 'phone';
                if (value === 'facebook') {
                    this.$v.emailAddress.model = this.$store.getters.EMAIL;
                    this.emailAddress = this.$store.getters.EMAIL;
                }
                return value;
            }
        },
        validations: {
            emailAddress: {
                required,
                email
            },
            password: {
                required
            },
            passwordConfirmation: {
                required,
            },
            firstName: {
                required,
                minLength: minLength(2)
            },
            lastName: {
                required,
                minLength: minLength(2)
            },
            address: {
                required,
            }
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