<template>
    <section class="notes-list-view">
        <header class="header-page">
            <h1 class="header-page__title">Список заметок</h1>
            <a class="header-page__add" @click="$router.push('/add')"> + Добавить заметку</a>
        </header>

        <BasePreloader v-if="isFetching"/>

        <table class="table-notes">
            <thead class="table-notes__header">
                <tr class="table-notes__header-row">
                    <th class="table-notes__header-cell cell-1">№</th>
                    <th class="table-notes__header-cell cell-2">Название</th>
                    <th class="table-notes__header-cell cell-3" @click="toggleFilter"><span>Отметка о выполнении</span><input type="checkbox" v-model="isCompletedFilter"></th>
                    <th class="table-notes__header-cell cell-4">Действия</th>
                </tr>
            </thead>
            <tbody class="table-notes__body">
                <tr class="table-notes__body-row" v-for="(note, index) in filteredNotes" :key="note.id" :class="{ 'completed': note.completed }">
                    <td class="table-notes__body-cell cell-1">{{ index + 1 }}</td>
                    <td class="table-notes__body-cell cell-2">
                        <RouterLink :to="{ name: 'noteInfoView', state: {id: note.id}, params: { name: formatNoteTitle(note.title)} }">
                            {{ note.title }}
                        </RouterLink>
                    </td>
                    <td class="table-notes__body-cell cell-3">
                        <input type="checkbox" v-model="note.completed"  />
                    </td>
                    <td class="table-notes__body-cell cell-4">
                        <BaseButton :buttonText="'Редактировать'" @goAction="confirmEdit(note)" />
                        <BaseButton :buttonText="'Удалить'" @goAction="confirmDelete(note.id)" />
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
import { RouterLink, useRoute, useRouter } from 'vue-router';
import type { INote } from '../types/INote';

// store
import { useNotesStore } from '../stores/notesStore';

// components
import BaseModal from '../components/BaseModal.vue';
import BasePreloader from '../components/BasePreloader.vue';
import BaseButton from '../components/BaseButton.vue';

const notesStore = useNotesStore();
const notes = computed(() => notesStore.notes);
const isFetching = computed(() => notesStore.isFetching);
const noteId = ref<number | null>(null);

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

/**
 * format note title to url-friendly format
 * @param {string} title 
 */
const formatNoteTitle = (title: string) => {
    return title.trim().replace(/\s+/g, '-');
};

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
let openModal = (newModalState): void => {
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
h1 {
    margin-bottom: 20px;
}

button {
    margin-right: 5px;
    cursor: pointer;
}

.header-page {
    &__add {
        display:inline-block ;
        width: 100%;
        text-align: end;
        color: #2B7A78;
        font-weight: bold;
        font-style: italic;
        cursor: pointer;
    }
}

.table-notes {
    margin-top: 10px;
    width: 100%;
    border-collapse: collapse;

    &__header-cell,
    &__body-cell {
        border: 1px solid #ddd;
        padding: 8px;
    }

    &__header {
    background-color: #f2f2f2;
    }

    &__body-row {
        &:hover {
            background-color: rgba(235, 252, 246, 0.5);
        }

        &.completed {
           background-color: #d9fff2;

            &:hover{
                background-color: rgba(217, 255, 242, 0.6)
            }
        }
    }

.cell-1 {
    width: 5%; 
}

.cell-2 {
    width: 45%; 
}

.cell-3 {
    width: 20%; 
}

.cell-4 {
    width: 30%; 
}

}

</style>
