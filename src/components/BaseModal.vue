<template>
    <section>
        <div class="overlay"></div>
        <div class="base-modal" role="dialog">
            <CrossIcon class="base-modal__close" @click.native="closeModal" />
            <h3 class="base-modal__title"> {{ modalTitle }}</h3>

            <slot> </slot>

            <div class="base-modal__actions">
                <BaseButton class="base-modal__button" :buttonText="primaryActionText" @goAction="onPrimaryAction" />
                <BaseButton class="base-modal__button" :buttonText="secondaryActionText"
                    @goAction="onSecondaryAction" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
//icons
import { CrossIcon } from './icons/index';

//components
import BaseButton from './BaseButton.vue';

defineOptions({
    name: 'BaseModal',
})

const emit = defineEmits(['primaryAction', 'secondaryAction', 'close'])

const props = defineProps<{
    primaryActionText?: string;
    secondaryActionText?: string;
    modalTitle?: string;
}>()

const {
    primaryActionText = 'Удалить',
    secondaryActionText = 'Отмена',
    modalTitle = 'Удалить',
} = props;

const trapTabKey = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
        event.preventDefault();
    };
};

onMounted(() => {
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', trapTabKey);
});

onBeforeUnmount(() => {
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', trapTabKey);
});

const onPrimaryAction = () => {
    emit('primaryAction');
};

const onSecondaryAction = () => {
    emit('secondaryAction');
};

const closeModal = () => {
    emit('close');
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
    height: 200px;
    position: fixed;
    top: calc(50% - 75px);
    left: calc(50% - 250px);
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    justify-content: space-between;
    z-index: 1;

    &__actions {
        display: flex;
        gap: 20px;
        justify-content: center;
        width: 100%;
    }

    &__close {
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 20px;
        cursor: pointer;
    }

    &__button {
        cursor: pointer;
    }
}
</style>
