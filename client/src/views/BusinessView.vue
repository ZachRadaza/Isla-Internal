<script setup>
import { ref, watch } from 'vue';
import { getVerifiedEmails, updateVerifiedEmails } from '../services/business';
import useBusinessMember from '../composables/useBusinessMember';
import useUser from '../composables/useUser';
import LoadingButton from '../components/global/LoadingButton.vue';

const { currentBusinessId } = useBusinessMember();
const { userInitialized } = useUser();

const verifiedEmails = ref([]);
const verifiedEmailsDisplayed = ref([]);
const verifiedEmailsDeleted = ref([]);
const isVerifiedEmailsEditing = ref(false);
const verifiedEmailToAdd = ref('');

const loading = ref(false);
const error = ref(null);

watch(userInitialized, loadVerifiedEmails, { immediate: true });

async function loadVerifiedEmails(){
    if(!currentBusinessId.value)
        return;

    loading.value = true;

    try{
        const { verifiedEmails: emails } = await getVerifiedEmails(currentBusinessId.value);
        verifiedEmails.value = emails;
        verifiedEmailsDisplayed.value = [...emails];

        error.value = null;
    } catch(e){
        error.value = e;
    } finally{
        loading.value = false;
    }

}

function addVerifiedEmail(){
    const verifiedEmail = {
        _id: crypto.randomUUID(), 
        email: verifiedEmailToAdd.value.toLowerCase(),
        newlyAdded: true
    };
    verifiedEmailsDisplayed.value.push(verifiedEmail);
    verifiedEmailToAdd.value = '';
}

function deleteVerifiedEmail(verifiedEmail){
    if(!verifiedEmail.newlyAdded)
        verifiedEmailsDeleted.value.push(verifiedEmail);

    verifiedEmailsDisplayed.value = verifiedEmailsDisplayed.value.filter((email) => email._id !== verifiedEmail._id);
}

async function saveVerifiedEmails(){
    loading.value = true;

    try{
        const emails = verifiedEmailsDisplayed.value.map((em) => {
            if(em.newlyAdded){
                delete em._id;
                delete em.newlyAdded;
            }

            return em;
        });

        await updateVerifiedEmails(currentBusinessId.value, { emails, deletedEmails: verifiedEmailsDeleted.value });

        window.location.reload();
    } catch(e){
        error.value = e;
    } finally{
        loading.value = false;
    }

    isVerifiedEmailsEditing.value = false;
}

function cancelVerifiedEmails(){
    verifiedEmailsDisplayed.value = [...verifiedEmails.value];
    isVerifiedEmailsEditing.value = false;
}

</script>
<template>
    <main>
        <div class="business__verified-emails">
            <!-- Verified Emails header-->
            <div class="business__verified-emails-header">
                <h4>Verified Emails Invitations</h4>

                <!-- Verified Email Header btns -->
                <button
                    v-if="!isVerifiedEmailsEditing"
                    @click="isVerifiedEmailsEditing = !isVerifiedEmailsEditing"
                >
                    Edit
                </button>
                <div v-else class="business__verified-emails-header-btns">
                    <button @click="cancelVerifiedEmails">
                        Cancel
                    </button>
                    <LoadingButton 
                        class="btn-primary" 
                        :loading="loading"
                        @click="saveVerifiedEmails"
                    >
                        Save
                    </LoadingButton>
                </div>
            </div>

            <!-- Verified Email list-->
            <ol class="business__verified-emails-list">
                <div v-if="verifiedEmailsDisplayed.length === 0 && !isVerifiedEmailsEditing">
                    No Current Verified Emails
                </div>

                <li v-for="email in verifiedEmailsDisplayed" :key="email._id">
                    <div class="business__verified-email">
                        <input 
                            v-model="email.email" 
                            :disabled="!isVerifiedEmailsEditing"
                        />
                        <button @click="deleteVerifiedEmail(email)" v-if="isVerifiedEmailsEditing">
                            Delete
                        </button>
                    </div>
                </li>
                <!-- Adding one -->
                <li v-if="isVerifiedEmailsEditing">
                    <div class="business__verified-email">
                        <input 
                            v-model="verifiedEmailToAdd" 
                            @keyup.enter="addVerifiedEmail"
                        />
                        <button 
                            @click="addVerifiedEmail"
                            class="btn-primary"
                            :disabled="verifiedEmailToAdd.length === 0"
                        >
                            Add Email
                        </button>
                    </div>
                </li>
            </ol>
        </div>
    </main>
</template>
<style scoped>

main{
    display: flex;
    flex-direction: column;
    padding: var(--space-6);
}

.business__verified-emails{
    display: flex;
    flex-direction: column;
}

.business__verified-emails-header{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.business__verified-emails-header-btns{
    display: flex;
    flex-direction: row;
    gap: var(--space-3);
}

.business__verified-emails ol{
    margin: 0;
}

.business__verified-email{
    margin: var(--space-2) 0;
}

.business__verified-email input{
    margin-right: var(--space-3);
    width: clamp(150px, 30vw, 500px);
}

.business__verified-email input:disabled{
    border-color: transparent;
}

</style>