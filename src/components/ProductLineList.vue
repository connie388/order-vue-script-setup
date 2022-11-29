<template>
  <div class="flex flex-row">
    <div class="w-1/4">
      <BaseHeader
        label="Product Line List"
        class="font-bold block text-sm text-start"
      />
      <BaseList :options="productlines" @onclick="setActiveProductLine" />
      <BaseButton
        className="btn-green"
        @click="setNewRecord"
        label="+Add Product Line"
      />
    </div>
    <div class="w-3/4">
      <div>
        <p>{{ msg }}</p>
      </div>
      <div v-if="newRecord">
        <BaseHeader label="New Product Line" />
        <ProductLineForm @onsubmit="addProductLineData" />
      </div>
      <div v-else-if="currentProductLine" class="flex flex-row">
        <div class="w-11/12">
          <BaseHeader label="Update Product Line" />
          <ProductLineForm
            :disabled="true"
            :pline="currentProductLine"
            @onsubmit="updateProductLineData"
          />
        </div>
        <div class="w-1/12">
          <i
            class="fa-solid fa-trash-can text-xs text-blue-500 hover:text-blue-700 sm:text-3xl md:text-6xl"
            @click="deleteProductLine"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseHeader from "../layouts/BaseHeader.vue";
import BaseButton from "../layouts/BaseButton.vue";
import ProductLineForm from "./ProductLineForm";
import BaseList from "../layouts/BaseList.vue";
import { createEndpoint, ENDPOINTS } from "@/services/CreateEndPoint";
import { ref, onMounted } from "vue";

let productlines = ref([]);
let currentProductLine = ref(null);
let newRecord = ref(false);
let msg = ref("");

onMounted(async () => {
  retrieveProductLines();
});

function setActiveProductLine(option) {
  currentProductLine.value = option.key;
  msg.value = "";
  newRecord.value = false;
}

function setNewRecord() {
  newRecord.value = true;
  msg.value = "";
  currentProductLine.value = null;
}

function retrieveProductLines() {
  productlines.value = [];
  createEndpoint(ENDPOINTS.PRODUCTLINE)
    .fetchAll()
    .then((res) => {
      for (let record in res.data) {
        var tempProductLine = {
          key: res.data[record].productLine,
          text: res.data[record].productLine,
        };
        productlines.value.push(tempProductLine);
      }
    })
    .catch((err) => console.log(err));
}

function deleteProductLine() {
  createEndpoint(ENDPOINTS.PRODUCTLINE)
    .delete(currentProductLine.value)
    .then((res) => {
      console.log(res.data);
      msg.value = "Record deleted successfully!";
      currentProductLine.value = null;
      retrieveProductLines();
    })
    .catch((err) => console.log(err));
}

function updateProductLineData(form) {
  var data = {
    productLine: form.productLine,
    textDescription: form.textDescription,
    htmlDescription: form.htmlDescription,
    imageUrl: form.imageUrl,
  };
  createEndpoint(ENDPOINTS.PRODUCTLINE)
    .update(form.productLine, data)
    .then((res) => {
      console.log(res.data);
      msg.value = "Record updated successfully!";
    })
    .catch((err) => console.log(err));
}

function addProductLineData(form) {
  var data = {
    productLine: form.productLine,
    textDescription: form.textDescription,
    htmlDescription: form.htmlDescription,
    imageUrl: form.imageUrl,
  };

  createEndpoint(ENDPOINTS.PRODUCTLINE)
    .create(data)
    .then((res) => {
      console.log(res.data);
      retrieveProductLines();
      msg.value = "Record added successfully!";
      newRecord.value = false;
    })
    .catch((err) => console.log(err));
}
</script>
