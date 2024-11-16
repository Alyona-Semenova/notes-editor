<template>
    <div class="overlay"></div>
    <div class="base-modal">
        <div class="base-modal__close" @click="$emit('close')">&times;</div>
        <h3 class="base-modal___title"> {{ title }}</h3>
        <div class="base-modal__actions">
            <button class="base-modal___button" @click="$emit('primaryAction')">{{ primaryAction }}</button>
            <button class="base-modal___button" @click="$emit('secondaryAction')">{{ secondaryAction }}</button>
        </div>
    </div>
</template>


<script setup lang="ts">
defineOptions({
    name: 'BaseModal',
})

defineProps({
    primaryAction: {
        type: String,
        default: 'Удалить',
    },
    secondaryAction: {
        type: String,
        default: 'Отмена',
    },
    title: {
        type: String,
        default: 'Удалить',
    },
    id: {
        type: Number,
        required: true,
    },

})
</script>

<style lang="scss" scoped>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 0;
}

.base-modal {
    width: 500px;
    height: 150px;
    position: absolute;
    top: calc(50% - 75px);
    left: calc(50% - 250px);
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    z-index: 1;

    &__actions {
        display: flex;
        gap: 10px;
        justify-content: center;
        width: 100%;
    }

    &__close {
        position: absolute;
        top: 10px;
        right: 20px;
        font-size: 20px;
        cursor: pointer;
    }
}
</style>
