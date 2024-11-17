<template>
    <section class="note-info-view">
        <div class="arrow-back-icon">
            <ArrowBackIcon @click="$router.push('/')" />
        </div>

        <header class="header-page" v-if="note">
            <h1 class="header-page__title">{{note.title}}</h1>
        </header>

        <main>
            <div class="note-info-view__content" v-if="note">
                <p class="note-info-view__status">
                    Статус: {{ note.completed ? 'Выполнена' : 'Не выполнена' }}
                </p>
            </div>
            <div v-else>
                <p>Заметка не найдена.</p>
            </div>
        </main>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useNotesStore } from '../stores/notesStore';

//components
import ArrowBackIcon from '@/components/icons/ArrowBackIcon.vue';

const route = useRoute();
const notesStore = useNotesStore();
const noteId = window.history.state.id; 

const note = computed(() => {
    return notesStore.notes.find(note => note.id === Number(noteId));
});
</script>
