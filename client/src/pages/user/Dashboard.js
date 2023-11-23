import React from "react";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import HistoryHotelOrder from "../../components/HIstoryHotelOrder"; 
const Dashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout title={"Dashboard - Restaurant"}>
      <div className="bg-gray-100">
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-semibold my-20 text-center mb-6">Welcome, {auth?.user?.name}!</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-3xl font-bold mb-4 text-center text-pink-300">User Information</h2>

              <div className="mb-2 mx-8">
              <span className="font-semibold mx text-xl"> User Name : </span>
              <span className="text-gradient-to-r animate-pulse text-red-500 text-xl ml-2 font-bold">{auth?.user?.name}</span>

              </div>
              <div className="mb-2 mx-8">
                <span className="font-semibold mx text-xl">User Email : </span> <span className="text-gradient-to-r animate-pulse text-red-500 text-xl ml-2 font-bold">{auth?.user?.email}</span>
              </div>
              <div className="mb-2 mx-8">
                <span className="font-semibold mx text-xl">User Number : </span> <span className="text-gradient-to-r animate-pulse text-red-500 text-xl ml-2 font-bold">{auth?.user?.phone}</span>
              </div>
              <div className="mb-2 mx-8">
                <span className="font-semibold mx text-xl">User Address : </span> <span className="text-gradient-to-r animate-pulse text-red-500 text-xl ml-2 font-bold">{auth?.user?.address}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 md:col-span-1 ">
              <h2 className="text-xl font-semibold mb-4">Hotel Order History</h2>
              <HistoryHotelOrder />
            </div>
         </div>

        </div>
      </div>









    </Layout>
  );
};

export default Dashboard;