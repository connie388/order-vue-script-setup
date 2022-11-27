<template>
  <button :id="props.id" :class="props.className" :disabled="props.disabled">
    {{ props.label }}
    <slot />
  </button>
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
  className: {
    type: String,
    default: "btn-primary mx-auto",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>
