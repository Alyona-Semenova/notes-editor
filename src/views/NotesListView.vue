<template>
    <section class="notes-list-view">
        <header class="header-page">
            <h1 class="header-page__title">Список заметок</h1>
        </header>

        <table class="table-notes">
            <thead>
                <tr>
                    <th>№</th>
                    <th>Название</th>
                    <th>Отметка о выполнении</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(note, index) in notes" :key="note.id">
                    <td>{{ index + 1 }}</td>
                    <td>
                        <RouterLink :to="{ name: 'noteInfoView', params: { name: formatNoteTitle(note.title) } }">
                            {{ note.title }}
                        </RouterLink>
                    </td>
                    <td>
                        <input type="checkbox" v-model="note.completed" />
                    </td>
                    <td>
                        <button @click="handleEditNote(note)">Редактировать</button>
                        <button @click="confirmDelete(note.id)">Удалить</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>

    <BaseModal v-if="isModalOpen" :id="noteId" @primaryAction="handleDeleteNote(noteId)"
        @secondaryAction="changeActiveModal(false)" @close="changeActiveModal(false)" />

</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router'
import { useNotesStore } from '../stores/notesStore';
import BaseModal from '../components/BaseModal.vue';

const notesStore = useNotesStore();
const notes = computed(() => notesStore.notes);
const noteId = ref(null);

let isModalOpen = ref(false);

/**
 * get notes from server on component mount
 */
onMounted(() => {
    notesStore.fetchNotes();
});

/**
 * format note title to url-friendly format
 * @param {string} title 
 */
const formatNoteTitle = (title: string) => {
    return title.trim().replace(/\s+/g, '-');
};

const confirmDelete = (id: number) => {
    noteId.value = id;
    changeActiveModal(true);
};


const handleDeleteNote = (id: number) => {
    notesStore.removeNote(id);
    changeActiveModal(false);
    noteId.value = null;
};

const changeActiveModal = (state?: boolean) => {
    isModalOpen.value = state ? state : !isModalOpen.value;
};

</script>

<style lang="scss" scoped>
.table-notes {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

h1 {
    margin-bottom: 20px;
}

button {
    margin-right: 5px;
    cursor: pointer;
}
</style>
