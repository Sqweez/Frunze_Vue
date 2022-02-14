const frontEndModule = {
    state: {
        sideMenu: false,
        languageModal: false,
        aboutModal: false,
        language: localStorage.getItem('language'),
        loading: false,
        isSnackbar: false,
        snackbarText: '',
        toolbarVisible: true,
    },
    getters: {
        SHOW_SIDE_MENU: s => s.sideMenu,
        SHOW_LANGUAGE_MODAL: s => s.languageModal,
        SHOW_ABOUT_MODAL: s => s.aboutModal,
        LANGUAGE: s => s.language,
        IS_LOADING: s => s.loading,
        IS_SNACKBAR: s => s.isSnackbar,
        SNACKBAR_TEXT: s => s.snackbarText,
        TOOLBAR_VISIBLE: s => s.toolbarVisible,
    },
    mutations: {
        TOGGLE_SIDE_MENU(state) {
            state.sideMenu = !state.sideMenu;
        },
        DISABLE_SIDE_MENU(state) {
            state.sideMenu = false;
        },
        ENABLE_SIDE_MENU(state) {
            state.sideMenu = true;
        },
        DISABLE_LANGUAGE_MODAL(state) {
            state.languageModal = false;
        },
        ENABLE_LANGUAGE_MODAL(state) {
            state.languageModal = true;
        },
        DISABLE_ABOUT_MODAL(state) {
            state.aboutModal = false;
        },
        ENABLE_ABOUT_MODAL(state) {
            state.aboutModal = true;
        },
        SET_LANGUAGE(state, language) {
            localStorage.setItem('language', language);
            state.language = language;
        },
        DISABLE_LOADING(state) {
            state.loading = false;
        },
        ENABLE_LOADING(state) {
            state.loading = true;
        },
        ENABLE_SNACKBAR(state, text) {
            state.snackbarText = text;
            state.isSnackbar = true;
        },
        DISABLE_SNACKBAR(state) {
            state.isSnackbar = false;
            state.snackbarText = '';
        },
        ENABLE_TOOLBAR(state) {
            state.toolbarVisible = true;
        },
        DISABLE_TOOLBAR(state) {
            state.toolbarVisible = false;
        }
    },
    actions: {}
};

export default frontEndModule;