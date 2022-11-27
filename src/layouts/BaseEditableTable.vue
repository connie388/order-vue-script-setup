<template>
  <div>
    <table id="tableComponent" class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <div v-if="checkboxEnable">
            <th scope="col" class="py-3 pl-4">
              <div class="flex items-center h-5">
                <input
                  id="checkbox-all"
                  type="checkbox"
                  class="text-blue-600 border-gray-200 rounded focus:ring-blue-500"
                />
                <label for="checkbox" class="sr-only"> Checkbox </label>
              </div>
            </th>
          </div>
          <!-- loop through each value of the fields to get the table header -->
          <!-- possible enhancement to add a attribute visible in fields
          when call the BaseEditableTable add following filtering to remove the
          visible = false items -->
          <!-- :fields="props.fields.filter(item => item.visible) -->
          <th
            scope="col"
            class="text-right px-6 py-3 text-xs font-bold uppercase"
            v-for="field in props.fields"
            :key="field.column"
          >
            {{ field.header }}

            <i
              v-if="field.column == sortColumn && order == 'DESC'"
              class="fa-solid fa-arrow-down"
            ></i>
            <i
              v-if="field.column == sortColumn && order == 'ASC'"
              class="fa-solid fa-arrow-up"
            ></i>
          </th>

          <th
            v-if="props.editEnable"
            scope="col"
            class="px-6 py-3 text-sm font-bold text-right text-gray-500"
          >
            Edit
          </th>
          <th
            v-if="props.deleteEnable"
            scope="col"
            class="px-6 py-3 text-sm font-bold text-right text-gray-500"
          >
            Delete
          </th>
          <th
            v-if="props.addRow"
            scope="col"
            class="px-6 py-3 text-sm font-bold text-right text-gray-500"
          >
            <BaseButton
              className="btn-green"
              @click="addNewRecord"
              label="+Add Record"
            />
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="(item, index) in tableItems" :key="index">
          <div v-if="checkboxEnable">
            <td class="border py-3 pl-4">
              <div class="flex items-center h-5">
                <input
                  type="checkbox"
                  class="text-blue-600 border-gray-200 rounded focus:ring-blue-500"
                />
                <label for="checkbox" class="sr-only"> Checkbox </label>
              </div>
            </td>
          </div>
          <td
            class="text-right px-6 py-4 text-xs font-medium text-gray-800 whitespace-nowrap"
            v-for="field in props.fields"
            :key="field.column"
            @click="onclick(item, index)"
          >
            <BaseInput
              id="item[field.column]"
              type="field.type"
              className="field-input text-right"
              v-model="item[field.column]"
            />
          </td>

          <td
            v-if="props.editEnable"
            class="px-6 py-4 text-xs font-medium text-right whitespace-nowrap"
            @click="editItem(item)"
          >
            <a class="text-green-500 hover:text-green-700" href="#">
              <i class="fa-solid fa-pen-to-square"></i
            ></a>
          </td>
          <td
            v-if="props.deleteEnable"
            class="px-6 py-4 text-xs font-medium text-right whitespace-nowrap"
            @click="removeRecord(item, index)"
          >
            <a class="text-red-500 hover:text-red-700" href="#">
              <i class="fa-solid fa-trash-can"></i
            ></a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import BaseInput from "./BaseInput.vue";
import BaseButton from "./BaseButton.vue";
import { defineProps, defineEmits, ref, watch } from "vue";

const props = defineProps({
  addRow: {
    type: Boolean,
    default: false,
  },
  editEnable: {
    type: Boolean,
    default: true,
  },
  deleteEnable: {
    type: Boolean,
    default: true,
  },
  dataList: {
    type: Array,
  },
  fields: {
    type: Array,
  },

  checkboxEnable: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["onclick", "editItem", "deleteItem"]);

let sortColumn = ref("");
let order = ref("ASC");

let tableItems = ref([]);

watch(props, () => {
  if (props.dataList) {
    tableItems.value = props.dataList?.map((item) => ({
      ...item,
    }));
  }
});

function onclick(item) {
  emit("onclick", item);
}

function editItem(item) {
  emit("editItem", item);
}

function removeRecord(item, index) {
  tableItems.value = tableItems.value.filter((item, i) => i !== index);
  emit("deleteItem", item);
}
function addNewRecord() {
  const newRow = props.fields.reduce((a) => ({ ...a }), {});
  tableItems.value?.unshift(newRow);
}
</script>
