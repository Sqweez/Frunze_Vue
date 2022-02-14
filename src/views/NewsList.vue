<template>
    <div class="tab-page">
        <ul class="news__list">
            <router-link v-for="news of newsList" :to="`/news/${news.id}?pageName=${news.title}`" tag="li"
                         class="news__item">
                <div class="photo__wrapper">
                    <img :src="news.image" alt="">
                </div>
                <div class="news__info">
                    <h3>{{ news.title }}</h3>
                    <p>{{ news.date }}</p>
                </div>
            </router-link>
        </ul>
    </div>
</template>

<script>
    export default {
        data: () => ({}),
        methods: {},
        computed: {
            newsList() {
                return this.$store.getters.NEWS_LIST;
            }
        },
        async created() {
            await this.$store.dispatch('GET_NEWS_LIST');
        }
    }
</script>

<style scoped lang="scss">
    .tab-page {
        padding-top: 44px;
        padding-bottom: 68px;
    }
    .news__item {
        padding: 10px;
        display: flex;
        flex-direction: column;
        border-bottom: 5px solid #dedede;
    }

    .photo__wrapper {
        margin-left: auto;
        width: 100%;
        height: 150px;
        background: black;
        border-radius: 10px;
        overflow: hidden;
        margin-right: 10px;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }
    }

    h3 {
        font-weight: bold;
        font-size: 18px;
        margin-top: 7px;
        color: #3e3e3e;
        max-height: 42px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    p {
        font-size: 12px;
        text-align: right;
    }

    /* button {
         width: 15px;
         margin-left: auto;
         border: none;
         outline: none;
         background: transparent;
     }*/
</style>