import { computed, readonly, ref, shallowReadonly } from "vue";
import { getCurrentUser, loginUser } from "../services/user";

const loading = ref(false);
const error = ref(null);

const user = ref(null);
const isLoggedIn = computed(() => !!user.value);

async function login({ email, password }){
    loading.value = true;

    if(!email || !password){
        error.value = 'Email or password in invalid';
        return;
    }

    try{
        user.value = await loginUser({email, password});
        
        error.value = null;
    } catch(e){
        console.error('Error in logging in: ', e);
        error.value = e;
    } finally{
        loading.value = false;
    }
}

async function getLoggedInUser(){
    loading.value = true;

    try{
        user.value = await getCurrentUser();

        error.value = false;
    } catch(e){
        console.error("Error in getting logged in user: ", e);
        error.value = e;
    } finally{
        loading.value = false;
    }
}

export default () => {
    return {
        user: shallowReadonly(user),
        isLoggedIn: readonly(isLoggedIn),
        loading: readonly(loading),
        error: readonly(error),
        login,
        getLoggedInUser
    };
}