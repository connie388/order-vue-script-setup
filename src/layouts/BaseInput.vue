<template>
  <label v-if="props.label" :for="id" :class="props.labelClass">
    {{ label }}
  </label>
  <input
    :id="props.id"
    :type="props.type"
    :value="props.modelValue"
    @input="updateInput"
    :class="inputClass"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :step="props.step"
  />
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  step: {
    type: Number,
  },
  labelClass: {
    type: String,
    default: "field-label",
  },
  id: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  className: {
    type: String,
    default: "field-input",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "",
  },
});
let inputClass = ref("field-input");
watch(props, () => {
  if (props.disabled == true) inputClass.value = "field";
  else if (props.className) inputClass.value = props.className;
  else inputClass.value = "field-input";
});

function updateInput(event) {
  emit("update:modelValue", event.target.value);
}
</script>
