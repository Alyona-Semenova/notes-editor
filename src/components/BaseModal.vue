<template>

        <div class="overlay"></div>
        <div class="base-modal">
            <CrossIcon :color="'red'" class="base-modal__close" @click.native="$emit('close')"/>
            <h3 class="base-modal__title"> {{ modalTitle }}</h3>
            <p v-if="readonly" class="base-modal__text">{{ localModalText }}</p>
            <input v-if="!readonly" class="base-modal__text base-modal__text_edit" :value="localModalText" @input="onInput"/>
            <div class="base-modal__actions">
                <button class="base-modal__button" @click="onPrimaryAction">{{ primaryActionText }}</button>
                <button class="base-modal__button" @click="onSecondaryAction">{{ secondaryActionText }}</button>
            </div>

        </div>
  
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { CrossIcon } from './icons/index'; 


defineOptions({
    name: 'BaseModal',
})

const emit = defineEmits(['primaryAction', 'secondaryAction', 'close'])

const props = defineProps({
    primaryActionText: {
        type: String,
        default: 'Удалить',
    },

    secondaryActionText: {
        type: String,
        default: 'Отмена',
    },

    modalTitle : {
        type: String,
        default: 'Удалить',
    },

    modalText: {
        type: String,
        default: 'Подтвердите действие',
    },

    readonly: {
        type: Boolean,
        default: true
    }
})

let localModalText = ref(props.modalText);

const onPrimaryAction = () => {
    if (!props.readonly && localModalText.value !== props.modalText) { 
        emit('primaryAction', localModalText.value);
    } else {
        emit('primaryAction')
    }
};

const onSecondaryAction = () => {
    emit('secondaryAction')
};

const onInput = (event: Event) => {
    localModalText.value = (event.target as HTMLInputElement).value; 
};

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
    position: fixed;
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

    &__button {
        cursor: pointer;
    }
}
</style>
