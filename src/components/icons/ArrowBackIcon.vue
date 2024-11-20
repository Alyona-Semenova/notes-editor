<script setup lang="ts">
import IconWrapper from "@/components/icons/IconWrapper.vue"

defineOptions({
    name: "ArrowBackIcon"
});

const props = defineProps({
    color: {
        type: String
    },
    width: {
        type: String,
        required: false,
    },
    height: {
        type: String,
        required: false,
    }
});
</script>

<template>
    <IconWrapper :color="color" :width="width" :height="height">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
        </svg>
    </IconWrapper>
</template>