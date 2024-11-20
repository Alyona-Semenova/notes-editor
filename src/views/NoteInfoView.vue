<template>
    <section class="note-info-view">
        <div class="arrow-back-icon">
            <ArrowBackIcon @click="$router.push('/')" />
        </div>

        <BaseHeaderPage v-if="note" :headerPageTitle="note.title" />

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
//stores
import { useNotesStore } from '../stores/notesStore';
//components
import ArrowBackIcon from '@/components/icons/ArrowBackIcon.vue';
import BaseHeaderPage from '@/components/BaseHeaderPage.vue';

const notesStore = useNotesStore();
const noteId = window.history.state.id;

const note = computed(() => {
    return notesStore.notes.find(note => note.id === Number(noteId));
});

</script>

<style lang="scss" scoped>
.note-info-view {
    cursor: default;
}

.arrow-back-icon {
    cursor: pointer;
}
</style>