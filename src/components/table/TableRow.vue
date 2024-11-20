<template>
    <tr class="table-row" :class="{ 'completed': note.completed }">
        <td class="table-row__body-cell cell-1">{{ index + 1 }}</td>
        <td class="table-row__body-cell cell-2">
            <RouterLink :to="{ name: 'noteInfoView', state: { id: note.id }, params: { name: formatNoteTitle(note.title) } }">
                {{ note.title }}
            </RouterLink>
        </td>
        <td class="table-row__body-cell cell-3">
            <input type="checkbox" v-model="note.completed" />
        </td>
        <td class="table-row__body-cell cell-4">
            <BaseButton :buttonText="'Редактировать'" @goAction="() => confirmEdit(note)" />
            <BaseButton :buttonText="'Удалить'" @goAction="() => confirmDelete(note.id)" />
        </td>
    </tr>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { RouterLink } from 'vue-router';
//types
import type { INote } from '@/types';

//components
import BaseButton from '@/components/BaseButton.vue';

/**
 * format note title to url-friendly format
 * @param {string} title 
 */
 const formatNoteTitle = (title: string) => {
    return title.trim().replace(/\s+/g, '-');
};

const props = defineProps<{
    note: INote;
    index: number;
    confirmEdit: (note: INote) => void;
    confirmDelete: (id: number) => void;
}>();

</script>


<style lang="scss" scoped>
.table-row {
    &__body-cell {
        border: 1px solid #ddd;
        padding: 8px;   
    }

    &:hover {
        background-color: rgba(235, 252, 246, 0.5);
    }

    &.completed {
       background-color: #d9fff2;

        &:hover{
            background-color: rgba(217, 255, 242, 0.6)
        }
    }

    button {
        margin-right: 10px;
        cursor: pointer;
    }
}

.cell-1 {
    width: 5%; 
    text-align: center;
}

.cell-2 {
    width: 40%; 
}

.cell-3 {
    width: 25%; 
    text-align: center;
}

.cell-4 {
    width: 30%; 
    text-align: center;
}


</style>
