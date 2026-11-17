<script setup>
import Header from './src/components/Header.vue';
import useUser from './src/composables/useUser.js';

const { getLoggedInUser } = useUser();

getLoggedInUser();

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
    --color-grey-dark: #333230;
    --color-grey-light: #EAE8E2;
    --color-green: #2F6B4F;
    --color-red: #A94442;
    --color-blue: #315C85;
    --color-link: #2563EB;

    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.5rem;
    --space-6: 3rem;
    --space-7: 6rem;

    --border-rd-max: 999px;
    --border-rd-sm: 0.25rem;
    --border-rd-md: 0.5rem;
    --border-rd-lg: 1rem;

    --border-wd-sm: 1px;
    --border-wd-lg: 0.1rem;
}

html{
    font-size: var(--font-size-md);
    font-family: var(--font-body);
    font-optical-sizing: auto;
    background: var(--color-white);
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

.error{
    color: var(--color-red);
}

.success{
    color: var(--color-green);
}

/* tags */
.tag-green,
.tag-red,
.tag-blue{
    padding: var(--space-1) var(--space-2);
    border-radius: var(--border-rd-max);
    color: var(--color-white);
}

.tag-green{
    background: var(--color-green);
}

.tag-red{
    background: var(--color-red);
}

.tag-blue{
    background: var(--color-blue);
}

/* anchor */
a{
    font-family: var(--font-body);
    color: var(--color-link);
    text-decoration: underline;
    cursor: pointer;
    transition: opacity 100ms ease;
}

a:is(:hover, :focus-visible){
    opacity: 0.75;
}

/* buttons */
button, .btn{
    all: unset;
    background: var(--color-white);
    color: var(--color-black);
    border: var(--border-wd-sm) solid var(--color-black);
    border-radius: var(--border-rd-md);
    padding: var(--space-3);
    font-family: var(--font-body);
    font-size: var(--font-size-md);
    text-align: center;
    transition: background 100ms ease, color 100ms ease;
    cursor: pointer;
}

:is(.btn, button):is(:hover, :focus-visible){
    background: var(--color-grey-light);
    border-color: var(--color-grey-dark);
}

:is(.btn, button):disabled{
    cursor: not-allowed;
    background: var(--color-grey-light);
    border-color: var(--color-grey-dark);
}

.btn-primary{
    background: var(--color-black);
    color: var(--color-white)
}

.btn-primary:is(:hover, :focus-visible){
    background: var(--color-grey-dark);
    border-color: var(--color-grey-dark);
}

.btn-primary:disabled{
    background: var(--color-grey-dark);
    border-color: var(--color-grey-dark);
}

.btn-no-bg{
    background: transparent;
    border: none;
    color: var(--color-black);
}

.btn-no-bg:is(:hover, :focus-visible){
    color: var(--color-grey-dark);
    opacity: 0.9;
}

.btn-no-bg:disabled{
    color: var(--color-grey-dark);
    opacity: 0.7;
}

/* input and textarea */
input, textarea, .input{
    all: unset;
    background: var(--color-white);
    border: var(--border-wd-lg) solid var(--color-black);
    border-radius: var(--border-rd-md);
    color: var(--color-black);
    font-family: var(--font-body);
    font-size: var(--font-size-md);
    padding: var(--space-3);
}

:is(input, textarea, .input):is(:hover, :focus-visible){
    border-color: var(--color-grey-dark);
}

:is(input, textarea, .input):focus,
.input:has(:focus){
    border-color: var(--color-blue);
}

:is(input, textarea, .input):invalid,
.input:has(:invalid){
    border-color: var(--color-red);
}
/* cheeckbox */
input[type="checkbox"]{
    width: 20px;
    height: 20px;
    padding: 0;
    background-color: var(--color-white);
    background-image:
        linear-gradient(45deg, transparent 48%, var(--color-black) 48%, var(--color-black) 52%, transparent 52%),
        linear-gradient(-45deg, transparent 48%, var(--color-black) 48%, var(--color-black) 52%, transparent 52%);
    transition: background 100ms ease;
}

input[type="checkbox"]:is(:hover, :focus-visible){
    background-color: var(--color-grey-light);
}

input[type="checkbox"]:checked{
    background-color: var(--color-black);
    background-image:
        linear-gradient(45deg, transparent 48%, var(--color-white) 48%, var(--color-white) 52%, transparent 52%),
        linear-gradient(-45deg, transparent 48%, var(--color-white) 48%, var(--color-white) 52%, transparent 52%);
}

input[type="checkbox"]:checked:is(:hover, :focus-visible){
    background-color: var(--color-grey-dark);
}

/* Icons */
.icon{
    width: 40px;
    height: 40px;
    color: inherit;
    stroke: inherit;
    fill: inherit;
    transition: all 100ms ease;
}

/* Account Views styles */
.account-box{
    border: var(--border-wd-lg) solid var(--color-black);
    border-radius: var(--border-rd-lg);
    padding: var(--space-6);
    width: 400px;
    margin: var(--space-7) auto 0 auto;
}
</style>