<template>
  <Transition name="fade">
    <div v-if="props.showing" :class="props.modalContainerClass">
      <div :class="props.modalContentClass">
        <header
          class="px-4 py-6 flex justify-between items-center border-b-2 border-white"
          id="modalTitle"
        >
          <slot name="header"></slot>
          <i
            class="fa-solid fa-xmark w-7 p-2 bg-gray-300 rounded-full"
            @click="close"
          ></i>
        </header>

        <main class="px-4 py-6" id="modalDescription">
          <slot name="body"></slot>
        </main>

        <footer class="px-4 py-6 border-t-2 border-white">
          <slot name="footer"></slot>
          <div v-if="closeButtonEnable">
            <BaseButton @click.prevent="close" label="Close" />
          </div>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
const emit = defineEmits(["close"]);
const props = defineProps({
  modalContainerClass: {
    type: String,
    default:
      "fixed inset-0 w-full h-screen flex items-center justify-center bg-[#000000da]",
  },
  modalContentClass: {
    type: String,
    default:
      "overflow-auto rounded-3xl bg-white flex flex-col justify-between w-4/6 h-5/6",
  },
  showing: {
    required: true,
    type: Boolean,
  },
  closeButtonEnable: {
    required: false,
    type: Boolean,
    default: false,
  },
});
function close() {
  emit("close");
}
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
