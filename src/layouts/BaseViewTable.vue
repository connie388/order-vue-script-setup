<template>
  <div>
    <div v-if="props.dataList?.length === 0">
      <div v-if="props.showmsg">No data available</div>
    </div>

    <div v-else>
      <div v-if="props.filterEnable">
        <div class="flex items-center space-x-2">
          <div class="relative">
            <span
              class="relative inline-flex items-center px-3 py-3 space-x-2 text-sm font-medium text-gray-600 rounded-md sm:py-2"
            >
              <BaseButton
                className="btn-orange"
                @click="filteredList"
                label="Filters:"
              >
                <i class="bg-orange fa-solid fa-filter fa-lg"></i>
              </BaseButton>
            </span>
          </div>
        </div>

        <div class="flex flex-wrap py-3 pl-2">
          <div
            class="relative min-w-xs m-2"
            v-for="field of props.fields"
            :key="field.column"
          >
            <input
              v-model="searchString[field.column]"
              :placeholder="field.header"
              class="px-6 py-4 text-xs font-medium text-right whitespace-nowrap"
            />
            <div
              class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"
            >
              <i class="fa-solid fa-magnifying-glass fa-2xs text-gray-500"></i>
            </div>
          </div>
        </div>
      </div>

      <table id="tableComponent" class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <div v-if="props.checkboxEnable">
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
            <th
              scope="col"
              class="text-right px-6 py-3 text-xs font-bold uppercase"
              v-for="field in props.fields"
              :key="field.column"
              @click="setSortColumn(field.column)"
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
              v-if="props.viewEnable"
              scope="col"
              class="px-6 py-3 text-sm font-bold text-right text-gray-500"
            >
              View
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
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(item, index) in filteredArray" :key="index">
            <div v-if="props.checkboxEnable">
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
              @click="onclick(item)"
            >
              {{ item[field.column] }}
            </td>

            <td
              v-if="props.viewEnable"
              class="px-6 py-4 text-xs font-medium text-right whitespace-nowrap"
              @click="viewItem(item)"
            >
              <a class="text-blue-500 hover:text-blue-700" href="#">
                <i class="fa-solid fa-eye"></i
              ></a>
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
              @click="deleteItem(item)"
            >
              <a class="text-red-500 hover:text-red-700" href="#">
                <i class="fa-solid fa-trash-can"></i
              ></a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import BaseButton from "./BaseButton.vue";
const emit = defineEmits(["onclick", "viewItem", "editItem", "deleteItem"]);
const props = defineProps({
  //
  viewEnable: {
    type: Boolean,
    default: true,
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
  showmsg: {
    type: Boolean,
    default: false,
  },
  filterEnable: {
    type: Boolean,
    default: false,
  },
  checkboxEnable: {
    type: Boolean,
    default: false,
  },
});

let sortColumn = ref("");
let order = ref("ASC");
let searchString = ref([]);
let filteredArray = ref([]);

function setSortColumn(column) {
  if (sortColumn.value === column) {
    order.value = order.value === "ASC" ? "DESC" : "ASC";
  } else {
    order.value = "ASC";
    sortColumn.value = column;
  }
}
function onclick(item) {
  emit("onclick", item);
}

function viewItem(item) {
  emit("viewItem", item);
}
function editItem(item) {
  emit("editItem", item);
}
function deleteItem(item) {
  emit("deleteItem", item);
}

watch(props, () => {
  filteredArray.value = props.dataList;
});

function filteredList() {
  var filteredList = props.dataList;
  for (let i = 0; i < props.fields?.length; i++) {
    filteredList = searchString.value[props.fields[i]["column"]]
      ? filteredList.filter((wo) => {
          let str = "" + wo[props.fields[i]["column"]];
          return str.includes(searchString.value[props.fields[i]["column"]]);
        })
      : filteredList;
  }
  const column = sortColumn.value;
  const orderValue = order.value;

  filteredList.sort(function (a, b) {
    var nameA = a[column] + "".toUpperCase();
    var nameB = b[column] + "".toUpperCase();
    if (orderValue === "DESC" && nameA > nameB) {
      return -1;
    }
    if (orderValue === "DESC" && nameA < nameB) {
      return 1;
    }
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  // return filteredList;
  filteredArray.value = filteredList;
}
</script>
