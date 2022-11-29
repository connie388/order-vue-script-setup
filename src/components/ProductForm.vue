<template>
  <form @submit.prevent>
    <BaseErrors :errors="errors" />

    <div v-if="edit">
      <BaseInput
        id="productLine"
        label="Product Line"
        :disabled="edit"
        v-model="form.productLine"
      />
    </div>
    <div v-else>
      <BaseDropdown
        id="productLine"
        :options="productlines"
        label="Product Line"
        @selected="setFormProductLine"
      />
    </div>
    <BaseInput
      id="productCode"
      label="Product Code"
      :disabled="edit"
      v-model="form.productCode"
    />

    <BaseInput
      id="productName"
      label="Product Name"
      v-model="form.productName"
    />

    <BaseInput
      id="productScale"
      label="Product Scale"
      v-model="form.productScale"
    />

    <BaseInput
      id="productVendor"
      label="Product Vendor"
      v-model="form.productVendor"
    />

    <BaseTextArea
      id="productDescription"
      label="Product Description"
      v-model="form.productDescription"
    />

    <BaseInput
      id="quantityInStock"
      label="Quantity In Stock"
      v-model="form.quantityInStock"
    />

    <BaseInput id="buyPrice" label="Buy Price" v-model="form.buyPrice" />

    <BaseInput id="msrp" label="msrp" v-model="form.msrp" />
    <BaseButton @click="onsubmit" label="Submit" />
  </form>
</template>
<script setup>
import { createEndpoint, ENDPOINTS } from "@/services/CreateEndPoint";
import BaseInput from "../layouts/BaseInput.vue";
import BaseButton from "../layouts/BaseButton.vue";
import BaseDropdown from "../layouts/BaseDropdown.vue";
import BaseTextArea from "../layouts/BaseTextArea.vue";
import BaseErrors from "../layouts/BaseErrors.vue";
import { defineProps, defineEmits, ref, watch, onMounted } from "vue";
const props = defineProps({
  productCode: String,
  edit: Boolean,
  productlines: Array,
});

const emit = defineEmits(["onsubmit"]);

let form = ref({
  productLine: null,
  productCode: "",
  productName: "",
  productScale: "",
  productVendor: "",
  productDescription: "",
  buyPrice: null,
  quantityInStock: null,
  msrp: null,
});
let errors = ref([]);

// for first time click
onMounted(async () => {
  getProduct();
});

// when click different item
watch(props, () => {
  getProduct();
});

function onsubmit(e) {
  errors.value = [];
  if (!form.value.productLine) {
    errors.value.push("Product Line required.");
  }
  if (!form.value.productCode) {
    errors.value.push("Product Code required.");
  }
  if (!form.value.productName) {
    errors.value.push("Product Name required.");
  }
  if (!form.value.productScale) {
    errors.value.push("Product Scale required.");
  }
  if (!form.value.productVendor) {
    errors.value.push("Product Vendor required.");
  }
  if (!form.value.productDescription) {
    errors.value.push("Product Description required.");
  }
  if (!form.value.buyPrice) {
    errors.value.push("Product Buy Price required.");
  }
  if (!form.value.msrp) {
    errors.value.push("msrp required.");
  }
  if (!form.value.quantityInStock) {
    errors.value.push("Quantity In Stock required.");
  }
  if (form.value.productCode?.length > 15) {
    errors.value.push(
      "Product Code should be less than or equal to 15 characters"
    );
  }
  if (form.value.productScale?.length > 10) {
    errors.value.push(
      "Product Scale should be less than or equal to 10 characters"
    );
  }

  if (errors.value.length) {
    return;
  }

  e.preventDefault();
  emit("onsubmit", form.value);
}

function setFormProductLine(option) {
  form.value.productLine = option.key;
}

function getProduct() {
  createEndpoint(ENDPOINTS.PRODUCT)
    .fetchById(props.productCode)
    .then((res) => {
      console.log(res.data);
      form.value.productLine = res.data.productLine;
      form.value.selectedOption = res.data.productLine;
      form.value.productCode = res.data.productCode;
      form.value.productName = res.data.productName;
      form.value.productScale = res.data.productScale;
      form.value.productVendor = res.data.productVendor;
      form.value.productDescription = res.data.productDescription;
      form.value.buyPrice = res.data.buyPrice;
      form.value.quantityInStock = res.data.quantityInStock;
      form.value.msrp = res.data.msrp || res.data.msrp;
    })
    .catch((err) => console.log(err));
}
</script>
