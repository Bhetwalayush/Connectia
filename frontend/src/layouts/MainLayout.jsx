import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import RightSidebar from "../components/layout/RightSidebar";


function MainLayout() {

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />


      <div className="flex">

        <Sidebar />


        <main className="flex-1 p-5">
          <Outlet />
        </main>


        <RightSidebar />

      </div>

    </div>
  );
}


export default MainLayout;