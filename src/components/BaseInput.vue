<template>
    <div class="note-input-field">
        <label v-if="needLabel" :for="inputId">{{ label }}: </label>
        <input
            type="text"
            v-model="inputValue"
            :id="inputId"
            :class="{'input-error': hasError, 'input-with-label': needLabel }"
            required
        />
        <div v-if="hasError" class="error-message">{{ errorMessage }}</div>
    </div>
</template>

<script setup lang="ts">

import { ref, toRefs, watch  } from 'vue';

const props = defineProps<{
    needLabel?: boolean; 
    label?: string; 
    inputId: string; 
    modelValue: string; 
    hasError: boolean; 
    errorMessage: string; 
}>()

const { 
    needLabel = false, 
    label = string, 
    inputId = string, 
    modelValue = '', 
    hasError = false, 
    errorMessage = '', 
} = props;

const emit = defineEmits(['update:modelValue']);

const inputValue = ref(props.modelValue);

watch(inputValue, (newValue) => {
    emit('update:modelValue', newValue);
});

</script>

<style lang="scss" scoped>
.note-input-field{
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;

    input {
        width: 100%;

        &.input-with-label {
            width: 50%;
        }
    }
}

.input-error {
    border: 1px solid red;
}

.error-message {
    color: red; 
    font-size: 12px;
}
</style>
