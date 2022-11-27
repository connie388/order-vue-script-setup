<template>
  <form @submit.prevent class="w-full">
    <BaseErrors :errors="errors" />

    <div class="flex flex-wrap -mx-3 mb-2">
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <BaseLabel
          id="orderNumber"
          label="Order Number"
          :info="props.orderNumber"
        />
      </div>
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <BaseDropdown
          :options="customerList"
          label="Customer Name"
          @selected="setCustomerNumber"
        />
      </div>

      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <BaseLabel id="status" label="Status" :info="form.status" />
      </div>

      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <BaseInput
          id="orderDate"
          type="date"
          label="Order Date"
          v-model="form.orderDate"
        />
      </div>
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <BaseInput
          type="date"
          id="requiredDate"
          label="Required Date"
          v-model="form.requiredDate"
        />
      </div>
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <BaseInput
          type="date"
          id="shippedDate"
          label="Shipped Date"
          v-model="form.shippedDate"
        />
      </div>

      <div class="w-full px-3">
        <BaseTextArea id="comments" label="Comments" v-model="form.comments" />
      </div>
    </div>

    <hr />
    <div class="w-full">
      <div class="overflow-auto">
        <BaseEditableTable
          ref="childRef"
          :dataList="[]"
          :fields="orderDetailFields"
          :filterEnable="false"
          :viewEnable="false"
          :editEnable="false"
          :addRow="true"
        />
        <BaseButton @click="onsubmit" label="Submit" />
      </div>
    </div>
  </form>

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
import BaseErrors from "../layouts/BaseErrors.vue";
import BaseModal from "../layouts/BaseModal.vue";
import BaseTextArea from "../layouts/BaseTextArea.vue";
import BaseButton from "../layouts/BaseButton.vue";
import BaseLabel from "../layouts/BaseLabel.vue";
import BaseDropdown from "../layouts/BaseDropdown.vue";
import BaseEditableTable from "../layouts/BaseEditableTable.vue";
import BaseInput from "../layouts/BaseInput.vue";
import { createEndpoint, ENDPOINTS } from "@/services/CreateEndPoint";
import { ORDER_STATUS } from "@/components/OrderStatus";
import { defineProps, defineEmits, ref, onMounted } from "vue";

const props = defineProps({
  orderNumber: String,
});

const emit = defineEmits(["onSubmit"]);

let customerList = ref([]);
let form = ref({
  customerName: "",
  customerNumber: null,
  orderNumber: null,
  orderDate: null,
  requiredDate: null,
  shippedDate: null,
  status: ORDER_STATUS.IN_PROCESS,
  comments: "",
  orderDetailList: null,
});
let errors = ref([]);

let visibleMsgView = ref(false);
let msg = ref("");
let orderDetailFields = ref([
  { column: "productCode", header: "Product Code", type: "text" },
  { column: "quantityOrdered", header: "Quantity", type: "number" },
  { column: "priceEach", header: "Price Each", type: "number" },
  {
    column: "orderLineNumber",
    header: "Order Line Number",
    type: "number",
  },
]);

const childRef = ref(null);
const getTableItems = () => {
  return childRef.value?.tableItems;
};

onMounted(async () => {
  retrieveCustomerList();
});

function setCustomerNumber(option) {
  form.value.customerNumber = option.key;
}

function retrieveCustomerList() {
  customerList.value = [];
  createEndpoint(ENDPOINTS.CUSTOMER)
    .fetchAll()
    .then((res) => {
      for (let record in res.data) {
        var temp = {
          key: res.data[record].customerNumber,
          text: res.data[record].customerName,
        };
        customerList.value.push(temp);
      }
    })
    .catch((err) => console.log(err));
}

function onsubmit(e) {
  errors.value = [];
  if (!form.value.orderDate) {
    errors.value.push("Order Date required.");
  }
  if (!form.value.customerNumber) {
    errors.value.push("Customer required.");
  }
  if (!form.value.status) {
    errors.value.push("Status required.");
  }
  if (!form.value.requiredDate) {
    errors.value.push("Required Date required.");
  }

  if (errors.value.length) {
    return;
  }

  form.value.orderDetailList = getTableItems();
  e.preventDefault();
  emit("onSubmit", form.value);
}
</script>
