<template>
  <div class="bg-indigo-600">
    <nav
      class="container px-6 py-8 mx-auto md:flex md:justify-between md:items-center"
    >
      <div class="flex items-center justify-between">
        <router-link to="/" class="text-gray-100 hover:text-indigo-400"
          >Order Application
        </router-link>
        <!-- Mobile menu button -->
        <div @click="toggleNav" class="flex md:hidden">
          <button
            type="button"
            class="text-gray-100 hover:text-gray-400 focus:outline-none focus:text-gray-400"
          >
            <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current">
              <path
                fill-rule="evenodd"
                d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu open: "block", Menu closed: "hidden" -->
      <ul
        :class="showMenu ? 'flex' : 'hidden'"
        class="flex-col mt-8 space-y-4 md:flex md:space-y-0 md:flex-row md:items-center md:space-x-10 md:mt-0"
      >
        <router-link
          @click="setClick('/productline')"
          :class="{ active: currentLink === '/productline' }"
          class="text-gray-100 hover:text-indigo-400"
          to="/productline"
          >Product Line</router-link
        >
        <router-link
          @click="setClick('/product')"
          :class="{ active: currentLink === '/product' }"
          class="text-gray-100 hover:text-indigo-400"
          to="/product"
          >Product</router-link
        >
        <router-link
          @click="setClick('/customer')"
          :class="{ active: currentLink === '/customer' }"
          class="text-gray-100 hover:text-indigo-400"
          to="/customer"
          >Customer</router-link
        >
        <router-link
          @click="setClick('/order')"
          :class="{ active: currentLink === '/order' }"
          class="text-gray-100 hover:text-indigo-400"
          to="/order"
          >Order</router-link
        >
        <router-link
          @click="setClick('/payment')"
          :class="{ active: currentLink === '/payment' }"
          class="text-gray-100 hover:text-indigo-400"
          to="/payment"
          >Payment</router-link
        >
      </ul>
    </nav>
  </div>
</template>
<script setup>
import { ref } from "vue";

let currentLink = ref("/");
let showMenu = ref(false);

const toggleNav = () => (showMenu.value = !showMenu.value);

function setClick(link) {
  currentLink.value = link;
}
</script>
