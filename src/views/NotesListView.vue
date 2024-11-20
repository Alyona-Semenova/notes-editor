<template>
    <section class="notes-list-view">
        <BaseHeaderPage :headerPageTitle="'Список заметок'" />
        <RouterLink to="/add" class="notes-list-view__add-note"> + Добавить заметку</RouterLink>

        <BasePreloader v-if="isFetching" />

        <table class="table-notes">
            <TableHeader 
                :toggleFilter="toggleFilter" 
                :isCompletedFilter="isCompletedFilter"
                @update:completedFilter="value => isCompletedFilter = value" 
            />
            <tbody class="table-notes__body">
                <TableRow v-for="(note, index) in filteredNotes" 
                    :key="note.id" :note="note" 
                    :index="index"
                    :confirmEdit="confirmEdit" 
                    :confirmDelete="confirmDelete" 
                />
            </tbody>
        </table>
    </section>

    <BaseModal v-if="isModalOpen" 
        :primaryActionText="modalState.modalPrimaryActionText"
        :secondaryActionText="modalState.modalSecondaryActionText" 
        :modalTitle="modalState.modalTitle"
        @primaryAction="modalState.modalPrimaryActionHandler" 
        @secondaryAction="modalState.modalSecondaryActionHandler"
        @close="modalState.closeModal"
    >

        <BaseInput v-if="!modalState.readonly"
            inputId="note-title"
            v-model="modalState.modalText" 
            :validations="validationsArray" 
            @isAllValid="setValidationsPassedValue" 
        />

        <p v-if="modalState.readonly" class="modal-text"> {{ modalState.modalText }} </p>

    </BaseModal>

</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
// types
import type { INote, IModalState } from '../types/index';
import type { IValidationSetting } from '../types/ValidationTypes';
import { ValidationTypes, createValidator } from '../types/ValidationTypes';
// store
import { useNotesStore } from '../stores/notesStore';
// components
import BaseModal from '../components/BaseModal.vue';
import BaseInput from '../components/BaseInput.vue';
import BasePreloader from '../components/BasePreloader.vue';
import TableHeader from '../components/table/TableHeader.vue';
import TableRow from '../components/table/TableRow.vue';
import BaseHeaderPage from '../components/BaseHeaderPage.vue';

let validationsArray = reactive<IValidationSetting[]>([
    {
        title: ValidationTypes.Length,
        settings: createValidator(ValidationTypes.Length, 3, 50),
    },
]);

let isAllValidationsPassed = ref(false);

const notesStore = useNotesStore();
const notes = computed(() => notesStore.notes);
const isFetching = computed(() => notesStore.isFetching);
const noteId = ref<number>(0);
const route = useRoute();
const router = useRouter();
const isCompletedFilter = computed(() => route.query.completed === 'true');
let isModalOpen = ref<boolean>(false);

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

const filteredNotes = computed<INote[]>(() => {
    if (isCompletedFilter.value) {
        return notes.value.filter((note) => note.completed);
    }
    return notes.value;
});

const toggleFilter = () => {
    const newFilterState: boolean = !isCompletedFilter.value;
    notesStore.setCompletedFilter(newFilterState);
    router.push({ query: { completed: String(newFilterState) } });
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
    noteId.value = 0;
};

const confirmEdit = (note: INote): void => {
    if (note.id !== undefined) {
        noteId.value = note.id;
    } else {
        console.error('noteId is undefined');
    }

    let newModalState = {
        readonly: false,
        modalTitle: 'Редактировать',
        modalText: note.title,
        modalPrimaryActionText: 'Сохранить',
        modalSecondaryActionText: 'Отмена',
        modalPrimaryActionHandler: () => handleEditNote(modalState.modalText),
        modalSecondaryActionHandler: () => closeModal(),
        closeModal: () => closeModal(),
    }

    openModal(newModalState);
};

const setValidationsPassedValue = (value: boolean) => {
    isAllValidationsPassed.value = value;
}

const handleEditNote = (newNoteTitle: string): void => {
    if (isAllValidationsPassed.value === true) {
        notesStore.editNote(noteId.value, newNoteTitle);
        closeModal();
        noteId.value = 0;
    }
};

/**
 * open modal window
 * @param {} newModalState 
 */
let openModal = (newModalState: IModalState): void => {
    modalState = newModalState;
    changeActiveModal(true);
};

const closeModal = (): void => {
    modalState = {
        readonly: true,
        modalTitle: '',
        modalText: '',
        modalPrimaryActionText: '',
        modalSecondaryActionText: '',
        modalPrimaryActionHandler: () => { },
        modalSecondaryActionHandler: () => { },
        closeModal: () => { },
    };

    changeActiveModal(false);
}

const changeActiveModal = (state?: boolean) => {
    isModalOpen.value = state ? state : !isModalOpen.value;
};

</script>

<style lang="scss" scoped>
.table-notes {
    margin-top: 10px;
    width: 100%;
    border-collapse: collapse;
}

.notes-list-view {
    &__add-note {
        display: inline-block;
        width: 100%;
        text-align: end;
        color: #2B7A78;
        font-weight: bold;
        font-style: italic;
        text-decoration: none;
    }
}

.modal-text {
    text-align: center;
}
</style>
