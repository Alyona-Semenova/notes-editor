<template>
    <thead class="table-header">
        <tr class="table-header__row">
            <th class="table-header__header-cell cell-1">№</th>
            <th class="table-header__header-cell cell-2">Название</th>
            <th class="table-header__header-cell cell-3" @click="toggleFilter">
                <span>Отметка о выполнении</span>
                <input type="checkbox" :checked="isCompletedFilter" @change="updateFilter($event.target.checked)">
            </th>
            <th class="table-header__header-cell cell-4">Действия</th>
        </tr>
    </thead>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const emit = defineEmits(['update:completedFilter']);

const updateFilter = (value): void => {
    emit('update:completedFilter', value);
}

const props = defineProps<{
    toggleFilter: Function,
    isCompletedFilter: Boolean,
}>();

</script>


<style lang="scss" scoped >

.table-header {
    background-color: #f2f2f2;

    &__header-cell {
        border: 1px solid #ddd;
        padding: 8px;
        user-select: none;
        cursor: default;
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
    cursor: pointer;


    input[type="checkbox"] {
        margin-left: 5px;
    }
}

.cell-4 {
    width: 30%; 
    text-align: center;
}


}

</style>