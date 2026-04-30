import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./authStore";

export const useMainStore = defineStore("mainStore", {
    persist: true,

    state: () => ({
        zoom_counter: 1,
        sidebarOpen: false,
        isMobile: null,
        greetings: "Good Morning",
        zoom_levels: ["text-xs", "text-base", "text-lg", "text-xl", "text-2xl"],
        app_constants: null,
        plans: null,
        device_has_account_created: false,
        device_has_account_created_timestamp: null,
        payment_event: false,
        payment_id: null,
        intervalId: null,
    }),
    getters: {
        currentZoom: (state) => state.zoom_levels[state.zoom_counter], // Get the current zoom class
    },
    actions: {
        zoomIn() {
            if (this.zoom_counter < this.zoom_levels.length - 1) {
                this.zoom_counter++;
            }
        },
        zoomOut() {
            if (this.zoom_counter > 0) {
                this.zoom_counter--;
            }
        },

        // other utilities
        toggleSidebar() {
            this.sidebarOpen = !this.sidebarOpen;
        },
        //primariry for click outside
        closeSidebar() {
            this.sidebarOpen = false;
        },

        updateGreeting() {
            const currentHour = new Date().getHours();

            if (currentHour < 12) {
                this.greetings = "Good Morning";
            } else if (currentHour < 18) {
                this.greetings = "Good Afternoon";
            } else {
                this.greetings = "Good Evening";
            }
        },

        startInterval() {
            this.updateGreeting();
            this.stopInterval();

            this.intervalId = setInterval(() => {
                this.updateGreeting();
                if (this.payment_event) {
                    this.fetchSubStatus(this.payment_id);
                }
            }, 3000);

            setTimeout(() => {
                this.payment_event = false;
                this.payment_id = null;
            }, 60000);
        },

        stopInterval() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        },

        setDeviceHasAccountCreated() {
            this.device_has_account_created = true;
            this.device_has_account_created_timestamp = Date.now();
        },

        removeDeviceHasAccountCreated() {
            if (
                !this.device_has_account_created ||
                !this.device_has_account_created_timestamp
            ) {
                return;
            }

            const diffInHours =
                (Date.now() - this.device_has_account_created_timestamp) / 36e5;

            if (diffInHours >= 168) {
                this.device_has_account_created = false;
                this.device_has_account_created_timestamp = null;
            }
        },

        resetApp() {
            this.stopInterval();
            this.$reset();
        },

        async getEssentials() {
            //get all plans
            await axios.get("/plans").then((res) => {
                this.plans = res.data.data;
            });
        },

        //added later to solve a problem
        async fetchSubStatus(paymentID) {
            const { data } = await axios.get(
                `/payments/check-access?payment_id=${paymentID}`,
                { showLoader: false },
            );

            let status = data.data.payment_status;
            let subscriptions = data.data.subscriptions;

            if (status !== "pending") {
                if (status == "completed") {
                    const { user, updateUser } = useAuthStore();
                    updateUser({
                        ...user,
                        subscriptions: subscriptions,
                    });
                    this.payment_event = false;
                    this.payment_id = null;
                }
            }
        },

        initializeStoreServices() {
            this.removeDeviceHasAccountCreated();
            this.startInterval();
            this.getEssentials();
        },
    },
});
