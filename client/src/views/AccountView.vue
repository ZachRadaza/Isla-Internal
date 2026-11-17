<script setup>
import useUser from '../composables/useUser';

const { isLoggedIn, logout, user } = useUser();

</script>
<template>
<main>
    <h2>Temp account holder info</h2>

    <template v-if="isLoggedIn">
        <div class="account__info">
            <p><label>Email: </label> {{ user.email }}</p>
            <p><label>First Name: </label> {{ user.firstName }}</p>
            <p><label>Last Name: </label> {{ user.lastName }}</p>
        </div>

        <button 
            v-if="isLoggedIn"
            @click="logout"
            class="btn-primary"
        >
            Logout
        </button>
    </template>
    <template v-else>
        <p>No User Logged in</p>

        <RouterLink
            class="btn btn-primary"
            to="/login"
        >
            Login
        </RouterLink>
    </template>
</main>
</template>
<style scoped>

main{
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
}

</style>