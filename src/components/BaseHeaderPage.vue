<template>
    <header class="header-page">
        <h1 class="header-page__title"> {{ headerPageTitle }}</h1>
    </header>
</template>

<script setup lang="ts"> 

defineOptions({
    name: 'BaseHeaderPage',
})

const props = defineProps<{
    headerPageTitle: string; 
}>();

</script>

<style lang="scss" scoped>
.header-page {
    margin-top: 20px;
    margin-bottom: 20px;
    cursor: default;
}
</style>