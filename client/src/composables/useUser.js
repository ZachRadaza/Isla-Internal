import { readonly, ref } from "vue";
import { loginUser } from "../services/user";

const user = ref(null);
const loading = ref(false);
const error = ref(null);

async function login({ email, password }){
    loading.value = true;

    if(!email || !password){
        error.value = 'Email or password in invalid';
        return;
    }

    try{
        const userL = await loginUser({email, password});
        
        console.log(userL);
    } catch(e){
        console.error('Error in logging in: ', e);
        error.value = e;
    } finally{
        loading.value = false;
    }
}

export default () => {
    return {
        user,
        loading: readonly(loading),
        error: readonly(error),
        login
    };
}