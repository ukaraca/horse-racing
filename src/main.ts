import { createApp } from "vue";
import App from "./app/app.vue";
import router from "./app/router";
import store from "./app/store";
import "./shared/styles/main.scss";

const app = createApp(App);
app.use(router);
app.use(store);
app.mount("#app");
