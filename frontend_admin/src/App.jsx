import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./Layout/Layout";
import Home from "./Page/Home/Home.page";
import Product from "./Page/Product/Product.page";
import Activity from "./Page/Activity/Activity.page";
import Banner from "./Page/Banner/Banner.page";
import Order from "./Page/Order/Order.page";
import UserPage from "./Page/User/User.page";

import Test from "./Page/Test/Test.page";

import Login from "./Auth/Login";
import Logout from "./Auth/Logout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/banner" element={<Banner />} />
          <Route path="/order" element={<Order />} />
          <Route path="/user" element={<UserPage />} />

          <Route path="/test" element={<Test />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </>
  );
}

export default App;
