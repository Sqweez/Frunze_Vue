<template>
    <div class="tab-page">
        <div class="news__image">
            <img :src="operator.photo" alt="">
        </div>
        <h1>{{ operator.name }}</h1>
        <div class="body" v-html="operator.bio"></div>
        <div class="body">
            <mdb-btn color="default" block @click="modal = true" class="mt-4">Написать оператору</mdb-btn>
        </div>
        <OperatorMessage :state="modal" :operator_id="id" @cancel="modal = false" />
    </div>
</template>

<script>
    import {mdbBtn} from 'mdbvue';
    import OperatorMessage from "../components/Modals/OperatorMessage";

    export default {
        components: {OperatorMessage, mdbBtn},
        data: () => ({
            modal: false,
        }),
        methods: {},
        computed: {
            id() {
                return this.$route.params.id;
            },
            operator() {
                return this.$store.getters.OPERATOR(this.id);
            }
        },
    }
</script>

<style scoped lang="scss">
    .tab-page {
        padding-top: 44px;
        padding-bottom: 68px;
    }

    .news__image {
        overflow: hidden;
        width: 50vw;
        margin: auto;
        height: 50vw;

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

    .body {
        padding: 0 10px;
    }

    p {
        margin: 15px 0;
    }
</style>