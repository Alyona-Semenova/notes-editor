<template>
    <section class="notes-list-view">
        <header class="header-page">
            <h1 class="header-page__title">Список заметок</h1>
            <a @click="$router.push('/add')"> + Добавить заметку</a>

        </header>

        <BasePreloader v-if="isFetching" />

        <table class="table-notes">
            <thead>
                <tr>
                    <th>№</th>
                    <th>Название</th>
                    <th @click="toggleFilter"><span>Отметка о выполнении</span><input type="checkbox" v-model="isCompletedFilter"></th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(note, index) in filteredNotes" :key="note.id">
                    <td>{{ index + 1 }}</td>
                    <td>
                        <RouterLink :to="{ name: 'noteInfoView', state: {id: note.id}, params: { name: formatNoteTitle(note.title)} }">
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
import { RouterLink, useRoute, useRouter } from 'vue-router'
// store
import { useNotesStore } from '../stores/notesStore';
// components
import BaseModal from '../components/BaseModal.vue';
import BasePreloader from '../components/BasePreloader.vue';

const notesStore = useNotesStore();
const notes = computed(() => notesStore.notes);
const isFetching = computed(() => notesStore.isFetching);
const noteId = ref(null);

const route = useRoute();
const router = useRouter();
const isCompletedFilter = computed(() => route.query.completed === 'true');

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

const filteredNotes = computed(() => {
    if (isCompletedFilter.value) {
        return notes.value.filter(note => note.completed);
    }
    return notes.value;
});

const toggleFilter = () => {
    const newFilterState = !isCompletedFilter.value;
    notesStore.setCompletedFilter(newFilterState);
    router.push({ query: { completed: newFilterState } });
};


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



const confirmEdit = (note: INote) => {
    noteId.value = note.id;

    let newModalState = {
        readonly: false,
        modalTitle: 'Редактировать',
        modalText: note.title,
        modalPrimaryActionText: 'Сохранить',
        modalSecondaryActionText: 'Отмена',
        modalPrimaryActionHandler: (newNoteTitle: string) => handleEditNote(newNoteTitle, note.completed),
        modalSecondaryActionHandler: () => closeModal(),
        closeModal: () => closeModal(),
    }

    openModal(newModalState);
};

const handleEditNote = (newNoteTitle: string, completed: boolean) => {
    notesStore.editNote(noteId.value, newNoteTitle, completed);
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
