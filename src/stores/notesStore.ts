import { defineStore } from 'pinia';
import { ref, watch, computed } from 'vue';
import { getNotes, deleteNote, patchNote, postNote } from '../services/api.service';
import type { INote } from '../types/INote';

const SESSION_STORAGE_KEY = 'notesStore';
const FILTER_STORAGE_KEY = 'completedFilter';

const loadNotesFromSessionStorage = (): INote[] => {
    const notes = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return notes ? JSON.parse(notes) : [];
};

const loadFilterFromSessionStorage = (): boolean => {
    const filter = sessionStorage.getItem(FILTER_STORAGE_KEY);
    return filter === 'true';
};

export const useNotesStore = defineStore('notes', () => {
    const notes = ref<INote[]>(loadNotesFromSessionStorage());
    const isCompletedFilter = ref(loadFilterFromSessionStorage());
    const isFetching = ref(false);

    const setCompletedFilter = (value: boolean) => {
        isCompletedFilter.value = value;
        localStorage.setItem(FILTER_STORAGE_KEY, value.toString());
    };

    const filteredNotes = computed(() => {
        if (isCompletedFilter.value) {
            return notes.value.filter(note => note.completed);
        }
        return notes.value;
    });

    watch(notes, (newNotes) => {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newNotes));
    }, { deep: true });

    const fetchNotes = async () => {
        if (notes.value.length > 0) {
            return;
        }

        isFetching.value = true;
        try {
            const fetchedNotes = await getNotes();
            notes.value = fetchedNotes.map(note => ({
                ...note,
                completed: false // default to false
            }));
        } catch (error) {
            console.error('Error receiving notes:', error);
        } finally {
            isFetching.value = false;
        }
    };

    const removeNote = async (id: number) => {
        isFetching.value = true;
        try {
            await deleteNote(id);
            notes.value = notes.value.filter(note => note.id !== id);
        } catch (error) {
            console.error(`Error deleting note id: ${id}:`, error);
        } finally {
            isFetching.value = false;
        }
    }

    const editNote = async (id: number, noteTitle: string) => {
        isFetching.value = true;
        try {
            await patchNote(id, noteTitle);
            const index = notes.value.findIndex(note => note.id === id);
            if (index !== -1) {
                notes.value[index].title = noteTitle;
            }
        } catch (error) {
            console.error(`Error editing note id: ${id}:`, error);
        } finally {
            isFetching.value = false;
        }
    }

    const addNote = async (note: INote) => {
        isFetching.value = true;
        try {
            let newNote = await postNote(note);
            notes.value.push(newNote);
        } catch (error) {
            console.error('Error adding note:', error);
        } finally {
            isFetching.value = false;
        }
    }

    return {
        notes,
        isFetching,
        fetchNotes,
        removeNote,
        editNote,
        addNote,
        setCompletedFilter,
        filteredNotes,
    };
});

