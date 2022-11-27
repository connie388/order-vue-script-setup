import { createApp } from "vue";
// import Vue from "vue";
import App from "./App.vue";
// import "./assets/reset.css";
import "./assets/index.css";
import router from "./router";

// capture all the unhandled exceptions which are not specific to Vue instances
window.onerror = function (message, source, lineno, colno, error) {
  console.log("Exception: ", error);
};
const app = createApp(App);

// captures errors that occur during component rendering
// captures the errors that are specific to Vue instances
app.config.errorHandler = (err) => {
  console.log("Exception: ", err);
};
app.use(router).mount("#app");
