<template>
  <form @submit.prevent>
    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-bind:key="error" v-for="error in errors">{{ error }}</li>
     </ul>
    </p>

    
    <BaseInput
      id="productLine"
      label="Product Line"
      :disabled = "edit"
      v-model="form.productLine"
    />

    <BaseTextArea
      id="textDescription"
      label="Text Description"
      v-model="form.textDescription"
    />

    <BaseTextArea
      id="htmlDescription"
      label="HTML Description"
      v-model="form.htmlDescription"
    />

    <BaseInput id="image" label="Image URL" v-model="form.imageUrl"/>

    <img class="object-cover h-48 w-96"  :src="form.imageUrl" alt="Product Line img">

    <BaseButton @click="onsubmit" label="Submit" />
  </form>
</template>
<script setup>
import { createEndpoint, ENDPOINTS } from "@/services/CreateEndPoint";
import BaseInput from "../layouts/BaseInput.vue";
import BaseButton from "../layouts/BaseButton.vue";
import BaseTextArea from "../layouts/BaseTextArea.vue";
import { defineProps, defineEmits, ref, watch, onMounted } from "vue";

const props = defineProps({
  edit: Boolean,
  pline:  String,
});

const emit = defineEmits(["onsubmit"]);

let form= ref({ productLine: null, textDescription: "", htmlDescription: "", imageUrl: ""});
let errors = ref([]);

onMounted(async () => {
  if (props.pline)
  getProductLine();
});

watch(props, () => {
  if (props.pline) getProductLine();
});

   function onsubmit(e) {
      errors.value = [];
      if (!form.value.productLine) {
        errors.value.push('Product Line required.');
      }
      if (errors.value.length) {
        return;
      }
      e.preventDefault();     
      emit("onsubmit", form.value);
    }

    function getProductLine() {
      createEndpoint(ENDPOINTS.PRODUCTLINE)
        .fetchById(props.pline)
        .then((res) => {
          form.value.productLine = res.data.productLine;
          form.value.textDescription = res.data.textDescription;
          form.value.htmlDescription = res.data.htmlDescription;
          form.value.imageUrl = res.data.imageUrl;
        })
        .catch((err) => console.log(err));
    }
 
</script>
