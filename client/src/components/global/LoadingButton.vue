<script setup>
import IslaVillaIcon from '../icons/IslaVillaIcon.vue';

defineProps({
    loading: {
        type: Boolean,
        required: false
    }
})

</script>
<template>
    <button :disabled="loading">
        <template v-if="!loading">
            <slot />
        </template>
        <IslaVillaIcon v-else class="loading-icon"/>
    </button>
</template>
<style scoped>

.loading-icon{
    fill: var(--color-black);
    width: var(--font-size-md);
    height: 100%;
    animation: spin 1500ms ease-in-out infinite;
}

@keyframes spin {
  from { transform: rotate(0turn); }
  to   { transform: rotate(1turn); }
}

.btn-primary .loading-icon{
    fill: var(--color-white);
}

.btn-no-bg .loading-icon{
    fill: var(--color-black);
}
</style>