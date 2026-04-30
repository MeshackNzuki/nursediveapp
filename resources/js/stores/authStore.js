import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import axios from "axios";
import router from "@/router";

export const useAuthStore = defineStore("useAuthStore", {
    persist: true,
    state: () => ({
        is_authenticated: false,
        user: null,
    }),
    actions: {
        login(userData) {
            // Perform login operation here...
            // After successful login, update the store's state with user data
            this.user = userData;

            if (userData.token) {
                this.is_authenticated = true;
            }
        },
        updateUser(newUserData) {
            this.user = newUserData;
        },
        logout(NoApiCall = true) {
            // Perform logout operation here...
            this.user = null;
            this.is_authenticated = false;
            // Reset the store's state
            if (NoApiCall) {
                return router.push("/login");
            }
            axios
                .post("/logout")
                .then(() => {
                    this.user = null;
                    this.is_authenticated = false;
                    router.push("/login");
                })
                .catch((error) => {
                    console.error("Logout failed:", error);
                    //still remove user data
                    this.user = null;
                    this.is_authenticated = false;
                    router.push("/login");
                });
            router.push("/login");
        },
        isPlanExpired(plan) {
            if (!plan?.expires) return true;

            const expiry = new Date(`${plan.expires}T23:59:59Z`); // UTC
            return Date.now() > expiry.getTime();
        },
        active(productCode) {
            const subs = this.user.subscriptions;
            if (!subs || !subs[productCode]) return false;
            if (this.isTrial(productCode)) return false;
            const validPlans = ["premium", "standard", "premium_plus"];
            return subs[productCode].some(
                (p) =>
                    validPlans.includes(p.plan_name) && !this.isPlanExpired(p),
            );
        },
        isActive(productCode) {
            return this.active(productCode);
        },
        isTrial(productCode) {
            const subs = this.user.subscriptions;
            if (!subs || !subs[productCode]) return false;
            return subs[productCode].some(
                (p) => !this.isPlanExpired(p) && p.plan_name === "trial",
            );
        },
        wasTrial(productCode) {
            const subs = this.user.subscriptions;
            if (!subs || !subs[productCode]) return false;
            return subs[productCode].some(
                (p) => this.isPlanExpired(p) && p.plan_name === "trial",
            );
        },

        daysLeft(productCode) {
            const subs = this.user.subscriptions;
            if (!subs || !subs[productCode]) return 0;
            const nowDate = new Date();
            const future = subs[productCode]
                .map((p) => ({ ...p, _d: new Date(p.expires + "T23:59:59") }))
                .filter((p) => p._d > nowDate)
                .sort((a, b) => a._d - b._d);

            if (!future.length) return 0;
            const diffMs = future[0]._d.getTime() - nowDate.getTime();
            return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        },
        pricingRoute(productCode) {
            const routes = {
                teas: "/teas-pricing",
                nursing: "/nursing-pricing",
                nclex: "/nclex-pricing",
            };

            return routes[productCode] || "/subscription";
        },        
    },
});
