<template>
    <div>
        <div ref='googleMap' class='google-map' v-show="!showPanorama"></div>
        <SubmitProblem :state="modal" :lat="lat" :lng="lng" @cancel="modal = false" @submit="onSubmit"/>
        <button @click="createAProblem" class="addProblem" v-if="!toolbar">
           <span>+</span>
        </button>
        <button @click="getCurrentPosition">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 477.883 477.883">
                <path d="M468.456 1.808c-4.811-2.411-10.478-2.411-15.289 0L9.433 223.675c-8.429 4.219-11.842 14.471-7.624 22.9 2.401 4.798 6.919 8.188 12.197 9.151l176.111 32.034 32.034 176.111c1.311 7.219 7.091 12.793 14.353 13.841.803.116 1.613.173 2.423.171 6.469.003 12.383-3.651 15.275-9.438L476.07 24.711c4.222-8.427.813-18.681-7.614-22.903zM246.557 407.38l-24.986-137.353c-1.292-6.936-6.718-12.362-13.653-13.653L70.498 231.32 422.634 55.244 246.557 407.38z"/>
            </svg>
        </button>
        <div id="pano" v-show="showPanorama">

        </div>
        <ProblemModal :state="problemModal" :marker="currentMarker" @close="problemModal = false; currentMarker = null;"/>
    </div>
</template>

<script>
    import SubmitProblem from "./Modals/SubmitProblem";
    import ProblemModal from "./Modals/ProblemModal";

    export default {
        components: {ProblemModal, SubmitProblem},
        data: () => ({
            bounds: new google.maps.LatLngBounds(), // Авто масштабирование карты
            mapOptions: {
                center: {lat: 42.8700000, lng: 74.5900000},
                zoomControl: false,
                zoom: 12,
                gestureHandling: 'greedy',
                mapId: '48fe2b8e03333248',
                mapTypeControl: false,
                fullscreenControl: false,
                streetViewControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_CENTER,
                },
            },
            modal: false,
            lat: 42.87,
            lng: 74.59,
            map: null,
            markersList: [],
            problemModal: false,
            currentMarker: null,
            panorama: null,
            panoramaVisible: false,
            panoramaCoords: {
                lat: 42.8700000, lng: 74.5900000
            },
            showPanorama: false,
        }),
        methods: {
            createAProblem() {
                this.lat = this.panoramaCoords.lat ||  42.8700000;
                this.lng = this.panoramaCoords.lng || 74.5900000;
                if (this.isAuth) {
                    this.modal = true;
                } else {
                    this.$store.commit('ENABLE_SNACKBAR', 'Авторизуйтесь, чтобы продолжить')
                }
            },
            handleMarkerClick(e, marker) {
                this.currentMarker = marker;
                this.problemModal = true;
            },
            async initMap(coords) {
                this.$store.commit('ENABLE_LOADING');
                const options = {...this.mapOptions};
                let marker = null;

                if (coords) {
                    this.mapOptions.center = {...coords};
                }

                this.map = await new google.maps.Map(this.$refs.googleMap, {
                    ...this.mapOptions
                })

                this.panorama = await this.map.getStreetView();

                if (coords) {
                    options.center.lat = coords.lat;
                    options.center.lng = coords.lng;
                    marker = new google.maps.Marker({
                        position: {...coords},
                        title: "Моя позиция",
                        map: this.map,
                    });
                }



                google.maps.event.addListener(this.map, 'click', e => {
                    this.handleClick(e)
                })

                this.$store.commit('DISABLE_LOADING');

            },
            async handleClick(e) {
                const latLng = e.latLng;
                this.lat = latLng.lat();
                this.lng = latLng.lng();
                if (this.isAuth) {
                    this.modal = true;
                } else {
                    this.$store.commit('ENABLE_SNACKBAR', 'Авторизуйтесь, чтобы продолжить')
                }
            },
            onSubmit() {
                this.modal = false;
            },
            async getCurrentPosition() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(this.getLocation)
                }
            },
            getLocation(pos) {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                this.map = null;
                this.initMap({lat, lng});
            },
        },
        async mounted() {
            await this.initMap();
            await this.$store.dispatch('GET_MARKERS');
        },
        computed: {
            isAuth() {
                return this.$store.getters.IS_AUTH;
            },
            markers() {
                return this.$store.getters.MARKERS;
            },
            isPanoVisible() {
                return this.panorama?.getVisible();
            },
            toolbar() {
                return this.$store.getters.TOOLBAR_VISIBLE;
            },
            panoramaString() {
                return this.panorama?.getPano();
            }
        },
        props: {},
        watch: {
            panoramaString(val) {
                console.log(val);
            },
            markers(val) {
                val.forEach((marker, index) => {
                    this.markersList[index] = new google.maps.Marker({
                        position: marker.position,
                        map: this.map,
                        title: "Плохая дорога",
                        id: marker.id,
                    });

                    google.maps.event.addListener(this.markersList[index], 'click', e  => {
                        this.handleMarkerClick(e, marker);
                    });
                })
            },
            async isPanoVisible(val) {
                this.panorama = await this.map.getStreetView();
                if (val && this.panorama) {
                    this.$store.commit('DISABLE_TOOLBAR');
                    const lat = this.panorama.position?.lat();
                    const lng = this.panorama.position?.lng();
                    this.panoramaCoords = {
                        lat, lng
                    };
                } else {
                    this.$store.commit('ENABLE_TOOLBAR');
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .google-map {
        width: 100%;
        height: 100%;
    }

    #pano {
         width: 100%;
        height: 100%;
    }

    button {
        position: absolute;
        z-index: 3;
        top: 80vh;
        left: 4%;
        height: 45px;
        width: 45px;
        background: white;
        border-radius: 100%;
        border: none;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 3px 32px 0 rgba(31, 38, 135, 0.37);
        outline: none;


        &.addProblem {
            top: 73vh;
            font-size: 40px;
        }

        svg {
            width: 25px;
            height: 25px;
        }
    }

    p {
        position: absolute;
        top: 50%;
        font-weight: bold;
        left: 50%;
        z-index: 3;
        transform: translate(-50%, -50%);
    }

    .gmnoprint {
        top: 0!important;
    }
</style>
