<template>
    <section class="notes-list-view">
        <header class="header-page">
            <h1 class="header-page__title">Список заметок</h1>
        </header>

        <BasePreloader v-if="isFetching" />

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
                        <button @click="confirmEdit(note)">Редактировать</button>
                        <button @click="confirmDelete(note.id)">Удалить</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>

    <BaseModal v-if="isModalOpen" 
        :readonly="modalState.readonly"
        :modalTitle="modalState.modalTitle" 
        :modalText="modalState.modalText"
        :primaryActionText="modalState.modalPrimaryActionText"
        :secondaryActionText="modalState.modalSecondaryActionText" 
        :id="noteId"
        @primaryAction="modalState.modalPrimaryActionHandler" 
        @secondaryAction="modalState.modalSecondaryActionHandler"
        @close="modalState.closeModal" />

</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router'
import { useNotesStore } from '../stores/notesStore';
import BaseModal from '../components/BaseModal.vue';
import BasePreloader from '../components/BasePreloader.vue';

const notesStore = useNotesStore();
const notes = computed(() => notesStore.notes);
const isFetching = computed(() => notesStore.isFetching);
const noteId = ref(null);

let modalState = reactive({
    readonly: null,
    modalTitle: '',
    modalText: '', 
    modalPrimaryActionText: '', 
    modalSecondaryActionText: '', 
    modalPrimaryActionHandler: () => { },
    modalSecondaryActionHandler: () => { }, 
    closeModal: () => { }, 
});


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

    let newModalState = {
        readonly: true, 
        modalTitle: 'Удалить',
        modalText: 'Действительно хотите удалить?',
        modalPrimaryActionText: 'Удалить',
        modalSecondaryActionText: 'Отмена',
        modalPrimaryActionHandler: () => handleDeleteNote(noteId.value),
        modalSecondaryActionHandler: () => closeModal(),
        closeModal: () => closeModal(),
    }

    openModal(newModalState)
};

const handleDeleteNote = (id: number) => {
    notesStore.removeNote(id);
    closeModal();
    noteId.value = null;
};


const confirmEdit = (note: any) => {
    noteId.value = note.id;

    let newModalState = {
        readonly: false, 
        modalTitle: 'Редактировать',
        modalText: note.title,
        modalPrimaryActionText: 'Сохранить',
        modalSecondaryActionText: 'Отмена',
        modalPrimaryActionHandler: (newNoteTitle: string) => handleEditNote(newNoteTitle),
        modalSecondaryActionHandler: () => closeModal(),
        closeModal: () => closeModal(),
    }

    openModal(newModalState);
};

const handleEditNote = (newNoteTitle: string) => {
    notesStore.editNote(noteId.value, newNoteTitle);
    closeModal();
    noteId.value = null;
};

/**
 * open modal window
 * @param {string} modalTitle 
 * @param {sriing} modalText 
 * @param {sriing} modalPrimaryActionText 
 * @param {sriing} modalSecondaryActionText 
 * @param {} primaryActionHandler 
 * @param {} secondaryActionHandle 
 */
let openModal = (newModalState) => {
    modalState = newModalState;
    changeActiveModal(true);
};

const closeModal = () => {
    modalState = {
        modalTitle: '',
        modalText: '',
        modalPrimaryActionText: '',
        modalSecondaryActionText: '',
        modalPrimaryActionHandler: () => {},
        modalSecondaryActionHandler: () => {},
    };

    changeActiveModal(false);
}

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
