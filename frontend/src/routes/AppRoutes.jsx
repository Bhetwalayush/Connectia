// Application route configuration with protected and public routes
import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Profile from "../pages/Profile/Profile";
import EditProfile from "../pages/EditProfile/EditProfile";
import Explore from "../pages/Explore/Explore";
import Messages from "../pages/Messages/Messages";
import Notifications from "../pages/Notifications/Notifications";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import NotFound from "../pages/NotFound/NotFound";
import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoutes from "./PubliRoutes";

// Define all application routes with access control
function AppRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoutes />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Route>
      </Route>

      <Route element={<PublicRoutes />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
