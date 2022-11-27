<template>
  <div>
    <ErrorBoundary>
      <LayoutComponent><router-view /></LayoutComponent
    ></ErrorBoundary>
  </div>
</template>
<script setup>
import LayoutComponent from "./layouts/LayoutComponent.vue";
import ErrorBoundary from "./layouts/ErrorBoundary.vue";
</script>
