import { computed, readonly, ref, shallowReadonly } from "vue";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../services/user";

const loading = ref(false);
const error = ref(null);

const user = ref(null);
const isLoggedIn = computed(() => !!user.value);

async function login(email, password){
    if(!email || !password){
        error.value = 'Email or password in invalid';
        return;
    }

    loading.value = true;
    try{
        user.value = await loginUser({ email: email.toLowerCase(), password });

        error.value = null;
    } catch(e){
        console.error('Error in logging in: ', e);
        error.value = e;
    } finally{
        loading.value = false;
    }

    return !error.value;
}

async function getLoggedInUser(){
    loading.value = true;

    try{
        user.value = await getCurrentUser();

    } catch(e){
        console.warn("No logged in user: ", e);
    } finally{
        loading.value = false;
    }
}

async function register(email, password, firstName, lastName){
    if(!email || !password || !firstName || !lastName){
        error.value = 'Invalid fields';
        return;
    }

    loading.value = true;
    try{
        user.value = await registerUser({ email: email.toLowerCase(), password, firstName, lastName });

        error.value = null;
    } catch(e){
        console.error("Error in registering user: ", e);
        error.value = e;
    } finally{
        loading.value = false;
    }
    return !error.value;
}

async function logout(){
    loading.value = true;

    try{
        await logoutUser();

        user.value = null;
    } catch(e){
        console.error("Error in logging out user: ", e);
        error.value = e;
    }finally{
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
        getLoggedInUser,
        logout,
        register
    };
}