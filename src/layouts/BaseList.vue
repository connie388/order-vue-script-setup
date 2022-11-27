<template>
  <ul>
    <li
      :class="{ active: index == this.currentIndex }"
      v-for="(option, index) in options || []"
      :key="index"
      @click="onclick(option, index)"
    >
      <p :class="className">{{ option.text }}</p>
    </li>
  </ul>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";
const emit = defineEmits(["onclick"]);
const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  className: {
    type: String,
    default: "field text-left",
  },
  resetIndex: {
    type: Boolean,
    default: true,
  },
});
let currentIndex = ref(-1);

function onclick(option, index) {
  currentIndex.value = index;
  emit("onclick", option);
}

watch(props, () => {
  currentIndex.value = -1;
});
</script>
