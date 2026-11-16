import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import StylesView from "../views/StylesView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HomeView},
        { path: '/styles', component: StylesView}
    ],
});

export default router;