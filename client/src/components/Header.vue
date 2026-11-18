<script setup>
import useUser from '../composables/useUser';
import IslaVillaIcon from './icons/IslaVillaIcon.vue';

const { user, isLoggedIn } = useUser();

</script>
<template>
    <header class="isla-header">
        <RouterLink to="/" id="isla-header-home">
            <IslaVillaIcon />
            Isla Villa Internal
        </RouterLink>
        <nav>
            <RouterLink to="/walkthrough">Walkthrough</RouterLink>
            <RouterLink to="/todo">To Do</RouterLink>
            <RouterLink to="/account">
                <template v-if="isLoggedIn">
                    {{ user.firstName }} {{ user.lastName }}
                </template>
                <template v-else>
                    Account
                </template>
            </RouterLink>
        </nav>
    </header>
</template>
<style scoped>

.isla-header{
    position: sticky;
    top: 0;
    background: var(--color-black);
    padding: var(--space-5) var(--space-6);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    z-index: 9999;
}

.isla-header *{
    color: var(--color-white);
}

.isla-header a{
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: all 100ms ease;
}

.isla-header a:is(:hover, :focus-visible){
    color: var(--color-white);
    opacity: 1;
    border-bottom-color: var(--color-white);
}

.isla-header #isla-header-home{
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--space-4);

    font-family: var(--font-heading);
    font-size: var(--font-size-lg);
    line-height: 1.2;
    font-weight: var(--font-weight-lg);
    text-transform: uppercase;
    padding: var(--space-1);
}

.isla-header #isla-header-home .icon{
    fill: var(--color-white);
}

.isla-header nav{
    display: flex;
    flex-direction: row;
    gap: var(--space-4);
}

</style>