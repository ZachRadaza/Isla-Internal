<script setup>
defineOptions({ inheritAttrs: false });
defineProps({
    label: {
        type: String,
        required: true
    }
});

const input = defineModel();
</script>
<template>
    <div class="input-label input">
        <label class="input-label__label">{{ label }}</label>
        <input 
            class="input-label__input" 
            v-bind="$attrs"
            v-model="input"
        />
    </div>
</template>
<style scoped>

.input-label{
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
}

.input-label:has(:focus) .input-label__label{
    color: var(--color-blue);
}

.input-label:has(:invalid) .input-label__label{
    color: var(--color-red);
}

.input-label__label{
    font-size: var(--font-size-sm);
    font-family: var(--font-heading);
    text-transform: uppercase;
    font-weight: var(--font-weight-lg);
    color: inherit;
}

.input-label__input{
    border: none;
    padding: 0;
    background: transparent;
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    border-radius: 0;
}

</style>