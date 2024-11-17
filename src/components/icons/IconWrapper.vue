<template>
    <span
        role="img"
        aria-hidden="true"
        :style="config"
    >
      <slot></slot>
    </span>
  </template>
  
  <script setup lang="ts">
  import { computed } from "vue";

  defineOptions({
    name: 'IconWrapper',
  })

  const props = defineProps({
    color: String,
    width: {
      type: String,
      required: false,
    },
    height: {
      type: String,
      required: false,
    },
  })

  const config = computed(() => {
    return {
      color: props.color,
      width: props.width,
      height: props.height,
      display: 'inline-flex',
      fontSize: 'inherit',
    }
  })

  </script>
  