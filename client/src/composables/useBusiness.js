import { readonly, ref } from "vue";
import { getUserBusinesses } from "../services/business";
import useUser from "./useUser";

const userBusinesses = ref([]);
const loading = ref(false);
const error = ref(null);

async function loadUsersBusinesses(){
    loading.value = true;

    const { userId } = useUser();

    if(!userId.value){
        userBusinesses.value = [];
        return;
    }
    try{
        const { business } = await getUserBusinesses(userId.value);
        userBusinesses.value = business;
    } catch(e){
        error.value = e;
    } finally{
        loading.value = false;
    }
}

export default () => ({
    userBusinesses: readonly(userBusinesses),
    loading: readonly(loading),
    error: readonly(error),
    loadUsersBusinesses,
});