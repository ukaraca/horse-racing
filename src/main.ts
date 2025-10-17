import "./shared/styles/main.scss";

import { createApp } from "vue";

import App from "./app/app.vue";
import router from "./app/router";
import store from "./app/store";

const app = createApp(App);
app.use(router);
app.use(store);
app.mount("#app");
