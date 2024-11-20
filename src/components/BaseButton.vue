<template>
    <button class="base-button" @click="goAction">
        <span class="base-button__text">{{ buttonText }}</span>
    </button>
</template>

<script setup lang="ts">

defineOptions({
    name: 'BaseButton',
})

const props = defineProps<{
    buttonText?: string; 
}>();

const emit = defineEmits<{
    (event: 'goAction'): void; 
}>();

const goAction = () => {
    emit('goAction');
}
</script>

<style lang="scss" scoped>
.base-button{
    width: fit-content;
    height: 30px;
    padding: 3px 10px;
    border-radius: 5px;
    background-color: #3AAFA9;
    outline: none;
    border: none;
    cursor: pointer;

    position: relative;
    -webkit-transition: all 0.2s;
    -o-transition: all 0.2s;
    transition: all 0.2s;

    &:active { 
      top: 1px;
    }

    &:hover{
        background-color: #2B7A78;
    }

    &__text {
      color: white;
    }
}
</style>