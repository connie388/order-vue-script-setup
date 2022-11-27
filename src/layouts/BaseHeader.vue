<template>
  <h4>
    {{ props.label }}
  </h4>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
});
</script>
