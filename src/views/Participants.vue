<template>
    <div class="tab-page">
        <ul class="participants__list">
            <router-link tag="li" :to="`/participants/${operator.id}?pageName=${operator.name}`" class="participant__item" v-for="operator of operators" :key="operator.id">
                <div class="photo__wrapper">
                    <img :src="operator.photo" alt="">
                </div>
                <div class="participant__info">
                    <h3>{{ operator.name }}</h3>
                    <p>{{ operator.position }}</p>
                </div>
                <button>
                    <img src="../assets/icons/right-arrow.svg" alt="">
                </button>
            </router-link>
        </ul>
    </div>
</template>

<script>
    export default {
        data: () => ({}),
        methods: {},
        computed: {
            operators() {
                return this.$store.getters.OPERATORS;
            }
        },
        async created() {
            await this.$store.dispatch('GET_OPERATORS_LIST');
        }
    }
</script>

<style scoped lang="scss">
    .tab-page {
        padding-top: 44px;
        padding-bottom: 68px;
    }

    .participant__item {
        height: 80px;
        padding: 10px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ced4da;
    }

    .photo__wrapper {
        width: 60px;
        height: 60px;
        background: black;
        border-radius: 100%;
        overflow: hidden;
        margin-right: 10px;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top;
        }
    }

    h3 {
        font-weight: bold;
        font-size: 18px;
        color: #3e3e3e;
    }

    p {
        font-size: 12px;
    }

    button {
        width: 15px;
        margin-left: auto;
        border: none;
        outline: none;
        background: transparent;
    }

</style>