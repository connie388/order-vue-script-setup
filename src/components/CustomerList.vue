<template>
  <div class="flex flex-wrap -mx-3 mb-2">
    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <BaseInput
        id="customerNameLike"
        v-model="searchCustomerName"
        placeholder="Customer Name Like"
      />
    </div>
    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <BaseButton @click="retrieveCustomersByName" label="Search Customers" />
    </div>
    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <BaseButton
        className="btn-green"
        @click="visibleCustomerAdd = true"
        label="+Add Customer"
      />
    </div>
  </div>
  <div class="overflow-auto">
    <BaseViewTable
      :fields="customerFields"
      :dataList="customers"
      :viewEnable="false"
      @editItem="editCustomer"
      @deleteItem="deleteCustomer"
    />
  </div>

  <BaseModal :showing="visibleCustomerAdd" @close="visibleCustomerAdd = false">
    <template v-slot:header
      ><h1 class="text-xl font-bold text-center">New Customer</h1></template
    >

    <template v-slot:body>
      <CustomerFormEdit @onsubmit="addCustomerData" />
    </template>
  </BaseModal>

  <BaseModal
    :showing="visibleCustomerView"
    @close="visibleCustomerView = false"
  >
    <template v-slot:header
      ><h1 class="text-xl font-bold text-center">
        Customer Information
      </h1></template
    >

    <template v-slot:body>
      <CustomerFormEdit
        :customer="selectedCustomer"
        @onsubmit="updateCustomerData"
      />
    </template>
  </BaseModal>

  <BaseModal
    :showing="visibleMsgView"
    modalContainerClass="modal-notify-container"
    modalContentClass="modal-notify-content"
    @close="visibleMsgView = false"
  >
    <template v-slot:body>
      <p>{{ msg }}</p>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseButton from "../layouts/BaseButton.vue";
import BaseInput from "../layouts/BaseInput.vue";
import BaseModal from "../layouts/BaseModal.vue";
import BaseViewTable from "../layouts/BaseViewTable.vue";
import CustomerFormEdit from "./CustomerFormEdit.vue";

import { createEndpoint, ENDPOINTS } from "@/services/CreateEndPoint";
import { ref } from "vue";

let visibleCustomerView = ref(false);
let visibleCustomerAdd = ref(false);
let visibleMsgView = ref(false);
let selectedCustomer = ref(null);
let searchCustomerName = ref("");
let customers = ref([]);
let msg = ref("");
let customerFields = ref([
  { column: "customerNumber", header: "Customer Number", type: "number" },
  { column: "customerName", header: "Customer Name", type: "text" },
  {
    column: "contactFirstName",
    header: "Contact First Name",
    type: "text",
  },
  {
    column: "contactLastName",
    header: "Contact Last Name",
    type: "text",
  },
  { column: "phone", header: "Phone", type: "text" },
  { column: "creditLimit", header: "Credit Limit", type: "number" },
]);

function editCustomer(item) {
  selectedCustomer.value = item;
  visibleCustomerView.value = true;
}

function retrieveCustomersByName() {
  customers.value = [];
  createEndpoint(ENDPOINTS.CUSTOMER)
    .fetchByName(searchCustomerName.value)
    .then((res) => {
      customers.value = res.data;
      console.log(customers.value);
      if (res.data.length === 0) {
        msg.value = "No customers found.";
        visibleMsgView.value = true;
      }
    })
    .catch((err) => {
      console.log(err);
      msg.value = "Something wrong happened";
      visibleMsgView.value = true;
    });
}

function deleteCustomer(item) {
  createEndpoint(ENDPOINTS.CUSTOMER)
    .delete(item.customerNumber)
    .then((res) => {
      console.log(res.data);
      msg.value = "Customer is deleted successfully!";
      customers.value = customers.value.filter(function (obj) {
        return obj.customerNumber !== item.customerNumber;
      });
    })
    .catch((err) => {
      console.log(err);
      msg.value = "Something wrong happened";
    });
  visibleMsgView.value = true;
}

function updateCustomerData(form) {
  var data = {
    customerNumber: form.customerNumber,
    customerName: form.customerName,
    contactLastName: form.contactLastName,
    contactFirstName: form.contactFirstName,
    phone: form.phone,
    addressLine1: form.addressLine1,
    addressLine2: form.addressLine2,
    city: form.city,
    state: form.state,
    country: form.country,
    postalCode: form.postalCode,
    salesRepEmployeeNumber: form.salesRepEmployeeNumber,
    creditLimit: form.creditLimit,
  };
  createEndpoint(ENDPOINTS.CUSTOMER)
    .update(form.customerNumber, data)
    .then((res) => {
      console.log(res.data);
      msg.value = "Customer is updated successfully!";
      retrieveCustomersByName();
    })
    .catch((err) => {
      console.log(err);
      msg.value = "Something wrong happened";
    });
  visibleMsgView.value = true;
}

function addCustomerData(form) {
  var data = {
    customerNumber: form.customerNumber,
    customerName: form.customerName,
    contactLastName: form.contactLastName,
    contactFirstName: form.contactFirstName,
    phone: form.phone,
    addressLine1: form.addressLine1,
    addressLine2: form.addressLine2,
    city: form.city,
    state: form.state,
    country: form.country,
    postalCode: form.postalCode,
    salesRepEmployeeNumber: form.salesRepEmployeeNumber,
    creditLimit: form.creditLimit,
  };

  createEndpoint(ENDPOINTS.CUSTOMER)
    .create(data)
    .then((res) => {
      console.log(res.data.customerNumber);
      msg.value = "Customer is added successfully!";
      retrieveCustomersByName();
    })
    .catch((err) => {
      console.log(err);
      msg.value = "Something wrong happened";
    });
  visibleMsgView.value = true;
}
</script>
