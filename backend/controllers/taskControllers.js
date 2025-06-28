const { ImInsertTemplate } = require("react-icons/im");
const Task = require("../models/Task");
const taskModel = require("../models/Task");

// @desc  get all tasks (admin : all ,user:only assigned tasks)
//Route  Get /api/task/
const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }

    let tasks;
    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id });
    }
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoChecklists.filter(
          (item) => item.completed
        ).length;
        return { ...task._doc, completedTodoCount: completedCount };
      })
    );

    const allTask = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user._id }
    );

    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "Pending",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }), // ✅ wrap this!
    });

    const inProgressTasks = await Task.countDocuments({
      ...filter,
      status: "In Progress",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "Completed",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });
    res.json({
      tasks,
      statusSummary: {
        all: allTask,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "server failed",
      error: err.message,
    });
  }
};

//route   Get /api/tasks/:id
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );
    if (!task) {
      return res.status(404).json({
        message: "There is no task for this user assigned",
      });
    }
    return res.json({ task });
  } catch (err) {
    return res.status(500).json({
      message: "Server Failed",
      error: err.message,
    });
  }
};

// route  post /api/tasks/
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklists,
    } = req.body;

    if (!Array.isArray(assignedTo)) {
      return res.status(400).json({
        message: "Assigned must be an array of user ID's",
      });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      attachments,
      assignedTo,
      createdBy: req.user._id,
      todoChecklists,
    });


    res.status(201).json({
      message: "Task Created SuccesssFully...",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server Failed",
      error: err.message,
    });
  }
};

//route  udateTask put /api/task/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        message: "task is not found for this id",
      });
    }
    task.title = req.body.title || task.title;
    task.priority = req.body.priority || task.priority;
    task.description = req.body.description || task.description;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoChecklists = req.body.todoChecklists || task.todoChecklists;

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res.status(404).json({
          message: "assignedTo to must be an array of users ID's",
        });
      }
      task.assignedTo = req.body.assignedTo;
    }

    const updateTask = await task.save();
    return res.json({
      updateTask,
      message: "task update successFully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "server failed",
      error: err.message,
    });
  }
};

//Delete Task   Done by (admin Only)
//route   Delete /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.deleteOne({ _id: req.params.id });
    if (task.deletedCount < 1) {
      return res.status(404).json({
        message: "No task found for this id",
      });
    }
    res.json({
      message: "Task Deleted SuccessFully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Serve Failed",
      error: err.message,
    });
  }
};

//route  put /api/tasks/:id/todo
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        message: "Task Not Found",
      });
    }


    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (!isAssigned && req.user.role !== "admin")
      return res.status(403).json({
        message: "Not Authorized",
      });

    task.status = req.body.status || task.status;

    if (task.status === "Completed") {
      task.todoChecklists.forEach((item) => (item.completed = true));
      task.progress = 100;
    }
    await task.save();
    res.json({
      message: "Task status updated",
      task,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Serve Failed",
      error: err.message,
    });
  }
};

//route  put /api/task/:id/todo
const updateTaskChecklist = async (req, res) => {
  try {
    const { todoChecklist } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task)
      return res.status(404).json({
        message: "Task Not Found",
      });

    if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Not authorized to update checklist",
      });
    }
    //replace with updated checklist
    task.todoChecklists = todoChecklist;
    const completedCount = task.todoChecklists.filter(
      (item) => item.completed
    ).length;

    const totalItems = task.todoChecklists.length;
    task.progress =
      totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    //Auto mark task as completed if all items are checked

    if (task.progress === 100) {
      task.status = "Completed";
    } else if (task.progress > 0) {
      task.status = "In Progress";
    } else {
      task.status = "Pending";
    }

    await task.save();

    const updatedTask = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    res.json({
      message: "Task Chechlist updated successFully",
      task: updatedTask,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server Failed",
      error: err.message,
    });
  }
};

//route /get /api/task/dashboard-data
const getDashboardData = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const completedTasks = await Task.countDocuments({ status: "Completed" });
    const overdueTasks = await Task.countDocuments({
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    //Ensure all possible statuses are included
    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistrubtionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskDistrubtion = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "");
      //remove spaces for response keys
      acc[formattedKey] =
        taskDistrubtionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistrubtion["All"] = totalTasks; //Add total count to taskDistribution

    //Ensure all priority levels are included
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    //fetch recent 10tasks
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistrubtion,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server Failed",
      error: err.message,
    });
  }
};

//route  /Get /api/task/user-dashboard-data
const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id; //only fetch data for loged-in user
    //Fetch stataicts for user-specific tasks

    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const pendingTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Pending",
    });
    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "Completed",
    });
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g,"");
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});

    taskDistribution["All"] = totalTasks;

    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    const recentTask = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTask,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server Failed",
      error: err.message,
    });
  }
};

module.exports = {
  getTaskById,
  getTasks,
  updateTask,
  updateTaskChecklist,
  updateTaskStatus,
  getUserDashboardData,
  getDashboardData,
  deleteTask,
  createTask,
};
