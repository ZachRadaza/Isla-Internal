<script setup>
</script>
<template>
    <header class="isla-header">
        <RouterLink to="/" id="isla-header-home">Isla Villa Internal</RouterLink>
        <nav>
            <RouterLink to="/walkthrough">Walkthrough</RouterLink>
            <RouterLink to="/todo">To Do</RouterLink>
        </nav>
    </header>
</template>
<style scoped>

.isla-header{
    position: sticky;
    top: 0;
    background: var(--color-black);
    padding: var(--space-6);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.isla-header *{
    color: var(--color-white);
}

.isla-header #isla-header-home{
    font-family: var(--font-heading);
    font-size: var(--font-size-lg);
    line-height: 1.2;
    font-weight: var(--font-weight-lg);
    text-decoration: none;
}

.isla-header nav{
    display: flex;
    flex-direction: row;
    gap: var(--space-4);
}

</style>