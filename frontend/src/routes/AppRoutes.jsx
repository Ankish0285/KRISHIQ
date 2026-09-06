import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import NotFound from "../pages/NotFound.jsx";
import FarmerLayout from "../layouts/FarmerLayout.jsx";
import BuyerLayout from "../layouts/BuyerLayout.jsx";
import FPOLayout from "../layouts/FPOLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import FarmerDashboard from "../pages/farmer/Dashboard.jsx";
import AddProduce from "../pages/farmer/AddProduce.jsx";
import MyProduce from "../pages/farmer/MyProduce.jsx";
import FarmerOrders from "../pages/farmer/Orders.jsx";
import Earnings from "../pages/farmer/Earnings.jsx";
import DemandForecast from "../pages/farmer/DemandForecast.jsx";
import FarmerProfile from "../pages/farmer/Profile.jsx";
import BuyerDashboard from "../pages/buyer/Dashboard.jsx";
import Marketplace from "../pages/buyer/Marketplace.jsx";
import ProductDetails from "../pages/buyer/ProductDetails.jsx";
import Recommendations from "../pages/buyer/Recommendations.jsx";
import BuyerOrders from "../pages/buyer/Orders.jsx";
import TrackOrder from "../pages/buyer/TrackOrder.jsx";
import BuyerProfile from "../pages/buyer/Profile.jsx";
import FpoDashboard from "../pages/fpo/Dashboard.jsx";
import FpoFarmers from "../pages/fpo/Farmers.jsx";
import FpoInventory from "../pages/fpo/Inventory.jsx";
import BulkOrders from "../pages/fpo/BulkOrders.jsx";
import AdminDashboard from "../pages/admin/Dashboard.jsx";
import AdminFarmers from "../pages/admin/Farmers.jsx";
import AdminBuyers from "../pages/admin/Buyers.jsx";
import AdminProducts from "../pages/admin/Products.jsx";
import AdminOrders from "../pages/admin/Orders.jsx";
import AdminLogistics from "../pages/admin/Logistics.jsx";
import AdminAnalytics from "../pages/admin/Analytics.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute roles={["farmer"]} />}>
        <Route element={<FarmerLayout />}>
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="/farmer/add-produce" element={<AddProduce />} />
          <Route path="/farmer/my-produce" element={<MyProduce />} />
          <Route path="/farmer/orders" element={<FarmerOrders />} />
          <Route path="/farmer/earnings" element={<Earnings />} />
          <Route path="/farmer/demand-forecast" element={<DemandForecast />} />
          <Route path="/farmer/profile" element={<FarmerProfile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["buyer"]} />}>
        <Route element={<BuyerLayout />}>
          <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
          <Route path="/buyer/marketplace" element={<Marketplace />} />
          <Route path="/buyer/product/:id" element={<ProductDetails />} />
          <Route path="/buyer/recommendations" element={<Recommendations />} />
          <Route path="/buyer/orders" element={<BuyerOrders />} />
          <Route path="/buyer/track-order" element={<TrackOrder />} />
          <Route path="/buyer/track-order/:id" element={<TrackOrder />} />
          <Route path="/buyer/profile" element={<BuyerProfile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["fpo"]} />}>
        <Route element={<FPOLayout />}>
          <Route path="/fpo/dashboard" element={<FpoDashboard />} />
          <Route path="/fpo/farmers" element={<FpoFarmers />} />
          <Route path="/fpo/inventory" element={<FpoInventory />} />
          <Route path="/fpo/bulk-orders" element={<BulkOrders />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/farmers" element={<AdminFarmers />} />
          <Route path="/admin/buyers" element={<AdminBuyers />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/logistics" element={<AdminLogistics />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
        </Route>
      </Route>

      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
