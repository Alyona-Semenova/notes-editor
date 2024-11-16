import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getNotes, deleteNote } from '../services/api.service'; 
import type { INote } from '../types/INote';

export const useNotesStore = defineStore('notes', () => {
    const notes = ref<INote[]>([]);

    const fetchNotes = async () => {
        try {
            notes.value = await getNotes();
        } catch (error) {
            console.error('Error receiving notes:', error);
        }
    };

    const removeNote = async (id: number) => {
        try {
            await deleteNote(id);
            notes.value = notes.value.filter(note => note.id !== id);
        } catch (error) {
            console.error(`Error deleting note id: ${id}:`, error);
        }
    }

    return { notes, fetchNotes, removeNote };
});
