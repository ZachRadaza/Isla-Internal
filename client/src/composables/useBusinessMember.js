import { computed, readonly, ref } from "vue";
import { getBusinessMember } from "../services/business";

const loading = ref(false);
const error = ref(false);

const member = ref(null);
const currentBusinessId = computed(() => member.value?.businessId ?? null);

async function loadMember(businessId){
    if(!businessId || businessId === currentBusinessId.value)
        return;

    loading.value = true;
    
    try{
        const { businessMember } = await getBusinessMember(businessId);
        member.value = businessMember;

        error.value = null;
    } catch(e){
        error.value = e;
    }finally{
        loading.value = false;
    }
}

export default () => ({
    member: readonly(member),
    currentBusinessId: readonly(currentBusinessId),
    loadMember
});