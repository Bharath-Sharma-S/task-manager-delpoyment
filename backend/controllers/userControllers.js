const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// get all users    (admin only)
//@route   GET /api/users/
//@access  Private (Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("-password");
    const userWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Pending",
        });
        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "In Progress",
        });
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completed",
        });

        
        
        return {
          ...user._doc,
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );

    res.json(userWithTaskCounts);
  } catch (err) {
    return res.status(500).json({
      message: "Server failed ,Failed to load",
      error: err.message,
    });
  }
};

const getUserBYId = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user)
      res.status(404).json({
        message: "user Not Found",
      });

    res.json(user);
  } catch (err) {
    return res.status(500).json({
      message: "Server Failed Temporlaily",
      error: err.message,
    });
  }
};

module.exports = {
  getUserBYId,
  getUsers,
};
