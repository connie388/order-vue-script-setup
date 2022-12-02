<template>
  <form @submit.prevent class="w-full max-w-lg">
    <BaseErrors :errors="errors" />
    <div class="flex flex-wrap -mx-3 mb-6">
      <BaseInput
        type="hidden"
        id="customerNumber"
        v-model="form.customerNumber"
      />
      <div class="w-full px-3">
        <BaseInput
          id="customerName"
          label="Customer Name"
          v-model="form.customerName"
        />
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <BaseInput
          id="contactLastName"
          label="Contact Last Name"
          v-model="form.contactLastName"
        />
      </div>
      <div class="w-full md:w-1/2 px-3">
        <BaseInput
          id="contactFirstName"
          label="Contact First Name"
          v-model="form.contactFirstName"
        />
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3">
        <BaseInput id="phone" label="Phone" v-model="form.phone" />
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3">
        <BaseTextArea
          id="addressLine1"
          label="Address"
          v-model="form.addressLine1"
        />
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3">
        <BaseTextArea
          id="addressLine2"
          label="Address"
          v-model="form.addressLine2"
        />
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-2">
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <BaseInput id="city" label="City" v-model="form.city" />
      </div>
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <BaseInput id="state" label="State" v-model="form.state" />
      </div>

      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <BaseInput id="country" label="Country" v-model="form.country" />
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-2">
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <BaseInput
          id="postalCode"
          label="Postal Code"
          v-model="form.postalCode"
        />
      </div>
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <BaseInput
          id="salesRepEmployeeNumber"
          label="Sales Rep."
          v-model="form.salesRepEmployeeNumber"
        />
      </div>

      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <BaseInput
          id="creditLimit"
          label="Credit Limit"
          v-model="form.creditLimit"
        />
      </div>
    </div>
    <BaseButton @click="onsubmit" label="Submit" />
  </form>
</template>
<script setup>
import BaseInput from "../layouts/BaseInput.vue";
import BaseButton from "../layouts/BaseButton.vue";
import BaseTextArea from "../layouts/BaseTextArea.vue";
import BaseErrors from "../layouts/BaseErrors.vue";
import { defineProps, defineEmits, ref, onMounted } from "vue";

const props = defineProps({
  customer: Object,
  edit: String,
});

const emit = defineEmits(["onsubmit"]);

let form = ref({
  customerNumber: null,
  customerName: "",
  contactLastName: "",
  contactFirstName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  salesRepEmployeeNumber: null,
  creditLimit: null,
});
let errors = ref([]);

onMounted(async () => {
  if (props.customer) {
    form.value.customerNumber = props.customer.customerNumber;
    form.value.customerName = props.customer.customerName;
    form.value.contactLastName = props.customer.contactLastName;
    form.value.contactFirstName = props.customer.contactFirstName;
    form.value.phone = props.customer.phone;
    form.value.addressLine1 = props.customer.addressLine1;
    form.value.addressLine2 = props.customer.addressLine2;
    form.value.city = props.customer.city;
    form.value.state = props.customer.state;
    form.value.country = props.customer.country;
    form.value.postalCode = props.customer.postalCode;
    form.value.salesRepEmployeeNumber = props.customer.salesRepEmployeeNumber;
    form.value.creditLimit = props.customer.creditLimit;
  }
});

function onsubmit(e) {
  errors.value = [];
  if (!form.value.customerName) {
    errors.value.push("Customer Name required.");
  }
  if (!form.value.contactLastName) {
    errors.value.push("Contact Last Name required.");
  }
  if (!form.value.contactLastName) {
    errors.value.push("Contact Last Name required.");
  }
  if (!form.value.phone) {
    errors.value.push("Phone required.");
  }
  if (!form.value.addressLine1) {
    errors.value.push("Address required.");
  }
  if (!form.value.city) {
    errors.value.push("City required.");
  }
  if (!form.value.country) {
    errors.value.push("Country required.");
  }
  if (form.value.postalCode?.length > 15) {
    errors.value.push(
      "Postal Code should be less than or equal to 15 characters"
    );
  }

  if (errors.value.length) {
    return;
  }

  e.preventDefault();
  emit("onsubmit", form.value);
}
</script>
