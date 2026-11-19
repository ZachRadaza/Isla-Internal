<script setup>

defineProps({
    business: {
        type: Object,
        required: true,
    }
});

</script>
<template>
    <button class="business-btn">
        <h4 class="business-btn__name">{{ business.name }}</h4>
        <p class="business-btn__role">{{ business.role }}</p>
    </button>
</template>
<style scoped>

.business-btn{
    display: flex;
    flex-direction: column;
    padding-top: var(--space-6);
    border-width: var(--border-wd-lg);
    text-align: start;
    min-width: clamp(150px, 15vw, 300px);
}

.business-btn__role{
    color: var(--color-grey-dark);
}

</style>