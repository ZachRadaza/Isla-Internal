<script setup>
import { ref } from 'vue';
import InputLabel from '../components/global/InputLabel.vue';
import useUser from '../composables/useUser.js';
import LoadingButton from '../components/global/LoadingButton.vue';

const { login, loading, error } = useUser();

const email = ref('');
const password = ref('');

async function loginUser(){
    const success = await login(email.value, password.value);
    password.value = '';

    if(success)
        window.location.href = '/';
}

</script>
<template>
<main>
    <div class="account-box">
        <form @submit.prevent="loginUser">
            <h2>Login</h2>

            <p v-if="error" class="error">{{ error }}</p>

            <InputLabel 
                v-model="email"
                label="Email"
                type="email"
                placeholder="islavilla@gmail.com"
                required
            />
            <InputLabel 
                v-model="password"
                label="Password"
                type="password"
                placeholder="super secret password"
                required
            />

            <LoadingButton 
                class="btn-primary" 
                type="submit"
                :loading
            >
                Login
            </LoadingButton>

            <RouterLink to="/register">Don't have an account</RouterLink>
        </form>
    </div>
</main>
</template>
<style scoped>

.account-box form{
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
}

a{
    text-align: center;
}

</style>