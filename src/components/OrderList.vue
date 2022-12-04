<template>
  <div class="flex flex-wrap -mx-3 mb-2">
    <div class="w-full md:w-1/5 px-3 mb-6 md:mb-0">
      <BaseInput
        id="customerNameLike"
        v-model="searchCustomerName"
        label="Customer Name like"
        placeholder="Customer Name Like"
      />
    </div>
    <div class="w-full md:w-1/5 px-3 mb-6 md:mb-0">
      <BaseInput
        type="date"
        label="From Order Date"
        v-model="searchOrderFromDate"
      />
    </div>
    <div class="w-full md:w-1/5 px-3 mb-6 md:mb-0">
      <BaseInput
        type="date"
        label="To Order Date"
        v-model="searchOrderToDate"
      />
    </div>

    <div class="w-full md:w-1/5 px-3 mb-6 md:mb-0">
      <br />
      <BaseButton
        @click="retrieveOrdersByNameAndDateRange"
        label="Search Orders"
      />
    </div>
    <div class="w-full md:w-1/5 px-3 mb-6 md:mb-0">
      <br />
      <BaseButton
        className="btn-green"
        @click="
          visibleOrderAdd = true;
          orderNumber = null;
        "
        label="+Add Order"
      />
    </div>
  </div>

  <div class="overflow-auto">
    <BaseViewTable
      :fields="orderCustomerFields"
      :dataList="orders"
      @editItem="editOrder"
      :deleteEnable="false"
      :viewEnable="false"
      :filterEnable="true"
    />
  </div>

  <BaseModal :showing="visibleOrderAdd" @close="visibleOrderAdd = false">
    <template v-slot:header
      ><h1 class="text-xl font-bold text-center">
        Add Order Information
      </h1></template
    >

    <template v-slot:body>
      <OrderFormAdd
        :orderNumber="orderNumber"
        @onSubmit="addOrderData"
        @onClose="visibleOrderAdd = false"
      />
    </template>

    <!-- <template v-slot:footer> <BaseButton label="Add" /></template> -->
  </BaseModal>
  <BaseModal :showing="visibleOrderEdit" @close="visibleOrderEdit = false">
    <template v-slot:header
      ><h1 class="text-xl font-bold text-center">
        Order Information
      </h1></template
    >

    <template v-slot:body>
      <OrderFormEdit
        :order="selectedOrder"
        @onsubmit="updateOrderData"
        @onClose="visibleOrderEdit = false"
      />
    </template>

    <!-- <template v-slot:footer> <BaseButton label="Add" /></template> -->
  </BaseModal>

  <NotificationModal
    :show="visibleMsgView"
    :msg="msg"
    @close="this.visibleMsgView = false"
  />
</template>

<script setup>
import BaseButton from "../layouts/BaseButton.vue";
import BaseInput from "../layouts/BaseInput.vue";
import BaseViewTable from "../layouts/BaseViewTable.vue";
import BaseModal from "../layouts/BaseModal";
import NotificationModal from "./NotificationModal.vue";
import OrderFormEdit from "./OrderFormEdit";
import OrderFormAdd from "./OrderFormAdd";
import { createEndpoint, ENDPOINTS } from "@/services/CreateEndPoint";
import { ref } from "vue";

let searchCustomerName = ref("");
let searchOrderFromDate = ref(null);
let searchOrderToDate = ref(null);
let orders = ref([]);
let visibleOrderEdit = ref(false);
let visibleOrderAdd = ref(false);
let visibleMsgView = ref(false);
let selectedOrder = ref(null);
let orderNumber = ref(null);
let msg = ref("");

const orderCustomerFields = ref([
  { column: "customerNumber", header: "Customer Number" },
  { column: "customerName", header: "Customer Name" },
  { column: "orderNumber", header: "Order Number" },
  { column: "orderDate", header: "Order Date" },
  { column: "requiredDate", header: "Required Date" },
  { column: "shippedDate", header: "Shipped Date" },
  { column: "status", header: "Status" },
]);

function editOrder(item) {
  selectedOrder.value = item;
  visibleOrderEdit.value = true;
}

function retrieveOrdersByNameAndDateRange() {
  orders.value = [];

  createEndpoint(ENDPOINTS.ORDER_CUSTOMER)
    .fetchByNameAndDateRange(
      searchCustomerName.value,
      searchOrderFromDate.value,
      searchOrderToDate.value
    )
    .then((res) => {
      for (let record in res.data) {
        var tempOrder = {
          customerNumber: res.data[record].customerNumber,
          customerName: res.data[record].customerName,
          orderNumber: res.data[record].orderNumber,
          orderDate: res.data[record].orderDate?.substring(0, 10),
          requiredDate: res.data[record].requiredDate?.substring(0, 10),
          shippedDate: res.data[record].shippedDate?.substring(0, 10),
          status: res.data[record].status,
          comments: res.data[record].comments,
          createdAt: res.data[record].createdAt,
          updatedAt: res.data[record].updatedAt,
        };
        orders.value.push(tempOrder);
      }
    })
    .catch((err) => console.log(err));
}
function updateOrderData(form) {
  var data = {
    orderNumber: form.orderNumber,
    customerNumber: form.customerNumber,
    orderDate: form.orderDate,
    requiredDate: form.requiredDate,
    shippedDate: form.shippedDate,
    status: form.status,
    comments: form.comments,
    orderDetailList: form.orderDetailList,
  };

  createEndpoint(ENDPOINTS.ORDER)
    .update(form.orderNumber, data)
    .then((res) => {
      console.log(res.data);
      msg.value = "Order is updated successfully!";
      retrieveOrdersByNameAndDateRange();
    })
    .catch((err) => {
      console.log(err);
      msg.value = "Something wrong happened";
    });
  visibleMsgView.value = true;
}
function addOrderData(form) {
  var data = {
    orderNumber: form.orderNumber * 1,
    customerNumber: form.customerNumber,
    orderDate: form.orderDate,
    requiredDate: form.requiredDate,
    shippedDate: form.shippedDate,
    status: form.status,
    comments: form.comments,
    orderDetailList: form.orderDetailList,
  };

  createEndpoint(ENDPOINTS.ORDER)
    .create(data)
    .then((res) => {
      orderNumber.value = res.data.orderNumber;
      msg.value = "Order is added successfully!";
      retrieveOrdersByNameAndDateRange();
    })
    .catch((err) => {
      console.log(err);
      msg.value = "Something wrong happened";
    });
  visibleMsgView.value = true;
}
</script>
