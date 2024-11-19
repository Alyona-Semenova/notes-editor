<template>
    <section class="notes-list-view">

        <BaseHeaderPage :headerPageTitle="'Список заметок'" />
        <RouterLink to="/add" class="notes-list-view__add-note"> + Добавить заметку</RouterLink>

        <BasePreloader v-if="isFetching"/>

        <table class="table-notes">
            <TableHeader 
                :toggleFilter="toggleFilter" 
                :isCompletedFilter="isCompletedFilter" 
                @update:completedFilter="value => isCompletedFilter = value" 
                />
            <tbody class="table-notes__body">
                <TableRow 
                    v-for="(note, index) in filteredNotes" 
                    :key="note.id" 
                    :note="note" 
                    :index="index" 
                    :confirmEdit="confirmEdit" 
                    :confirmDelete="confirmDelete" 
                />
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
import { RouterLink, useRoute, useRouter } from 'vue-router';
// types
import type { INote, IModalState } from '../types';
// store
import { useNotesStore } from '../stores/notesStore';
// components
import BaseModal from '../components/BaseModal.vue';
import BasePreloader from '../components/BasePreloader.vue';
import TableHeader from '../components/table/TableHeader.vue';
import TableRow from '../components/table/TableRow.vue';
import BaseHeaderPage from '../components/BaseHeaderPage.vue';

const notesStore = useNotesStore();
const notes = computed(() => notesStore.notes);
const isFetching = computed(() => notesStore.isFetching);
const noteId = ref<number | null>(null);

const route = useRoute();
const router = useRouter();
const isCompletedFilter = computed(() => route.query.completed === 'true');

let modalState = reactive({
    readonly: true,
    modalTitle: '',
    modalText: '', 
    modalPrimaryActionText: '', 
    modalSecondaryActionText: '', 
    modalPrimaryActionHandler: () => { },
    modalSecondaryActionHandler: () => { }, 
    closeModal: () => { }, 
});

let isModalOpen = ref<boolean>(false);

const filteredNotes = computed<INote[]>(() => {
    if (isCompletedFilter.value) {
        return notes.value.filter(note => note.completed);
    }
    return notes.value;
});

const toggleFilter = () => {
    const newFilterState: boolean = !isCompletedFilter.value;
    notesStore.setCompletedFilter(newFilterState);
    router.push({ query: { completed: newFilterState } });
};

/**
 * get notes from server on component mount
 */
onMounted(() => {
    notesStore.fetchNotes();
});

const confirmDelete = (id: number): void => {
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

const handleDeleteNote = (id: number): void => {
    notesStore.removeNote(id);
    closeModal();
    noteId.value = null;
};

const confirmEdit = (note: INote): void => {
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

const handleEditNote = (newNoteTitle: string, completed: boolean): void => {
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
let openModal = (newModalState: IModalState): void => {
    modalState = newModalState;
    changeActiveModal(true);
};

const closeModal = (): void => {
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

.table-notes{
    margin-top: 10px;
    width: 100%;
    border-collapse: collapse;
}
.notes-list-view{
    &__add-note{
        display:inline-block ;
        width: 100%;
        text-align: end;
        color: #2B7A78;
        font-weight: bold;
        font-style: italic;
        text-decoration: none;
    }
}



</style>
