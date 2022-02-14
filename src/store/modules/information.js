import {applicationsRef, fireStorage, newsRef, operatorsRef} from "../../firebase";
import axios from 'axios';
function formatDate(date) {

    let dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    let mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    let yy = date.getFullYear() % 100;
    if (yy < 10) yy = '0' + yy;

    return dd + '.' + mm + '.' + yy;
}

const informationModule = {
    state: {
        newsList: [],
        operators: [],
        applications: [],
        markers: [],
    },
    getters: {
        NEWS_LIST: s => s.newsList,
        OPERATORS: s => s.operators,
        NEWS: s => id => s.newsList.find(n => n.id === id),
        OPERATOR: s => id => s.operators.find(n => n.id === id),
        MARKERS: s => s.markers,
    },
    mutations: {
        SET_NEWS_LIST(state, payload) {
            state.newsList = payload.map(p => {
                const date = new Date(p.created_at);
                p.date = formatDate(date);
                //p.date = `${date.getDate()}.${date.}.${date.getFullYear()}`
                return p;
            })
        },
        SET_OPERATORS_LIST(state, payload) {
            state.operators = payload;
        },
        SET_MARKERS(state, payload) {
            state.markers = payload;
        },
        ADD_MARKER(state, payload) {
            state.markers.push(payload);
        }
    },
    actions: {
        async GET_NEWS_LIST({commit, getters}) {
            try {
                if (!getters.NEWS_LIST.length) {
                    commit('ENABLE_LOADING');
                }
                const response = await newsRef.get();
                const news = response.docs.map(d => ({id: d.id, ...d.data()}));
                commit('SET_NEWS_LIST', news);
            } catch (e) {
                console.log(e);
            } finally {
                commit('DISABLE_LOADING');
            }

        },
        async GET_OPERATORS_LIST({commit, getters}) {
            try {
                if (!getters.OPERATORS.length) {
                    commit('ENABLE_LOADING');
                }
                const response = await operatorsRef.get();
                const operators = response.docs.map(d => ({id: d.id, ...d.data()}));
                commit('SET_OPERATORS_LIST', operators);
            } catch (e) {
                console.log(e);
            } finally {
                commit('DISABLE_LOADING');
            }
        },
        async SUBMIT_APPLICATION({commit, getters}, application) {
            try {
                commit('ENABLE_LOADING');
                if (application.file) {
                    const response = await fireStorage.ref('applications').child(`${Date.now().toString()}`).put(application.file);
                    application.image = await response.ref.getDownloadURL();
                }
                delete application.file;
                application.user_id = getters.USER.id;
                application.user_auth_id = getters.USER.auth_id;
                await applicationsRef.add(application);
                commit('ADD_MARKER', {
                    position: {
                        lat: application.lat,
                        lng: application.lng
                    },
                    id: `${Date.now().toString()}`,
                    text: application.text,
                    image: application.image,
                })

                const user = getters.USER;

                const telegram_message =
                    `<b>Новое обращение❗❗❗</b>\n` +
                    `<b>От:</b> ${user.firstName} ${user.lastName}\n` +
                    `<b>Возраст:</b> ${user.birth_date}\n` +
                    `<b>Email:</b> ${user.emailAddress}\n` +
                    `<b>Контактный телефон:</b> ${user.phone}\n` +
                    `<b>Текст обращение:</b> ${application.text}\n` +
                    `<b>Ссылка на фотографию:</b> ${application.image}&token=0db451ff-cc85-4260-a2a3-a3ad0a997ec5`

                await axios.get(`https://api.telegram.org/bot${process.env.VUE_APP_TELEGRAM_TOKEN}/sendMessage?parse_mode=HTML&chat_id=${process.env.VUE_APP_TELEGRAM_CHAT}&text=${encodeURI(telegram_message)}`);

                commit('ENABLE_SNACKBAR', 'Ваше обращение успешно принято!')
            } catch (e) {
                throw e;
            } finally {
                commit('DISABLE_LOADING');
            }
        },
        async GET_MARKERS({commit, getters}) {
            try {
                commit('ENABLE_LOADING');
                const response = await applicationsRef.get();
                const markers = response.docs.map(d => ({id: d.id, ...d.data()})).map(marker => {
                    return {
                        id: marker.id,
                        position: {
                            lat: marker.lat,
                            lng: marker.lng
                        },
                        text: marker.text,
                        image: marker.image,
                        user_id: marker.user_id,
                    };
                })

                commit('SET_MARKERS', markers);
            } catch (e) {

            } finally {
                commit('DISABLE_LOADING');
            }
        },
        async SEND_OPERATOR_MESSAGE({commit, getters, dispatch}, message) {
            const user = getters.USER;
            const operator = getters.OPERATOR(message.operator_id);
            const telegram_message =
                `<b>Новое сообщение❗❗❗</b>\n` +
                `<b>Для:</b> ${operator.name}\n` +
                `<b>От:</b> ${user.firstName} ${user.lastName}\n` +
                `<b>Контактный телефон:</b> ${user.phone}\n` +
                `<b>Текст сообщения:</b> ${message.text}`

            await axios.get(`https://api.telegram.org/bot${process.env.VUE_APP_TELEGRAM_TOKEN}/sendMessage?parse_mode=HTML&chat_id=${process.env.VUE_APP_TELEGRAM_CHAT}&text=${encodeURI(telegram_message)}`);


            commit('ENABLE_SNACKBAR', 'Ваше сообщение отправлено!')
        }
    }
};

export default informationModule;