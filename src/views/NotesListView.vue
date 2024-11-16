<template>
    <div>
        <h1>Заметки</h1>
        <ul>
            <li v-for="note in notes" :key="note.id">{{ note.title }}</li>
        </ul>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, computed } from 'vue';
    import { useNotesStore } from '../stores/notesStore';

    const notesStore = useNotesStore(); 
    const notes = computed(() => notesStore.notes);

    /**
     * get notes from server on component mount
     */
    onMounted(() => {
        notesStore.fetchNotes(); 
    });
</script>
