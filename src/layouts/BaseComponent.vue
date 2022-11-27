<template>
  <component
    :is="type"
    :href="props.href"
    :to="props.to"
    :class="props.className"
  >
    <slot />
  </component>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  href: {
    type: String,
    default: null,
  },
  to: {
    type: String,
    default: null,
  },
  className: {
    type: String,
    default: "",
  },
});

function type() {
  if (props.href) {
    return "a";
  } else if (props.to) {
    return "router-link";
  } else {
    return "button";
  }
}
</script>
