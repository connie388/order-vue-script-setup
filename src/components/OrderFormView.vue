<template>
  <div class="flex flex-wrap">
    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <BaseLabel
        id="customerName"
        label="Customer Name"
        :info="order.customerName"
      />
    </div>

    <div
      class="w-full md:w-1/3 px-3 mb-6 md:mb-0"
      :key="index"
      v-for="(item, index) in orderAllFields"
    >
      <BaseLabel
        id="index"
        :label="item.header"
        :info="computedData(item.column)"
      />
    </div>
  </div>

  <div class="overflow-auto">
    <br />
    <BaseViewTable
      :fields="orderProductsFields"
      :dataList="orderDetails"
      :viewEnable="false"
      :editEnable="false"
      :deleteEnable="false"
      :filterEnable="false"
    />
  </div>
</template>
<script setup>
import BaseLabel from "../layouts/BaseLabel.vue";
import BaseViewTable from "../layouts/BaseViewTable.vue";
import { createEndpoint, ENDPOINTS } from "@/services/CreateEndPoint";
import { defineProps, ref, onMounted } from "vue";

const props = defineProps({
  order: Object,
});

const orderAllFields = ref([
  { column: "orderNumber", header: "Order Number" },
  { column: "orderDate", header: "Order Date" },
  { column: "requiredDate", header: "Required Date" },
  { column: "shippedDate", header: "Shipped Date" },
  { column: "status", header: "Status" },
  { column: "comments", header: "Comments" },
  { column: "createdAt", header: "Created At" },
  { column: "updatedAt", header: "Updated At" },
]);

const orderProductsFields = ref([
  { column: "productCode", header: "Product Code" },
  { column: "quantityOrdered", header: "Quantity" },
  { column: "priceEach", header: "Price Each" },
]);

let orderDetails = ref([]);

onMounted(async () => {
  if (props.order) {
    if (props.order["orderNumber"])
      retrieveOrderDetail(props.order["orderNumber"]);
  }
});

function computedData(col) {
  return props.order[col]?.toString();
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
</script>
