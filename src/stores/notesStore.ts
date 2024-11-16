import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getNotes } from '../services/api.service'; 
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

    return { notes, fetchNotes };
});
