import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Login from "./Pages/Auth/Login";
import SginUp from "./Pages/Auth/SginUp";
import Dashboard from "./Pages/Admin/Dashboard";
import ManageTask from "./Pages/Admin/ManageTask";
import CreateTask from "./Pages/Admin/CreateTask";
import MyTasks from "./Pages/Users/MyTasks";
import ViewTasksDetails from "./Pages/Users/ViewTasksDetails";
import PrivateRoute from "./Routes/PrivateRoute";
import UsersDashboard from "./Pages/Users/UsersDashboard";
import UserProvider, { UserContext } from "./context/userContext";
import ManageUsers from "./Pages/Admin/ManageUsers";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/SginUp" element={<SginUp />} />

            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/tasks" element={<ManageTask />} />
              <Route path="/admin/create-task" element={<CreateTask />} />
              <Route path="/admin/users" element={<ManageUsers />} />
            </Route>
            <Route element={<PrivateRoute allowedRoles={["user"]} />}>
              <Route path="/user/dashboard" element={<UsersDashboard />} />
              <Route path="/user/tasks" element={<MyTasks />} />
              <Route
                path="/user/user-details/:id"
                element={<ViewTasksDetails />}
              />
            </Route>
            <Route path="/" element={<Root />} />
          </Routes>
        </Router>
      </div>

      <Toaster toastOption={{ className: "", style: { fontSize: "13px" } }} />
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Outlet />;

  if (!user) return <Navigate to="/login" />;

  return user.role === "admin" ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/user/dashboard" />
  );
};
