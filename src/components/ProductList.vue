<template>
  <div class="flex flex-row">
    <div class="w-1/4">
      <BaseHeader
        label="Select Product Line"
        class="font-bold block text-sm text-start"
      />
      <BaseDropdown :options="productlines" @selected="searchByProductLine" />

      <BaseHeader
        label="Product List"
        class="mt-10 font-bold block text-sm text-start"
      />
      <BaseList
        :resetIndex="reset"
        :options="products"
        @onclick="setActiveProduct"
      />
      <BaseButton
        className="btn-green"
        @click="setNewRecord"
        label="+Add Product"
      />
    </div>
    <div class="w-3/4">
      <NotificationModal
        :show="visibleMsgView"
        :msg="msg"
        @close="this.visibleMsgView = false"
      />
      <div v-if="newRecord">
        <BaseHeader label="New Product" />
        <ProductForm :productlines="productlines" @onsubmit="addProductData" />
      </div>
      <div v-else-if="currentProductCode" class="flex flex-row">
        <div class="w-11/12">
          <BaseHeader label="Update Product" />
          <ProductForm
            :productlines="productlines"
            :edit="true"
            :productCode="currentProductCode"
            @onsubmit="updateProductData"
          />
        </div>
        <div class="w-1/12">
          <i
            class="fa-solid fa-trash-can text-xs text-blue-500 hover:text-blue-700 sm:text-3xl md:text-6xl"
            @click="deleteProduct"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseHeader from "../layouts/BaseHeader.vue";
import BaseButton from "../layouts/BaseButton.vue";
import BaseDropdown from "../layouts/BaseDropdown.vue";
import BaseList from "../layouts/BaseList.vue";
import NotificationModal from "./NotificationModal.vue";
import ProductForm from "./ProductForm";
import { createEndpoint, ENDPOINTS } from "@/services/CreateEndPoint";
import { ref, onMounted } from "vue";

let productlines = ref([]);
let products = ref([]);
let currentProductCode = ref(null);
let newRecord = ref(false);
let searchProductLine = ref("");
let reset = ref(false);
let msg = ref("");
let visibleMsgView = ref(false);

onMounted(async () => {
  retrieveProductLines();
});

function setActiveProduct(option) {
  currentProductCode.value = option.key;
  msg.value = "";
  visibleMsgView.value = false;
  newRecord.value = false;
}

function retrieveProductLines() {
  productlines.value = [];
  createEndpoint(ENDPOINTS.PRODUCTLINE)
    .fetchAll()
    .then((res) => {
      for (let record in res.data) {
        var temp = {
          key: res.data[record].productLine,
          text: res.data[record].productLine,
        };
        productlines.value.push(temp);
      }
    })
    .catch((err) => console.log(err));
}

function setNewRecord() {
  newRecord.value = true;
  msg.value = "";
  visibleMsgView.value = false;
  currentProductCode.value = null;
}

function searchByProductLine(option) {
  searchProductLine.value = option.key;
  findByProductLine();
}

function findByProductLine() {
  products.value = [];
  reset.value = !reset.value;
  createEndpoint(ENDPOINTS.PRODUCT)
    .fetchAllByCategory(searchProductLine.value)
    .then((res) => {
      for (let record in res.data) {
        var tempProduct = {
          key: res.data[record].productCode,
          text: res.data[record].productCode,
        };
        products.value.push(tempProduct);
      }
    })
    .catch((err) => console.log(err));
}

function deleteProduct() {
  createEndpoint(ENDPOINTS.PRODUCT)
    .delete(currentProductCode.value)
    .then((res) => {
      console.log(res.data);
      msg.value = "Record deleted successfully!";
      visibleMsgView.value = true;
      currentProductCode.value = null;
      if (searchProductLine.value) findByProductLine();
    })
    .catch((err) => console.log(err));
}

function updateProductData(form) {
  var data = {
    productLine: form.productLine,
    productCode: form.productCode,
    productName: form.productName,
    productScale: form.productScale,
    productVendor: form.productVendor,
    productDescription: form.productDescription,
    quantityInStock: form.quantityInStock,
    buyPrice: form.buyPrice,
    msrp: form.msrp,
  };
  createEndpoint(ENDPOINTS.PRODUCT)
    .update(form.productCode, data)
    .then((res) => {
      console.log(res.data);
      msg.value = "Record updated successfully!";
      visibleMsgView.value = true;
    })
    .catch((err) => console.log(err));
}

function addProductData(form) {
  var data = {
    productLine: form.productLine,
    productCode: form.productCode,
    productName: form.productName,
    productScale: form.productScale,
    productVendor: form.productVendor,
    productDescription: form.productDescription,
    quantityInStock: form.quantityInStock,
    buyPrice: form.buyPrice,
    msrp: form.msrp,
  };

  createEndpoint(ENDPOINTS.PRODUCT)
    .create(data)
    .then((res) => {
      console.log(res.data);
      if (searchProductLine.value) findByProductLine();
      msg.value = "Record added successfully!";
      visibleMsgView.value = true;
      newRecord.value = false;
    })
    .catch((err) => console.log(err));
}
</script>
