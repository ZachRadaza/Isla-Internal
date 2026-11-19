<script setup>
import BusinessButton from '../components/business/BusinessButton.vue';
import useBusiness from '../composables/useBusiness';
import useUser from '../composables/useUser';

const { isLoggedIn, logout, user } = useUser();
const { userBusinesses, loadUsersBusinesses } = useBusiness();

loadUsersBusinesses();

</script>
<template>
<main>
    <!-- Left side of view-->
    <div id="account__view-title">
        <h2 class="account__view-title">Account Info</h2>

        <button 
            v-if="isLoggedIn"
            @click="logout"
            class="btn-primary"
        >
            Logout
        </button>
        <RouterLink
            v-else
            class="btn btn-primary"
            to="/login"
        >
            Login
        </RouterLink>
    </div>

    <!-- content side of view-->
    <div id="account__view-content" v-if="isLoggedIn">
        <div class="account__info">
            <h4 class="account__info-line">Email: <span>{{ user?.email }}</span></h4>
            <h4 class="account__info-line">First Name: <span>{{ user?.firstName }}</span></h4>
            <h4 class="account__info-line">Last Name: <span>{{ user?.lastName }}</span></h4>
            <h4 class="account__info-line">Role: <span>{{  }}</span></h4>
        </div>

        <div class="account__businesses">
            <h4 class="account__businesses-header">Busnisses</h4>
            <hr/>
            <BusinessButton
                v-for="business in userBusinesses"
                :key="business._id"
                :business
            />
        </div>
    </div>

    <!-- logged out-->
    <div id="account__view-logged-out" v-else>
        <p>Login to see Account Information</p>
    </div>
</main>
</template>
<style scoped>

main{
    position: relative;
    padding: var(--space-7);
    display: flex;
    flex-direction: row;
    gap: var(--space-6);
}

#account__view-title{
    position: sticky;
    top: var(--space-7);
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
}

#account__view-content{
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    padding: var(--space-2);
}

.account__info{
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
}

.account__info .account__info-line span{
    font-weight: var(--font-weight-md);
}

.account__businesses{
    display: flex;
    flex-direction: column;
}

.account__businesses-header{
    border-bottom: var(--border-wd-lg) solid var(--color-black);
    padding: var(--space-2);
}

#account__view-logged-out{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto auto;
}
</style>