import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import Vue3Toastify, { toast } from "vue3-toastify";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import Button from "primevue/button";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import "primeicons/primeicons.css";
import "vue-final-modal/style.css";
import "./AxiosConfig";
import "primevue/resources/themes/aura-light-green/theme.css";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(Vue3Toastify, {
    autoClose: 2000,
    multiple: true,
});
app.use(createPinia().use(piniaPluginPersistedstate));
app.use(router);
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);
app.component("Button", Button);
app.component("ConfirmDialog", ConfirmDialog);
app.mount("#app");
