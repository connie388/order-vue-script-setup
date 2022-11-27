<template>
  <label v-if="props.label" :for="props.id" :class="props.labelClass">
    {{ props.label }}
  </label>
  <textarea
    :id="props.id"
    :value="props.modelValue"
    @input="updateInput"
    :class="props.className"
    :rows="props.row"
  />
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  labelClass: {
    type: String,
    default: "field-label",
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
  className: {
    type: String,
    default: "field-input",
  },
  row: {
    type: Number,
    default: 4,
  },
});

function updateInput(event) {
  emit("update:modelValue", event.target.value);
}
</script>
