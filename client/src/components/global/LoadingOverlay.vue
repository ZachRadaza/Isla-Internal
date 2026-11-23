<script setup>
import IslaVillaIcon from '../icons/IslaVillaIcon.vue';

defineProps({
    loading: {
        type: Boolean,
        required: true
    }
});

</script>
<template>
    <div v-if="loading" class="loading-overlay">
        <IslaVillaIcon class="loading-icon"/>
    </div>
</template>
<style scoped>

.loading-overlay{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.loading-icon{
    fill: var(--color-black);
    width: 50px;
    height: 100%;
    animation: spin 1500ms ease-in-out infinite;
}

@keyframes spin {
    from { transform: rotate(0turn); }
    to   { transform: rotate(1turn); }
}

</style>