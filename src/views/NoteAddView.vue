<template>
    <section class="note-add-view">
        <div class="arrow-back-icon" title="Назад">
            <ArrowBackIcon @click="$router.push('/')" />
        </div>

        <BaseHeaderPage :headerPageTitle="'Создать заметку'" />

        <form @submit.prevent="addNote" class="note-add-form">
            <BaseInput 
                label="Название новой заметки"
                inputId="name"
                v-model="newNote.title"
                :hasError="errors.title !== ''"
                :errorMessage="errors.title"
                :needLabel="true"
            />
            <div class="note-add-form__checkbox">
                <label for="checkbox">Отметка о выполнении: </label>
                <input type="checkbox" v-model="newNote.completed" name="checkbox" id="checkbox" />
            </div>
            <div class="note-add-form__add">
                <BaseButton :buttonText="'Добавить'"/>
            </div>
        </form>
    </section>
</template>


<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

import { useNotesStore } from '../stores/notesStore';
import { ArrowBackIcon } from '@/components/icons/index';

//components
import  BaseButton  from '@/components/BaseButton.vue';
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

const errors = reactive({
    title: '',
});


const addNote = () => {
    const noteToAdd = {
        title: newNote.title,
        body: newNote.title,
        userId: newNote.userId,
        completed: newNote.completed,
    };

    const isValid = validateNote(noteToAdd);

    if(isValid) {
        notesStore.addNote(noteToAdd);
        router.push('/');
    } 

};


const validateNote = (note) => {
    errors.title = ''; 
    const titleLength = note.title.length;

    if (titleLength < 3 || titleLength > 50) {
        errors.title = 'Название заметки должно содержать от 3 до 50 символов';
        return false;
    }
    return true;
};



</script>

<style lang="scss" scoped>

.note-add-view {
    width: 100%;
    height: 100%;

    .arrow-back-icon{
        cursor: pointer;
    }

    .note-add-form{
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        &__checkbox{
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