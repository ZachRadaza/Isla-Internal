<script setup>
import Header from './src/components/Header.vue';

</script>
<template>
    <Header/>
    <RouterView />
</template>
<style>

:root{
    --font-heading: "Manrope", sans-serif;;
    --font-body: "DM Sans", sans-serif;

    --font-size-xs: 0.7rem;
    --font-size-sm: 0.875rem;
    --font-size-md: 1rem;
    --font-size-lg: 1.5rem;
    --font-size-xl: 2rem;
    --font-size-xxl: 4rem; 

    --font-weight-md: 400;
    --font-weight-lg: 700;

    --color-black: #1A1A1A;
    --color-white: #F8F7F3;
    --color-green: #2F6B4F;
    --color-red: #A94442;
    --color-blue: #315C85;

    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.5rem;
    --space-6: 2rem;
    --space-7: 3rem;
}

html{
    font-size: var(--font-size-md);
    font-family: var(--font-body);
    font-optical-sizing: auto;
}

body{
    padding: 0;
    margin: 0;
}

h1, h2, h3, h4, h5, h6{
    font-family: var(--font-heading);
    line-height: 1.2;
    margin: 0;
    color: var(--color-black);
    font-weight: var(--font-weight-lg);
    letter-spacing: 0.1em;
    text-transform: uppercase;
}

h1{ font-size: var(--font-size-xxl) }
h2{ font-size: var(--font-size-xl) }
h3{ font-size: var(--font-size-lg) }
h4{ font-size: var(--font-size-md) }
h5{ font-size:  var(--font-size-sm)}
h6{ font-size: var(--font-size-xs) }

</style>