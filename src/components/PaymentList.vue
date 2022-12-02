<template>
  <div>
    <BaseErrors :errors="errors" />
  </div>
  <div class="flex flex-wrap -mx-3 mb-2">
    <div class="w-full md:w-1/5 px-3 mb-6 md:mb-0">
      <BaseDropdown
        :options="customerList"
        label="Customer Name"
        @selected="setCustomerNumber"
      />
    </div>
    <div class="w-full md:w-1/5 px-3 mb-6 md:mb-0">
      <BaseInput
        type="date"
        label="From Payment Date"
        v-model="searchPaymentFromDate"
      />
    </div>
    <div class="w-full md:w-1/5 px-3 mb-6 md:mb-0">
      <BaseInput
        type="date"
        label="To Payment Date"
        v-model="searchPaymentToDate"
      />
    </div>

    <div class="w-full md:w-1/5 px-3 mb-6 md:mb-0">
      <br />
      <BaseButton
        @click="retrievePaymentsByCustomerAndDateRange"
        label="Search Payments"
      />
    </div>
    <div class="w-full md:w-1/5 px-3 mb-6 md:mb-0">
      <br />
      <BaseButton
        className="btn-green"
        @click="visiblePaymentAdd = true"
        label="+Add Payment"
      />
    </div>
  </div>

  <div class="overflow-auto">
    <BaseViewTable
      :fields="paymentFields"
      :dataList="payments"
      @editItem="editPayment"
      @deleteItem="deletePayment"
      :viewEnable="false"
      :filterEnable="true"
    />
  </div>

  <BaseModal :showing="visiblePaymentAdd" @close="visiblePaymentAdd = false">
    <template v-slot:header
      ><h1 class="text-xl font-bold text-center">
        Add Payment Information
      </h1></template
    >

    <template v-slot:body>
      <PaymentFormEdit
        :edit="false"
        :customerList="customerList"
        @onSubmit="addPayment"
        @onClose="visiblePaymentAdd = false"
      />
    </template>

    <!-- <template v-slot:footer> <BaseButton label="Add" /></template> -->
  </BaseModal>
  <BaseModal :showing="visiblePaymentEdit" @close="visiblePaymentEdit = false">
    <template v-slot:header
      ><h1 class="text-xl font-bold text-center">
        Payment Information
      </h1></template
    >

    <template v-slot:body>
      <PaymentFormEdit
        :payment="selectedPayment"
        :customerName="searchCustomerName"
        :edit="true"
        @onSubmit="updatePayment"
        @onClose="visiblePaymentEdit = false"
      />
    </template>

    <!-- <template v-slot:footer> <BaseButton label="Add" /></template> -->
  </BaseModal>

  <BaseModal
    :showing="visibleMsgView"
    modalContainerClass="modal-notify-container"
    modalContentClass="modal-notify-content"
    :closeButtonEnable="true"
    @close="visibleMsgView = false"
  >
    <template v-slot:body>
      <p>{{ msg }}</p>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseErrors from "../layouts/BaseErrors.vue";
import BaseButton from "../layouts/BaseButton.vue";
import BaseInput from "../layouts/BaseInput.vue";
import BaseDropdown from "../layouts/BaseDropdown.vue";
import BaseViewTable from "../layouts/BaseViewTable.vue";
import BaseModal from "../layouts/BaseModal";
import PaymentFormEdit from "./PaymentFormEdit";
import { createEndpoint, ENDPOINTS } from "@/services/CreateEndPoint";
import { ref, onMounted } from "vue";

let customerList = ref([]);
let searchCustomerNumber = ref(null);
let searchCustomerName = ref("");
let searchPaymentFromDate = ref(null);
let searchPaymentToDate = ref(null);
let checkNumber = ref("");
let payments = ref([]);
let selectedPayment = ref(null);
let visiblePaymentEdit = ref(false);
let visiblePaymentAdd = ref(false);
let visibleMsgView = ref(false);
let errors = ref([]);
let msg = ref("");

const paymentFields = ref([
  { column: "checkNumber", header: "Check Number", type: "text" },
  { column: "paymentDate", header: "Payment Date", type: "text" },
  { column: "amount", header: "Amount", type: "number" },
]);

onMounted(async () => {
  retrieveCustomerList();
});

function setCustomerNumber(option) {
  searchCustomerNumber.value = option.key;
  searchCustomerName.value = option.text;
}

function editPayment(item) {
  selectedPayment.value = {
    ...item,
    customerNumber: searchCustomerNumber.value,
  };
  visiblePaymentEdit.value = true;
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

function retrievePaymentsByCustomerAndDateRange() {
  errors.value = [];
  if (!searchCustomerNumber.value) {
    errors.value.push("Please select a customer.");
  }
  payments.value = [];
  createEndpoint(ENDPOINTS.PAYMENT)
    .fetchByCustomerAndDateRange(
      searchCustomerNumber.value,
      searchPaymentFromDate.value,
      searchPaymentToDate.value,
      null
    )
    .then((res) => {
      for (let record in res.data) {
        var tempPayment = {
          customerNumber: res.data[record].customerNumber,
          checkNumber: res.data[record].checkNumber,
          paymentDate: res.data[record].paymentDate?.substring(0, 10),
          amount: res.data[record].amount,
        };
        payments.value.push(tempPayment);
      }
    })
    .catch((err) => console.log(err));
}
function updatePayment(form) {
  var data = {
    checkNumber: form.checkNumber,
    customerNumber: form.customerNumber,
    paymentDate: form.paymentDate,
    amount: form.amount,
  };
  console.log("data=" + data);

  createEndpoint(ENDPOINTS.PAYMENT)
    .update(data.customerNumber, data.checkNumber, data)
    .then((res) => {
      console.log(res.data);
      msg.value = "Payment is updated successfully!";
      retrievePaymentsByCustomerAndDateRange();
    })
    .catch((err) => {
      console.log(err);
      msg.value = "Something wrong happened";
    });
  visibleMsgView.value = true;
}
function addPayment(form) {
  var data = {
    checkNumber: form.checkNumber,
    customerNumber: form.customerNumber,
    paymentDate: form.paymentDate,
    amount: form.amount,
  };
  console.log(data);
  createEndpoint(ENDPOINTS.PAYMENT)
    .create(data)
    .then((res) => {
      console.log(res.data);
      checkNumber.value = res.data.checkNumber;
      msg.value = "Payment is added successfully!";
      retrievePaymentsByCustomerAndDateRange();
    })
    .catch((err) => {
      console.log(err);
      msg.value = "Something wrong happened";
    });
  visibleMsgView.value = true;
}
function deletePayment(item) {
  createEndpoint(ENDPOINTS.PAYMENT)
    .delete(item.customerNumber, item.checkNumber)
    .then((res) => {
      console.log(res.data);
      msg.value = "Payment is deleted successfully!";
      retrievePaymentsByCustomerAndDateRange();
    })
    .catch((err) => {
      console.log(err);
      msg.value = "Something wrong happened";
    });
  visibleMsgView.value = true;
}
</script>
