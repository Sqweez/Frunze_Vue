import {auth, usersRef, firebase, facebookAuthProvider, googleAuthProvider} from "../../firebase";
import router from "../../router";


export default {
    state: {
        confirmResult: null,
        phone: null,
        isAuth: false,
        user: false,
        auth_checked: false,
        recaptchaVerifier: false,
        token: null,
        secret: localStorage.getItem('secret'),
        loginStage: 'login',
        userExists: false,
        email: null,
    },
    getters: {
        SMS_SENT: state => !!state.confirmResult,
        CONFIRM_RESULT: state => state.confirmResult,
        PHONE: s => s.phone,
        IS_AUTH: s => s.isAuth,
        USER: s => s.user,
        AUTH_CHECKED: s => s.auth_checked,
        RECAPTCHA_VERIFIER: s => s.recaptchaVerifier,
        PUSH_TOKEN: s => s.token,
        SECRET: s => s.secret,
        LOGIN_STAGE: s => s.loginStage,
        USER_EXISTS: s => s.userExists,
        EMAIL: s => s.email,
    },
    mutations: {
        setConfirmResult(state, payload) {
            state.confirmResult = payload;
        },
        setSecret(state, payload) {
            localStorage.setItem('secret', payload);
            state.secret = payload;
        },
        setPushToken(state, payload) {
            state.token = payload;
        },
        setPhone(state, payload) {
            state.phone = payload
        },
        setIsAuth(state, payload) {
            state.isAuth = payload;
        },
        setUser(state, payload) {
            state.user = payload;
        },
        setAuthChecked(state) {
            state.auth_checked = true;
        },
        setRecaptchaVerifier(state, payload) {
            state.recaptchaVerifier = payload;
        },
        setLoginStage(state, payload) {
            state.loginStage = payload;
        },
        setUserExists(state, payload) {
            state.userExists = payload;
        },
        SET_EMAIL(state, payload) {
            state.email = payload;
        }
    },
    actions: {
        async setPushToken({commit, dispatch, getters}, payload) {
            commit('setPushToken', payload)
        },
        async signOut({commit, dispatch}) {
            await auth.signOut();
            commit('setUser', null);
            commit('setIsAuth', false);
            commit('setPhone', '');
            commit('ENABLE_SNACKBAR', 'Вы успешно вышли из аккаунта');
            await router.replace('/login');
        },
        async setAuthState({commit, dispatch}) {
            await commit('ENABLE_LOADING');
            const user = await auth.currentUser;
            if (user) {
                await commit('setIsAuth', true);
                await dispatch('getUserData', user.uid);
            } else {
                localStorage.removeItem('vuex');
            }
            await commit('setAuthChecked');
            await commit('DISABLE_LOADING');
        },
        async getUserData({commit, getters}, uid) {
            const response = await usersRef.where('auth_id', '==', uid).get();
            if (response.docs[0]) {
                commit('setUser', {id: response.docs[0].id, ...response.docs[0].data()});
                if (getters.PUSH_TOKEN) {
                    usersRef.doc(response.docs[0].id).update({push_token: getters.PUSH_TOKEN})
                }
            }
        },
        async login({commit, dispatch}, phone) {
            await dispatch('signInWithPhoneNumber', phone);

        },
        async loginViaFacebook({commit, dispatch}) {
            try {
                const result = await auth.signInWithPopup(facebookAuthProvider);
                commit('SET_EMAIL', result.user.email);
                const exists = await dispatch('checkUserExisting', result.user.uid);
                if (!exists) {
                    await router.replace('/register?type=facebook')
                } else {
                    await dispatch('setAuthState');
                    await router.replace('/');
                }
            } catch (e) {
                console.log(e);
            }
        },
        async loginViaGoogle({commit, dispatch}) {
            try {
                const result = await auth.signInWithPopup(googleAuthProvider);
                commit('SET_EMAIL', result.user.email);
                const exists = await dispatch('checkUserExisting', result.user.uid);
                if (!exists) {
                    await router.replace('/register?type=facebook')
                } else {
                    await dispatch('setAuthState');
                    await router.replace('/');
                }
            } catch (e) {
                console.log(e);
            }
        },
        async register({commit, dispatch, getters}, user) {
            commit('setUser', user);
            const uid = await auth.currentUser.uid;
            dispatch('setRegisterData', uid);
        },
        async signInWithPhoneNumber({commit, dispatch, getters}, phone) {
            await commit('ENABLE_LOADING');
            let recaptchaVerifier;
            if (getters.RECAPTCHA_VERIFIER) {
                recaptchaVerifier = getters.RECAPTCHA_VERIFIER;
            } else {
                recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                    size: 'invisible',
                });
                commit('setRecaptchaVerifier', recaptchaVerifier);
            }
            const phoneNumberString = "+996" + phone;
            try {
                const confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumberString, recaptchaVerifier);
                commit('ENABLE_SNACKBAR', 'На ваш номер отправлен 6-значный код подтверждения!')
                commit('setConfirmResult', confirmationResult);
                commit('setPhone', '+996' + phone);
                commit('setLoginStage', 'verification')
            } catch (e) {
                console.log(e);
                commit('ENABLE_SNACKBAR', 'Не удалось отправить SMS. Попробуйте позднее или свяжитесь со службой поддержки!')
            } finally {
                await commit('DISABLE_LOADING');
            }
        },
        async checkCode({commit, dispatch, getters}, password) {
            await commit('ENABLE_LOADING');
            try {
                const response = await getters.CONFIRM_RESULT.confirm(password);
                const uid = response.user.uid;
                const userExisting = await dispatch('checkUserExisting', uid);
                if (userExisting) {
                    await dispatch('setAuthState');
                    await router.replace('/');
                } else {
                    commit('setLoginStage', 'login');
                    await router.replace('/register');
                }
            } catch (e) {
                commit('ENABLE_SNACKBAR', 'Введенный код не совпадает или устарел!')
            } finally {
                document.querySelector('#recaptcha-container').innerHTML = "";
                await commit('DISABLE_LOADING');
            }
        },
        async setRegisterData({dispatch, getters}, uid) {
            const user = {...getters.USER, push_token: getters.PUSH_TOKEN, auth_id: uid};
            if (getters.PHONE) {
                user.phone = getters.PHONE;
            }
            if (getters.EMAIL) {
                user.emailAddress = getters.EMAIL;
            }
            await usersRef.add(user);
            await dispatch('setAuthState');
            await router.replace('/');
        },
        async checkUserExisting({commit}, uid) {
            const response = await usersRef.where('auth_id', '==', uid).get();
            return !!response.docs[0];
        },
        async checkPhoneExisting({commit}, phone) {
            const response = await usersRef.where('phone', '==', `+996${phone}`).get();
            return !!response.docs[0];
        }
    }
}