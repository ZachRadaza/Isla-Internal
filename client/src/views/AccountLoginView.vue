<script setup>
import { ref } from 'vue';
import InputLabel from '../components/global/InputLabel.vue';
import useUser from '../composables/useUser.js';

const { login } = useUser();

const email = ref('');
const password = ref('');

</script>
<template>
<main>
    <div class="account-box">
        <form @submit.prevent="login(email, password)">
            <h2>Login</h2>

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

            <button class="btn-primary" type="submit">Login</button>

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