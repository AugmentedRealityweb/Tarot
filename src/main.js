import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import Success from "./components/Success.vue";
import Cancel from "./components/Cancel.vue";

const routes = [
  { path: "/", component: App },
  { path: "/success", component: Success },
  { path: "/cancel", component: Cancel },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount("#app");
