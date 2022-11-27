import { createRouter, createWebHistory } from "vue-router";
import PageNotFound from "@/views/PageNotFound.vue";

const routes = [
  {
    path: "/customer",
    name: "CustomerList",
    component: () => import("../components/CustomerList.vue"),
  },
  {
    path: "/order",
    name: "OrderListByCustomer",
    component: () => import("../components/OrderList.vue"),
  },
  {
    path: "/payment",
    name: "PaymentList",
    component: () => import("../components/PaymentList.vue"),
  },
  {
    path: "/productline",
    name: "ProductLineList",
    component: () => import("../components/ProductLineList.vue"),
  },
  {
    path: "/product",
    name: "ProductList",
    component: () => import("../components/ProductList.vue"),
  },
  {
    path: "/:catchAll(.*)*",
    name: "PageNotFound",
    component: PageNotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
