<template>
  <div>
    <form @submit.prevent class="w-full">
      <BaseErrors :errors="errors" />

      <div class="flex flex-wrap -mx-3 mb-2">
        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <BaseInput
            type="hidden"
            id="customerNumber"
            v-model="form.customerNumber"
          />

          <BaseInput
            id="customerName"
            :disabled="true"
            label="Customer Name"
            v-model="form.customerName"
          />
        </div>
        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <BaseInput
            id="orderNumber"
            :disabled="true"
            label="Order Number"
            v-model="form.orderNumber"
          />
        </div>
        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <BaseDropdown
            :initialOption="{ key: order.status, text: order.status }"
            id="status"
            :options="options"
            label="Status"
            @selected="setStatus"
          />
        </div>

        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <BaseInput
            id="orderDate"
            type="date"
            label="Order Date"
            :disabled="!editable"
            v-model="form.orderDate"
          />
        </div>
        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <BaseInput
            type="date"
            id="requiredDate"
            label="Required Date"
            :disabled="!editable"
            v-model="form.requiredDate"
          />
        </div>
        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <BaseInput
            type="date"
            id="shippedDate"
            label="Shipped Date"
            :disabled="!editable"
            v-model="form.shippedDate"
          />
        </div>

        <div class="w-full px-3">
          <BaseTextArea
            id="comments"
            label="Comments"
            v-model="form.comments"
          />
        </div>
      </div>

      <hr />
      <div class="w-full">
        <div class="overflow-auto">
          <div v-if="editable">
            <BaseEditableTable
              ref="childRef"
              :fields="orderDetailFields"
              :dataList="orderDetails"
              :filterEnable="false"
              :viewEnable="false"
              :editEnable="false"
              :addRow="true"
            />
            <BaseButton @click="submitEvent" label="Submit" class="mr-2" />
            <BaseButton @click="onclose" label="Close" />
          </div>
          <div v-else>
            <BaseViewTable
              :fields="orderDetailFields"
              :dataList="orderDetails"
              :viewEnable="false"
              :editEnable="false"
              :deleteEnable="false"
              :filterEnable="false"
            />
            <BaseButton @click="onclose" label="Close" />
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import BaseErrors from "../layouts/BaseErrors.vue";
import BaseTextArea from "../layouts/BaseTextArea.vue";
import BaseButton from "../layouts/BaseButton.vue";
import BaseDropdown from "../layouts/BaseDropdown.vue";
import BaseViewTable from "../layouts/BaseViewTable.vue";
import BaseEditableTable from "../layouts/BaseEditableTable.vue";
import BaseInput from "../layouts/BaseInput.vue";
import { createEndpoint, ENDPOINTS } from "@/services/CreateEndPoint";
import { ORDER_STATUS } from "@/components/OrderStatus";
import { defineProps, defineEmits, ref, onMounted } from "vue";

const props = defineProps({
  order: Object,
});

const emit = defineEmits(["onsubmit", "onClose"]);

let form = ref({
  customerName: "",
  customerNumber: null,
  orderNumber: null,
  orderDate: null,
  requiredDate: null,
  shippedDate: null,
  status: "",
  comments: "",
  orderDetailList: null,
});
let errors = ref([]);
let options = ref([]);
let orderDetails = ref([]);
let editable = ref(false);

const orderDetailFields = ref([
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
  if (props.order) {
    // watch the props to fetch the data again
    if (props.order.status === ORDER_STATUS.SHIPPED) {
      options.value = [
        { key: ORDER_STATUS.SHIPPED, text: ORDER_STATUS.SHIPPED },
        { key: ORDER_STATUS.CANCELLED, text: ORDER_STATUS.CANCELLED },
        { key: ORDER_STATUS.DISPUTED, text: ORDER_STATUS.DISPUTED },
      ];
    }
    if (props.order.status === ORDER_STATUS.IN_PROCESS) {
      options.value = [
        { key: ORDER_STATUS.IN_PROCESS, text: ORDER_STATUS.IN_PROCESS },
        { key: ORDER_STATUS.SHIPPED, text: ORDER_STATUS.SHIPPED },
        { key: ORDER_STATUS.CANCELLED, text: ORDER_STATUS.CANCELLED },
        { key: ORDER_STATUS.ON_HOLD, text: ORDER_STATUS.ON_HOLD },
      ];
    }
    if (props.order.status === ORDER_STATUS.ON_HOLD) {
      options.value = [
        { key: ORDER_STATUS.ON_HOLD, text: ORDER_STATUS.ON_HOLD },
        { key: ORDER_STATUS.IN_PROCESS, text: ORDER_STATUS.IN_PROCESS },
        { key: ORDER_STATUS.CANCELLED, text: ORDER_STATUS.CANCELLED },
      ];
    }
    if (props.order.status == ORDER_STATUS.CANCELLED) {
      options.value = [
        { key: ORDER_STATUS.CANCELLED, text: ORDER_STATUS.CANCELLED },
      ];
    }
    if (props.order.status == ORDER_STATUS.DISPUTED) {
      options.value = [
        { key: ORDER_STATUS.DISPUTED, text: ORDER_STATUS.DISPUTED },
        { key: ORDER_STATUS.RESOLVED, text: ORDER_STATUS.RESOLVED },
      ];
    }
    if (props.order.status == ORDER_STATUS.RESOLVED) {
      options.value = [
        { key: ORDER_STATUS.RESOLVED, text: ORDER_STATUS.RESOLVED },
        { key: ORDER_STATUS.DISPUTED, text: ORDER_STATUS.DISPUTED },
      ];
    }
    form.value.orderNumber = props.order.orderNumber;
    form.value.orderDate = props.order.orderDate;
    form.value.requiredDate = props.order.requiredDate;
    form.value.shippedDate = props.order.shippedDate;
    form.value.status = props.order.status;
    form.value.comments = props.order.comments;
    form.value.customerNumber = props.order.customerNumber;
    form.value.customerName = props.order.customerName;
    // console.log("name=" + this.order.customerName);
  }
  if (props.order.orderNumber) retrieveOrderDetail(props.order.orderNumber);

  if (props.order.status === ORDER_STATUS.IN_PROCESS) editable.value = true;
});

function setStatus(option) {
  form.value.status = option.key;
}

function retrieveOrderDetail(orderNumber) {
  orderDetails.value = [];
  createEndpoint(ENDPOINTS.ORDER)
    .fetchById(orderNumber)
    .then((res) => {
      orderDetails.value = res.data?.orderDetailList;
    })
    .catch((err) => console.log(err));
}
function submitEvent(e) {
  errors.value = [];
  if (!form.value.orderDate) {
    errors.value.push("Order Date required.");
  }
  if (!form.value.customerNumber) {
    errors.value.push("Customer Number required.");
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
  emit("onsubmit", form.value);
}

function onclose() {
  emit("onClose");
}
</script>
