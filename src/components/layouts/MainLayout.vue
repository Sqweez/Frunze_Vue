<template>
    <div>
        <div class="tab-content"  @touchstart="touchStartMethod" @touchEndMethod="touchEndMethod">
            <slot></slot>
        </div>
        <SideMenu></SideMenu>
        <Tabs></Tabs>
    </div>
</template>

<script>
    import Tabs from "../Navigation/Tabs";
    import SideMenu from "../Navigation/SideMenu";
    export default {
        components: {SideMenu, Tabs},
        data: () => ({}),
        methods: {
            touchStartMethod(touchEvent) {
                if (touchEvent.changedTouches.length !== 1) { // We only care if one finger is used
                    return;
                }
                const posXStart = touchEvent.changedTouches[0].clientX;
                addEventListener('touchend', (touchEvent) => this.touchEndMethod(touchEvent, posXStart), {once: true});
            },
            touchEndMethod(e, posXStart) {
                if (e.changedTouches.length !== 1) { // We only care if one finger is used
                    return;
                }
                const posXEnd = e.changedTouches[0].clientX;

                if (posXStart < posXEnd && posXStart <= 20 && !this.disableSwipe) {
                    this.$store.commit('ENABLE_SIDE_MENU');
                   // this.previous(); // swipe right
                } else if (posXStart > posXEnd) {
                    console.log('left');
                    //this.next(); // swipe left
                }
            }
        },
        computed: {
            disableSwipe() {
                return !!this.$route.meta.disableSwipe;
            }
        }
    }
</script>

<style scoped>
    .tab-content {
        /*padding-bottom: 68px; */
        min-height: 100vh;
    }
</style>