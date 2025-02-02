// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>
// );





import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ Ensure Router is only here
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>  {/* ✅ Wrap App inside BrowserRouter only once */}
    <App />
  </BrowserRouter>
);
