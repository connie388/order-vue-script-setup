<template>
  <form @submit.prevent class="w-full max-w-lg">
    <BaseErrors :errors="errors" />
    <div v-if="edit">
      <BaseLabel label="Customer Name" :info="customerName" />
      <BaseLabel label="Check Number" :info="form.checkNumber" />
    </div>
    <div v-else>
      <BaseDropdown
        :options="customerList"
        label="Customer Name"
        @selected="setCustomerNumber"
      />

      <BaseInput
        id="checkNumber"
        label="Check Number"
        v-model="form.checkNumber"
      />
    </div>
    <BaseInput
      type="date"
      id="paymentDate"
      label="Payment Date"
      v-model="form.paymentDate"
    />

    <BaseInput id="amount" type="number" label="Amount" v-model="form.amount" />

    <BaseButton @click="onsubmit" label="Submit" class="mr-2" />
    <BaseButton @click="onclose" label="Close" />
  </form>
</template>
<script setup>
import BaseInput from "../layouts/BaseInput.vue";
import BaseLabel from "../layouts/BaseLabel.vue";
import BaseButton from "../layouts/BaseButton.vue";
import BaseErrors from "../layouts/BaseErrors.vue";
import BaseDropdown from "../layouts/BaseDropdown.vue";
import { defineProps, defineEmits, ref, onMounted } from "vue";

const props = defineProps({
  customerName: {
    type: String,
  },
  payment: {
    type: Object,
    default: null,
  },
  edit: {
    type: Boolean,
  },
  customerList: {
    type: Array,
  },
});

const emit = defineEmits(["onSubmit", "onClose"]);

let form = ref({
  customerNumber: null,
  checkNumber: "",
  paymentDate: null,
  amount: null,
});
let errors = ref([]);

onMounted(async () => {
  if (props.payment) {
    form.value.customerNumber = props.payment.customerNumber;
    form.value.checkNumber = props.payment.checkNumber;
    form.value.paymentDate = props.payment.paymentDate;
    form.value.amount = props.payment.amount;
  }
});

function setCustomerNumber(option) {
  form.value.customerNumber = option.key;
}

function onsubmit(e) {
  errors.value = [];
  if (!form.value.customerNumber) {
    errors.value.push("Customer  required.");
  }
  if (!form.value.checkNumber) {
    errors.value.push("Check Number required.");
  }
  if (!form.value.paymentDate) {
    errors.value.push("Payment Date required.");
  }
  if (!form.value.amount || form.value.amount <= 0) {
    errors.value.push("Payment Amount required.");
  }

  if (errors.value.length) {
    return;
  }

  e.preventDefault();
  emit("onSubmit", form.value);
}

function onclose() {
  emit("onClose");
}
</script>
