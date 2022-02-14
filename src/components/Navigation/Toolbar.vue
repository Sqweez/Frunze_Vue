<template>
    <div class="toolbar" :class="{'toolbar--not-transparent': !transparent}" v-if="toolbar">
        <div class="icon__left">
            <button v-if="sideMenu" @click="$store.commit('ENABLE_SIDE_MENU')">
                <svg height="18" viewBox="0 -53 384 384" width="18" xmlns="http://www.w3.org/2000/svg" fill="#000">
                    <path d="m368 154.667969h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0"/>
                    <path d="m368 32h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0"/>
                    <path d="m368 277.332031h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0"/>
                </svg>
            </button>
            <button v-if="canBack" style="transform: rotate(180deg)" @click="$router.push(backRoute)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 492.004 492.004" fill="#000" height="15" width="15">
                    <path d="M382.678 226.804L163.73 7.86C158.666 2.792 151.906 0 144.698 0s-13.968 2.792-19.032 7.86l-16.124 16.12c-10.492 10.504-10.492 27.576 0 38.064L293.398 245.9l-184.06 184.06c-5.064 5.068-7.86 11.824-7.86 19.028 0 7.212 2.796 13.968 7.86 19.04l16.124 16.116c5.068 5.068 11.824 7.86 19.032 7.86s13.968-2.792 19.032-7.86L382.678 265c5.076-5.084 7.864-11.872 7.848-19.088.016-7.244-2.772-14.028-7.848-19.108z"/>
                </svg>
            </button>
        </div>
        <p>
            {{ title }}
        </p>
        <div class="icon__right">
            <img src="../../assets/images/logo__main.png" alt="">
        </div>
    </div>
</template>

<script>
    export default {
        data: () => ({}),
        methods: {},
        computed: {
            toolbar() {
                return this.$store.getters.TOOLBAR_VISIBLE;
            }
        },
        props: {
            title: {
                type: String,
                default: 'Фрунзе'
            },
            sideMenu: {
                type: Boolean,
                default: false,
            },
            canBack: {
                type: Boolean,
                default: false,
            },
            backRoute: {
                type: String,
                default: '/'
            },
            transparent: {
                type: Boolean,
                default: false,
            }
        },
    }
</script>

<style scoped lang="scss">
    .toolbar {
        height: 44px;
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 200px 1fr;
        align-content: center;
        color: #000;
        font-weight: bold;
        font-size: 17px;
        padding: 0 10px;
        background: transparent;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 5;

        &--not-transparent {
            background: rgba( 255, 255, 255, 0.90 );
            box-shadow: 0 3px 32px 0 rgba( 31, 38, 135, 0.37 );
            backdrop-filter: blur( 4px );
            -webkit-backdrop-filter: blur( 4px );
            border-bottom: 1px solid rgba( 255, 255, 255, 0.18 );
        }
    }

    .icon__left, p, .icon__right {
        height: 22px;
    }

    p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
        font-size: 16px;
    }

    button {
        background: none;
        border: none;
        outline: none;
    }

    img {
        width: 100%;
    }

    .icon__right  {
        width: 56px;
        justify-self: end;
    }
</style>