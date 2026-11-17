import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import StylesView from "../views/StylesView.vue";
import WalkthroughView from "../views/WalkthroughView.vue";
import ToDoView from "../views/ToDoView.vue";
import AccountView from "../views/AccountView.vue";
import AccountLoginView from "../views/AccountLoginView.vue";
import AccountRegisterView from "../views/AccountRegisterView.vue";
import useUser from "../composables/useUser.js";

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
        { path: '/register', component: AccountRegisterView},

        //hidden or to delete
        { path: '/styles', component: StylesView}
    ],
});

router.beforeEach((to, from) => {
    if(to.path === '/account'){
        const { isLoggedIn } = useUser();

        if(!isLoggedIn.value)
            return { path: '/login' };
    }
});

export default router;