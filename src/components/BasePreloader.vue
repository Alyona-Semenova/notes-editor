<template>
    <div class="loader-wrapper">
        <div class="loader">
        </div>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: "BasePreloader",
})
</script>

<style lang="scss" scoped>
.loader-wrapper {
    position: absolute;
    top: 0;
    left: 0;

    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.15);

    .loader {
        height: 50px;
        width: 50px;
        margin: 40vh auto;
        border: 5px solid rgba(43, 122, 120, 0.45);
        border-top: 5px solid rgb(43, 122, 120);
        border-radius: 50%;
        animation: spin 1s infinite linear;
    }
}

// animation
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>