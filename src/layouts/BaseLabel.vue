<template>
  <label v-if="props.label" :for="props.id" :class="props.className">
    {{ props.label }}
  </label>
  <label v-if="info" :class="props.infoClassName">
    {{ props.info }}
  </label>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  info: {
    type: String,
    default: "",
  },
  className: {
    type: String,
    default: "field-label",
  },
  infoClassName: {
    type: String,
    default: "field",
  },
});
</script>
