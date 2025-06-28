import React, { useContext, useLayoutEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import UserCard from "../../cards/UserCard";
import toast from "react-hot-toast";
import { UserContext } from "../../context/userContext";

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);

  const { loader, setLoader } = useContext(UserContext);

  const getAllUsers = async () => {
    setLoader(true);
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);

      setLoader(false);

      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      setLoader(true);
      console.error("Error fetching users : ", error);
    }
  };

  //Download task report
  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
        responseType: "blob",
      });

      //Create a URL for blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error while creating url blob : ", error);
      toast.error("Failed to download expense details. Please try again");
    }
  };

  useLayoutEffect(() => {
    getAllUsers();

    return () => {};
  }, []);
  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="mt-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Team Members</h2>
          <button
            className="flex md:flex download-btn"
            onClick={handleDownloadReport}
          >
            <LuFileSpreadsheet className="text-lg" />
            Download Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {loader ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 w-[80vw]">
              <div class="h-[127px] p-4 bg-white rounded-lg shadow-md animate-pulse ">
                <div class="h-[50px] bg-gray-300 rounded-md mb-4"></div>

                <div class="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
              </div>
              <div class=" h-[127px] p-4 bg-white rounded-lg shadow-md animate-pulse ">
                <div class="h-[50px] bg-gray-300 rounded-md mb-4"></div>

                <div class="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
              </div>
              <div class=" h-[127px] p-4 bg-white rounded-lg shadow-md animate-pulse ">
                <div class="h-[50px] bg-gray-300 rounded-md mb-4"></div>

                <div class="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
              </div>
              <div class=" h-[127px] p-4 bg-white rounded-lg shadow-md animate-pulse ">
                <div class="h-[50px] bg-gray-300 rounded-md mb-4"></div>

                <div class="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
              </div>
              <div class=" h-[127px] p-4 bg-white rounded-lg shadow-md animate-pulse ">
                <div class="h-[50px] bg-gray-300 rounded-md mb-4"></div>

                <div class="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
              </div>
              <div class=" h-[127px] p-4 bg-white rounded-lg shadow-md animate-pulse ">
                <div class="h-[50px] bg-gray-300 rounded-md mb-4"></div>

                <div class="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
              </div>
              <div class=" h-[127px] p-4 bg-white rounded-lg shadow-md animate-pulse ">
                <div class="h-[50px] bg-gray-300 rounded-md mb-4"></div>

                <div class="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
              </div>
              <div class=" h-[127px] p-4 bg-white rounded-lg shadow-md animate-pulse ">
                <div class="h-[50px] bg-gray-300 rounded-md mb-4"></div>

                <div class="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
              </div>
              <div class=" h-[127px] p-4 bg-white rounded-lg shadow-md animate-pulse ">
                <div class="h-[50px] bg-gray-300 rounded-md mb-4"></div>

                <div class="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
              </div>
            </div>
          ) : (
            allUsers?.map((user) => <UserCard key={user._id} userInfo={user} />)
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
