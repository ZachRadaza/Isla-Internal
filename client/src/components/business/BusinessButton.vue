<script setup>
import useBusinessMember from '../../composables/useBusinessMember';


defineProps({
    business: {
        type: Object,
        required: true,
    }
});

const { currentBusinessId } = useBusinessMember();

</script>
<template>
    <button 
        class="business-btn" 
        :class="{ current: currentBusinessId === business?._id}"
    >
        <h4 class="business-btn__name">
            {{ business.name }} 
            <template v-if="currentBusinessId === business?._id">(Current)</template>
        </h4>
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

.business-btn.current{
    background: var(--color-blue);
    color: var(--color-white);
}

.business-btn__name{
    color: inherit;
}

.business-btn.current .business-btn__name span{
    display: block;
}

.business-btn__role{
    color: var(--color-grey-dark);
}

.business-btn.current .business-btn__role{
    color: var(--color-grey-light);
}

</style>