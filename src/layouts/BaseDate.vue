<template>
  <div class="date-picker">
    Month:
    <input
      type="number"
      ref="month-picker"
      :value="value.month"
      @input="updateDate()"
    />
    Year:
    <input
      type="number"
      ref="year-picker"
      :value="value.year"
      @input="updateDate()"
    />
  </div>
</template>

<script>

export default {
  props: ["value"],
  emits: ["input"],
  methods: {
    updateDate() {
      this.$emit("input", {
        month: +this.$refs.monthPicker.value,
        year: +this.$refs.yearPicker.value,
      });
    },
  },
};
</script>
