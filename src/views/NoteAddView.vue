<template>
    <section class="note-add-view">
        <div class="arrow-back-icon" title="Назад">
            <ArrowBackIcon @click="$router.push('/')" />
        </div>

        <BaseHeaderPage :headerPageTitle="'Создать заметку'" />

        <form @submit.prevent="addNote" class="note-add-form">
            <BaseInput label="Название новой заметки"
                inputId="add-note" 
                v-model="newNote.title" 
                :needLabel="true"
                :validations="validationsArray" 
                @isAllValid="setValidationsPassedValue" 
            />

            <div class="note-add-form__checkbox">
                <label for="checkbox">Отметка о выполнении: </label>
                <input type="checkbox" v-model="newNote.completed" name="checkbox" id="checkbox" />
            </div>
            <div class="note-add-form__add">
                <BaseButton :buttonText="'Добавить'" />
            </div>
        </form>
    </section>
</template>


<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
//stores
import { useNotesStore } from '../stores/notesStore';
//icons
import { ArrowBackIcon } from '@/components/icons/index';
// types
import { ValidationTypes, createValidator } from '../types/ValidationTypes';
import type { IValidationSetting } from '../types/ValidationTypes';

//components
import BaseButton from '@/components/BaseButton.vue';
import BaseHeaderPage from '@/components/BaseHeaderPage.vue';
import BaseInput from '@/components/BaseInput.vue';

const router = useRouter();
const notesStore = useNotesStore();
const newNote = reactive({
    title: '',
    body: '',
    userId: 1,
    completed: false,
})

let validationsArray = reactive<IValidationSetting[]>([
    {
        title: ValidationTypes.Length,
        settings: createValidator(ValidationTypes.Length, 3, 50),
    },
]);

let isAllValidationsPassed = ref(false);
const setValidationsPassedValue = (value: boolean) => {
    isAllValidationsPassed.value = value;
}

const addNote = () => {
    const noteToAdd = {
        id: -1,
        title: newNote.title,
        body: newNote.title,
        userId: newNote.userId,
        completed: newNote.completed,
    };

    if (isAllValidationsPassed.value === true) {
        notesStore.addNote(noteToAdd);
        router.push('/');
    }
};
</script>

<style lang="scss" scoped>
.note-add-view {
    width: 100%;
    height: 100%;

    .arrow-back-icon {
        cursor: pointer;
    }

    .note-add-form {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        &__checkbox {
            label {
                user-select: none;
                cursor: pointer;
            }
        }

        &__add {
            margin-top: 10px;
        }
    }

    .input-error {
        border: 1px solid red;
    }

    .error-message {
        color: red;
        font-size: 12px;
    }
}
</style>