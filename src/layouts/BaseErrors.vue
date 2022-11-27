<template>
    <p v-if="props.errors.length">
      <b>Please correct the following error(s):</b>
      <ul class="text-red-500">
        <li v-bind:key="error" v-for="error in props.errors">{{ error }}</li>
      </ul>
    </p>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
    errors: {
        type: Array,
        default: null,
    }
  });
</script>
