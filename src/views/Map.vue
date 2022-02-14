<template>
    <div>
        <GoogleMap />
    </div>
</template>

<script>
    import GoogleMap from "../components/GoogleMap";
    export default {
        components: {GoogleMap},
        data: () => ({}),
        methods: {},
        computed: {}
    }
</script>

<style scoped lang="scss">
    div {
        height: 100vh;
        padding-bottom: -68px;
    }
</style>
