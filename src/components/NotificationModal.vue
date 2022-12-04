<template>
  <BaseModal
    :showing="props.show"
    modalContainerClass="modal-notify-container"
    modalContentClass="modal-notify-content"
    :closeButtonEnable="true"
    @close="close"
  >
    <template v-slot:body>
      <p>{{ props.msg }}</p>
    </template>
  </BaseModal>
</template>
<script setup>
import BaseModal from "../layouts/BaseModal.vue";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
  },
  msg: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["close"]);

function close() {
  emit("close");
}
</script>
