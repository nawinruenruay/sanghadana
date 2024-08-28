import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LayoutUser } from "./layout/Layout";

// PAGEs
import { SplashscreenPage } from "./pages/SplashscreenPage/Splashscreen.page";
import { HomePage } from "./pages/HomePage/Home.page";
import { ProductPage } from "./pages/ProductPage/Product.page";
import { ProductDetailPage } from "./pages/ProductPage/ProductDetail.page";
import { AboutPage } from "./pages/AboutPage/About.page";
import { GalleryPage } from "./pages/GalleryPage/Gallery.page";
import { GalleryDetailPage } from "./pages/GalleryPage/GalleryDetail.page";
import { ContactPage } from "./pages/ContactPage/Contact.page";
import { UserPage } from "./pages/UserPage/User.page";
import { CartPage } from "./pages/CartPage/Cart.page";
import { CheckoutPage } from "./pages/CheckoutPage/Checkout.page";
import { PrivacypolicyPage } from "./pages/PrivacypolicyPage/Privacypolicy.page";

// AUTH
import { Register } from "./auth/Register";
import { Login } from "./auth/Login";
import { Logout } from "./auth/Logout";

const router = createBrowserRouter([
  {
    element: <LayoutUser />,
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/product",
        element: <ProductPage />,
      },
      {
        path: "/:productName",
        element: <ProductDetailPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/gallery",
        element: <GalleryPage />,
      },
      {
        path: "/gallery/:galleryName",
        element: <GalleryDetailPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/checkout",
        element: <CheckoutPage />,
      },
      {
        path: "/user/account/",
        element: <UserPage />,
      },
      {
        path: "/privacypolicy",
        element: <PrivacypolicyPage />,
      },
    ],
  },
  {
    path: "/",
    element: <SplashscreenPage />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
