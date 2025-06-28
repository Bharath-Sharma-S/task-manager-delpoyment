import React, { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/layouts/TaskStatusTabs";
import TaskCard from "../../cards/TaskCard";
import toast from "react-hot-toast";
import { UserContext } from "../../context/userContext";

const ManageTask = () => {
  const { loader, setLoader } = useContext(UserContext);

  const [allTasks, setAllTasks] = useState([]);

  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  const getAllTasks = async () => {
    setLoader(true);
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });
      setLoader(false);

      setAllTasks(response?.data?.tasks?.length > 0 ? response.data.tasks : []);

      //Map statusSummary dat with fixed labels and order

      const statusSummary = response.data?.statusSummary || {};

      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];

      setTabs(statusArray);
    } catch (error) {
      setLoader(true);
      console.error("Error while fecthing data", error);
    }
  };

  const handleClick = (taskData) => {
    navigate("/admin/create-task", { state: { taskId: taskData._id } });
  };

  //download task report
  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });

      //Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "task_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error while downloading file : ", error);
      toast.error("Failed to download expense details. Please try again");
    }
  };

  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className={`${loader?'my-11.5':'my-4'}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-xl font-semibold">My Tasks</h2>
            <button
              className="flex lg:hidden download-btn"
              onClick={handleDownloadReport}
            >
              <LuFileSpreadsheet className="text-lg" />
              Download Report
            </button>
          </div>

          {tabs?.[0]?.count > 0 && (
            <div className="">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />

              <button
                className="hidden lg:flex download-btn"
                onClick={handleDownloadReport}
              >
                <LuFileSpreadsheet className="text-lg" />
                Download Report
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {loader ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 w-[81vw]">
              
              <div className=" p-4 bg-white rounded-lg shadow-md animate-pulse ">
                <div className="h-[107px] bg-gray-300 rounded-md mb-4"></div>

                <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>

                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
              <div className=" p-4 bg-white rounded-lg shadow-md animate-pulse">
                <div className="h-[107px] bg-gray-300 rounded-md mb-4"></div>

                <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>

                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
              <div className=" p-4 bg-white rounded-lg shadow-md animate-pulse">
                <div className="h-[107px] bg-gray-300 rounded-md mb-4"></div>

                <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>

                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
              <div className=" p-4 bg-white rounded-lg shadow-md animate-pulse">
                <div className="h-[107px] bg-gray-300 rounded-md mb-4"></div>

                <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>

                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
              <div className=" p-4 bg-white rounded-lg shadow-md animate-pulse">
                <div className="h-[107px] bg-gray-300 rounded-md mb-4"></div>

                <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>

                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
              <div className=" p-4 bg-white rounded-lg shadow-md animate-pulse">
                <div className="h-[107px] bg-gray-300 rounded-md mb-4"></div>

                <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>

                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          ) : (
            allTasks?.map((item, index) => {
              return (
                <TaskCard
                  key={item._id}
                  title={item.title}
                  description={item.description}
                  priority={item.priority}
                  status={item.status}
                  progress={item.progress}
                  createdAt={item.createdAt}
                  dueDate={item.dueDate}
                  assginedTo={item.assginedTo?.mao(
                    (item) => item.profileImageUrl
                  )}
                  attachmentCount={item.attachments?.length || 0}
                  completedTodoCount={item.completedTodoCount || 0}
                  todoChecklists={item.todoChecklists || []}
                  onClick={() => handleClick(item)}
                />
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageTask;
