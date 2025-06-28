export const BASE_URL = "http://localhost:3000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", //Register a new user {Admin or member}
    LOGIN: "/api/auth/login", //Auhtenticate user & return JWT token
    GET_PROFLE: "/api/auth/profile", //Get looged-in user details
  },

  USERS: {
    GET_ALL_USERS: "/api/users", // Get all users {admi only}
    GET_USER_BY_ID: (userId) => `/api/user/${userId}`,
    CREATE_USER: "/api/users", //Create a new user {Admin Only}
    UPDATE_USER: (userId) => `/api/users/${userId}`, //Update user details
    DELETE_USER: (userId) => `/api/users/${userId}`, //Delete a user
  },

  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data", // Get Dashboard Data
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", //Get user dashboard details
    GET_ALL_TASKS: "/api/tasks", // Get all assgined tasks
    GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`,
    CREATE_TASK: "/api/tasks", //Create a new tasks details
    UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, //Update task details
    DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, //Delete a task {admi Only}

    UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`, // Update task progress
    UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`, //Update todo check;sit
  },

  REPORTS: {
    EXPORT_TASKS: "/api/reports/exports/tasks", //Download all task as an excel/pdf format
    EXPORT_USERS: "/api/reports/exports/tasks", //Dowmload user-task report
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
};
