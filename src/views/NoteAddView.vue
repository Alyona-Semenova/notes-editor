<template>
    <section class="note-add-view">
        <div class="arrow-back-icon">
            <ArrowBackIcon @click="$router.push('/')" />
        </div>

        <header class="header-page">
            <h1 class="header-page__title">Создать заметку</h1>
        </header>

        <form @submit.prevent="addNote" class="note-add-form">
            <div class="note-add-form__title">
                <label for="name">Название новой заметки: </label>
                <input type="text" v-model="newNote.title" name="name" id="name" required />
            </div>
            <div class="note-add-form__checkbox">
                <label for="checkbox">Отметка о выполнении: </label>
                <input type="checkbox" v-model="newNote.completed" name="checkbox" id="checkbox" />
            </div>
            <div class="note-add-form__add">
                <input type="submit" value="Добавить" />
            </div>
        </form>
    </section>
</template>


<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

import { useNotesStore } from '../stores/notesStore';
import { ArrowBackIcon } from '@/components/icons/index';

const router = useRouter();

const notesStore = useNotesStore();

const newNote = reactive({
    title: '',
    body: '',
    userId: 1,
})

const addNote = () => {
    const noteToAdd = {
        title: newNote.title,
        body: newNote.title,
        userId: newNote.userId,
    };
    notesStore.addNote(noteToAdd);
    router.push('/');
};

</script>

<style lang="scss" scoped>
.note-add-view {
    width: 100%;
    height: 100%;
}
</style>