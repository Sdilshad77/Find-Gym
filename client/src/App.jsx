import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import GymList from "./pages/GymList.jsx";
import GymDetail from "./pages/GymDetail.jsx";
import Shop from "./pages/Shop.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import MembershipPlans from "./pages/MembershipPlans.jsx";
import AiChat from "./pages/AiChat.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

import Profile from "./pages/Profile.jsx";
import Notifications from "./pages/Notifications.jsx";

import UserDashboard from "./pages/user/UserDashboard.jsx";
import MyBookings from "./pages/user/MyBookings.jsx";
import MyMemberships from "./pages/user/MyMemberships.jsx";
import Cart from "./pages/user/Cart.jsx";
import Checkout from "./pages/user/Checkout.jsx";
import MyOrders from "./pages/user/MyOrders.jsx";
import Wishlist from "./pages/user/Wishlist.jsx";

import OwnerDashboard from "./pages/owner/OwnerDashboard.jsx";
import MyGyms from "./pages/owner/MyGyms.jsx";
import GymForm from "./pages/owner/GymForm.jsx";
import MyProducts from "./pages/owner/MyProducts.jsx";
import ProductForm from "./pages/owner/ProductForm.jsx";
import Bookings from "./pages/owner/Bookings.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminOrders from "./pages/admin/Orders.jsx";
import AdminPayments from "./pages/admin/Payments.jsx";
import AdminNotify from "./pages/admin/Notify.jsx";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/gyms" element={<GymList />} />
          <Route path="/gyms/:id" element={<GymDetail />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/plans" element={<MembershipPlans />} />
          <Route path="/ai" element={<AiChat />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verify" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* User */}
          <Route element={<ProtectedRoute roles={["user"]} />}>
            <Route path="/account" element={<UserDashboard />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/memberships" element={<MyMemberships />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Route>

          {/* User / Owner / Admin common */}
          <Route element={<ProtectedRoute roles={["user", "gymOwner", "admin"]} />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>

          {/* Gym Owner */}
          <Route element={<ProtectedRoute roles={["gymOwner"]} />}>
            <Route path="/owner" element={<OwnerDashboard />} />
            <Route path="/owner/gyms" element={<MyGyms />} />
            <Route path="/owner/gyms/new" element={<GymForm />} />
            <Route path="/owner/gyms/:id/edit" element={<GymForm />} />
            <Route path="/owner/products" element={<MyProducts />} />
            <Route path="/owner/products/new" element={<ProductForm />} />
            <Route path="/owner/products/:id/edit" element={<ProductForm />} />
            <Route path="/owner/bookings" element={<Bookings />} />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/notify" element={<AdminNotify />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}