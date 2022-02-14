<template>
    <div class="tab-page">
        <div class="news__image">
            <img :src="news.image"
                 alt="">
        </div>
        <h1>{{ news.title }}
        </h1>
        <div class="text" v-html="news.text"></div>
    </div>
</template>

<script>
    export default {
        data: () => ({}),
        created() {
        },
        methods: {},
        computed: {
            id() {
                return this.$route.params.id;
            },
            news() {
                return this.$store.getters.NEWS(this.id);
            }
        }
    }
</script>

<style scoped lang="scss">
    .tab-page {
        padding-top: 44px;
        padding-bottom: 68px;
    }

    .news__image {
        overflow: hidden;
        width: 100%;
        height: 200px;

        img {
            width: 100%;
            object-position: center;
            object-fit: cover;
        }
    }

    h1 {
        margin-top: 10px;
        font-size: 20px;
        font-weight: bold;
        padding-left: 15px;
        margin-left: 15px;
        width: 90%;
        border-left: 10px solid #0C9344;
    }


    .text {
        margin: 15px 0;
        padding: 0 10px;

        pre {
            display: block;
            font-size:  inherit;
            color: #000;
        }
    }
</style>