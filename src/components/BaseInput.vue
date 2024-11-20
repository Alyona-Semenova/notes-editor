<template>
    <div class="note-input-field">
        <label v-if="needLabel" :for="inputId">{{ label }}: </label>
        <input autocomplete="off" type="text" v-model="inputValue" :id="inputId"
            :class="{ 'input-error': hasError, 'input-with-label': needLabel }" required />

        <div v-if="hasError" class="error-messages">
            <p v-for="errorMessage in errorMessages" :key="errorMessage"> {{ errorMessage }}</p>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, watch, toRaw } from 'vue';
import { validationMap } from '../classes/Validation';

const props = defineProps<{
    needLabel?: boolean;
    label?: string;
    inputId: string;
    modelValue: string;
    hasError?: boolean;
    errorsText?: any[];
    validations: any[];
}>()

let {
    needLabel = false,
    label = '',
    inputId = '',
    modelValue = '',
    hasError = false,
    errorsText = [],
    validations = [],
} = props;

const emit = defineEmits(['update:modelValue', 'isAllValid']);
const inputValue = ref(props.modelValue);
let localValidationsArray = ref<any[]>(props.validations);
let errorMessages = ref<string[]>(errorsText);
let isErrorResult = ref<boolean>(false);

watch(inputValue, (newValue) => {
    emit('update:modelValue', newValue);
    validate();
});

const validate = () => {
    errorMessages.value = [];
    isErrorResult.value = false;

    for (let i = 0; i < localValidationsArray.value.length; i++) {
        const validationItem = toRaw(localValidationsArray.value[i]);
        let validation = new validationMap[validationItem.title](...Object.values(validationItem.settings));
        const check = validation.check(inputValue.value);
        const isValid = check.isValid;

        if (!isValid) {
            isErrorResult.value = true;
            errorMessages.value.push(check.errorMessage);
        }
    }

    if (isErrorResult.value === true) {
        hasError = true;
        emit('isAllValid', false)
    } else {
        hasError = false;
        emit('isAllValid', true)
    }
}
</script>

<style lang="scss" scoped>
.note-input-field {
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

.error-messages {
    color: red;
    font-size: 12px;

    &__message {
        margin-bottom: 5px;
    }
}
</style>
