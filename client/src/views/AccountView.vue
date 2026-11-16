<script setup>
import useUser from '../composables/useUser';


const { isLoggedIn, logout } = useUser();

</script>
<template>
<main>
    <button 
        v-if="isLoggedIn"
        @click="logout"
    >
        Logout
    </button>
</main>
</template>
<style scoped>
</style>