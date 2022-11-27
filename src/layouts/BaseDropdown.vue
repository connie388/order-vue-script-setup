<template>
  <div>
    <label v-if="label" :for="id" :class="labelClass">
      {{ label }}
    </label>
    <select :class="className" v-model="selectedOption" @change="onchange">
      <option :value="selectedOption?.key || ''">
        {{ selectedOption?.text || "Please select one." }}
      </option>
      <option v-for="option in options" :key="option" :value="option">
        {{ option?.text }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";
const props = defineProps({
  initialOption: {
    type: Object,
    default: null,
  },
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
  options: {
    type: Array,
    required: true,
  },
  className: {
    type: String,
    default: "field-input",
  },
});

const emit = defineEmits(["selected"]);

let selectedOption = ref("");

watch(props, () => {
  selectedOption.value = props.initialOption;
});

function onchange() {
  if (selectedOption.value) emit("selected", selectedOption.value);
}
</script>
