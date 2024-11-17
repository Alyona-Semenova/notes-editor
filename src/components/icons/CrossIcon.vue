<script setup lang="ts">

import IconWrapper from "@/components/icons/IconWrapper.vue"

defineOptions({
    name: "CrossIcon"
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
            <path
                d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
    </IconWrapper>
</template>