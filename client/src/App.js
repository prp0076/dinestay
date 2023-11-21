import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Pagenotfound from "./pages/Pagenotfound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/Routes/Private";
import ForgotPasssword from "./pages/Auth/ForgotPassword";
import AdminRoute from "./components/Routes/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import MangerDashboard from "./pages/Manager/ManagerDashboard";
import StaffDashboard from "./pages/Staff/StaffDashboard";
import CreateCategory from "./pages/Manager/CreateCategory";
import Profile from "./pages/user/Profile";
import Search from "./pages/Search";
import Categories from "./pages/Categories";
import CategoryProduct from "./pages/CategoryProduct";
import CartPage from "./pages/CartPage";
import ManagerRoute from "./components/Routes/ManagerRoute";
import StaffRoute from "./components/Routes/StaffRoute";
import CreateFood from "./pages/Manager/CreateFood";
import UpdateFood from "./pages/Manager/UpdateFood";
import Menu from "./components/Layout/Menu";
import Orders from "./pages/Orders";
import CreateBranch from "./pages/Admin/CreateBranch";
import AllInvoice from "./pages/Manager/AllInvoice";
import CreateRoomCategory from "./pages/Manager/CreateRoomCategory";
import CreateRoom from "./pages/Manager/CreateRoom";
import CreateRoomSubcategory from "./pages/Manager/CreateRoomSubcategory"
import HotelRoom from "./components/Layout/HotelRoom";
import AllHotelInvoice from "./pages/Manager/AllHotelInvoice";
import HotelBookForm from "./components/Layout/HotelBookForm"
import HotelBookFormBranch from "./components/Layout/HotelBookFormBranch"
import HistoryHotelOrder from "./components/HIstoryHotelOrder";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hotel" element={<HotelRoom />} />
        
        <Route path="/categories" element={<Categories />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/hotelBookForm/:categoryId" element={<HotelBookForm/>} />
        <Route path="/hotelBookFormBranch/:branchId" element={<HotelBookFormBranch/>} />
        <Route path="/category/:slug" element={<CategoryProduct />} />
        <Route path="/search" element={<Search />} />
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="user" element={<Dashboard />} />
          <Route path="user/profile" element={<Profile />} />
          <Route path="user/orders" element={<Orders />} />
          <Route path="user/h_orders-list" element={<HistoryHotelOrder/>} />
        </Route>
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/create-branch" element={<CreateBranch />} />
          <Route path="admin/h_orders-list" element={<HistoryHotelOrder/>} />
        </Route>
        <Route path="/dashboard" element={<ManagerRoute />}>
          <Route path="manager" element={<MangerDashboard />} />
          <Route path="manager/create-category" element={<CreateCategory />} />
          <Route path="manager/create-room-category" element={<CreateRoomCategory/>} />
          <Route path="manager/create-room-Subcategory" element={<CreateRoomSubcategory/>} />
          <Route path="manager/create-food" element={<CreateFood />} />
          <Route path="manager/create-room" element={<CreateRoom/>} />
          <Route path="manager/food/:slug" element={<UpdateFood />} />
          <Route path="manager/allInvoice" element={<AllInvoice />} />
          <Route path="manager/allHotelInvoice" element={<AllHotelInvoice/>} />
          <Route path="manager/h_orders-list" element={<HistoryHotelOrder/>} />
        </Route>
        <Route path="/dashboard" element={<StaffRoute />}>
          <Route path="staff" element={<StaffDashboard />} />
          <Route path="staff/h_orders-list" element={<HistoryHotelOrder/>} />

        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPasssword />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Pagenotfound />} />
      </Routes>
    </>
  );
}

export default App;
