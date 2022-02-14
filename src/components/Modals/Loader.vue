<template>
    <div v-if="state" class="overlay">
        <div class="loading-body">
            <div class="spinner">
                <div class="bar1"></div>
                <div class="bar2"></div>
                <div class="bar3"></div>
                <div class="bar4"></div>
                <div class="bar5"></div>
                <div class="bar6"></div>
                <div class="bar7"></div>
                <div class="bar8"></div>
                <div class="bar9"></div>
                <div class="bar10"></div>
                <div class="bar11"></div>
                <div class="bar12"></div>
            </div>
            <p>
                Пожалуйста, подождите...
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        data: () => ({}),
        methods: {},
        computed: {
            state() {
                return this.$store.getters.IS_LOADING;
            }
        }
    }
</script>

<style scoped lang="scss">
    .overlay {
        width: 100%;
        position: fixed;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;


        .loading-body {
            width: 80vw;
            height: 100px;
            /*background: white;
            -webkit-box-shadow: -6px 20px 32px -14px rgba(0,0,0,0.75);
            -moz-box-shadow: -6px 20px 32px -14px rgba(0,0,0,0.75);
            box-shadow: -6px 20px 32px -14px rgba(0,0,0,0.75);*/
            border-radius: 10px;
            background: rgba( 255, 255, 255, 0.90 );
            box-shadow: 0 3px 32px 0 rgba(25, 25, 25, 0.37);
            backdrop-filter: blur( 4px );
            display: flex;
            align-items: center;

        }
    }

    div.spinner {
        position: relative;
        width: 54px;
        height: 54px;
        display: inline-block;
        margin-left: 11%;
        margin-top: 8%;
        padding: 10px;
        border-radius: 10px;
    }

    div.spinner div {
        width: 6%;
        height: 16%;
        background: #000;
        position: absolute;
        opacity: 0;
        -webkit-border-radius: 50px;
        -webkit-box-shadow: 0 0 3px rgba(0,0,0,0.2);
        -webkit-animation: fade 1s linear infinite;
    }

    @-webkit-keyframes fade {
        from {opacity: 1;}
        to {opacity: 0.25;}
    }

    div.spinner div.bar1 {
        -webkit-transform:rotate(0deg) translate(0, -130%);
        -webkit-animation-delay: 0s;
    }

    div.spinner div.bar2 {
        -webkit-transform:rotate(30deg) translate(0, -130%);
        -webkit-animation-delay: -0.9167s;
    }

    div.spinner div.bar3 {
        -webkit-transform:rotate(60deg) translate(0, -130%);
        -webkit-animation-delay: -0.833s;
    }
    div.spinner div.bar4 {
        -webkit-transform:rotate(90deg) translate(0, -130%);
        -webkit-animation-delay: -0.7497s;
    }
    div.spinner div.bar5 {
        -webkit-transform:rotate(120deg) translate(0, -130%);
        -webkit-animation-delay: -0.667s;
    }
    div.spinner div.bar6 {
        -webkit-transform:rotate(150deg) translate(0, -130%);
        -webkit-animation-delay: -0.5837s;
    }
    div.spinner div.bar7 {
        -webkit-transform:rotate(180deg) translate(0, -130%);
        -webkit-animation-delay: -0.5s;
    }
    div.spinner div.bar8 {
        -webkit-transform:rotate(210deg) translate(0, -130%);
        -webkit-animation-delay: -0.4167s;
    }
    div.spinner div.bar9 {
        -webkit-transform:rotate(240deg) translate(0, -130%);
        -webkit-animation-delay: -0.333s;
    }
    div.spinner div.bar10 {
        -webkit-transform:rotate(270deg) translate(0, -130%);
        -webkit-animation-delay: -0.2497s;
    }
    div.spinner div.bar11 {
        -webkit-transform:rotate(300deg) translate(0, -130%);
        -webkit-animation-delay: -0.167s;
    }
    div.spinner div.bar12 {
        -webkit-transform:rotate(330deg) translate(0, -130%);
        -webkit-animation-delay: -0.0833s;
    }

    p {
        font-size: 14px;
        font-weight: bold;
    }

</style>