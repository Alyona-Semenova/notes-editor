import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getNotes, deleteNote } from '../services/api.service'; 
import type { INote } from '../types/INote';

export const useNotesStore = defineStore('notes', () => {
    const notes = ref<INote[]>([]);
    const isFetching = ref(false);

    const fetchNotes = async () => {
        isFetching.value = true;
        try {
            notes.value = await getNotes();
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

    return { 
        notes, 
        isFetching,
        fetchNotes, 
        removeNote,  
    };
});
