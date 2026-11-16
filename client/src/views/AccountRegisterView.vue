<script setup>
import { ref } from 'vue';
import useUser from '../composables/useUser';
import InputLabel from '../components/global/InputLabel.vue';

const { register } = useUser();

const email = ref('');
const password = ref('');
const firstName = ref('');
const lastName = ref('');

</script>
<template>
    <div class="account-box">
        <form @submit.prevent="register(email, password, firstName, lastName)">
            <h2>Register</h2>

            <InputLabel 
                v-model="firstName"
                label="First Name"
                type="text"
                placeholder="Zach"
                required
            />
            <InputLabel 
                v-model="lastName"
                label="Last name"
                type="text"
                placeholder="Radaza"
                required
            />
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

            <button class="btn-primary" type="submit">Register</button>

            <RouterLink to="/login">Already have an account</RouterLink>
        </form>
    </div>
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