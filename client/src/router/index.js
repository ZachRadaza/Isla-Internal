import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import StylesView from "../views/StylesView.vue";
import WalkthroughView from "../views/WalkthroughView.vue";
import ToDoView from "../views/ToDoView.vue";
import AccountView from "../views/AccountView.vue";
import AccountLoginView from "../views/AccountLoginView.vue";
import AccountCreateView from "../views/AccountCreateView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        //main views
        { path: '/', component: HomeView},
        { path: '/walkthrough', component: WalkthroughView},
        { path: '/todo', component: ToDoView},

        //account views
        { path: '/account', component: AccountView},
        { path: '/login', component: AccountLoginView},
        { path: '/createaccount', component: AccountCreateView},

        //hidden or to delete
        { path: '/styles', component: StylesView}
    ],
});

export default router;