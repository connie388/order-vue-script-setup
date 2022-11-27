<template>
  <div>
    <slot
      v-if="err"
      name="error"
      v-bind:err="err"
      v-bind:vm="vm"
      v-bind:info="info"
      >Something went wrong</slot
    >
    <slot v-else></slot>
  </div>
</template>

<script setup>
import { ref } from "vue";
// const props = defineProps({
//   stopPropagation: Boolean,
// });

let err = ref(false);
let vm = ref(null);
let info = ref(null);

// function errorCaptured(err, vm, info) {
//   err.value = err;
//   vm.value = vm;
//   info.value = info;
//   return !props.stopPropagation;
// }
</script>

<style lang="scss" scoped></style>
