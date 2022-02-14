<template>
    <div id="snackbar" :class="{'show': state}">
        {{ text }}
    </div>
</template>

<script>
    export default {
        data: () => ({}),
        methods: {},
        computed: {
            state() {
                return this.$store.getters.IS_SNACKBAR;
            },
            text() {
                return this.$store.getters.SNACKBAR_TEXT;
            }
        },
        watch: {
            state(val) {
                if (val) {
                    setTimeout(() => {
                        this.$store.commit('DISABLE_SNACKBAR');
                    }, 2000)
                }
            }
        }
    }
</script>

<style scoped>
    #snackbar {
        visibility: hidden; /* Hidden by default. Visible on click */
        min-width: 90vw; /* Set a default minimum width */
        background-color: #333; /* Black background color */
        color: #fff; /* White text color */
        text-align: center; /* Centered text */
        padding: 16px; /* Padding */
        position: fixed; /* Sit on top of the screen */
        z-index: 99999; /* Add a z-index if needed */
        left: 15px;
        right: 15px;
        bottom: 30px; /* 30px from the bottom */
        border-radius: 10px;
    }

    /* Show the snackbar when clicking on a button (class added with JavaScript) */
    #snackbar.show {
        visibility: visible; /* Show the snackbar */
        /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
        However, delay the fade out process for 2.5 seconds */
        -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
        animation: fadein 0.5s, fadeout 0.5s 2.5s;
    }

    /* Animations to fade the snackbar in and out */
    @-webkit-keyframes fadein {
        from {bottom: 0; opacity: 0;}
        to {bottom: 30px; opacity: 1;}
    }

    @keyframes fadein {
        from {bottom: 0; opacity: 0;}
        to {bottom: 30px; opacity: 1;}
    }

    @-webkit-keyframes fadeout {
        from {bottom: 30px; opacity: 1;}
        to {bottom: 0; opacity: 0;}
    }

    @keyframes fadeout {
        from {bottom: 30px; opacity: 1;}
        to {bottom: 0; opacity: 0;}
    }
</style>