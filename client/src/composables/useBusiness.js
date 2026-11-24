import { readonly, ref } from "vue";
import { getQABusinessId, getUserBusinesses } from "../services/business";
import useUser from "./useUser";

const loading = ref(false);
const error = ref(null);

const userBusinesses = ref([]);
const qaBusinessId = ref(null);

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

        error.value = null;
    } catch(e){
        error.value = e;
    } finally{
        loading.value = false;
    }
}

async function loadQABusinessId(){
    try{
        const { businessId } = await getQABusinessId();
        qaBusinessId.value = businessId;
    } catch(error){
        console.warn('Error loading QA Business');
    }
}

export default () => ({
    userBusinesses: readonly(userBusinesses),
    qaBusinessId: readonly(qaBusinessId),
    loading: readonly(loading),
    error: readonly(error),
    loadUsersBusinesses,
    loadQABusinessId
});