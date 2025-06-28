const express = require('express');
const { Protect, adminOnly } = require('../middlewares/authMiddleware');
const { getDashboardData, getUserDashboardData, getTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist } = require('../controllers/taskControllers');


const taskRouter = express.Router();


taskRouter.get('/dashboard-data',Protect,getDashboardData);
taskRouter.get('/user-dashboard-data',Protect,getUserDashboardData); //
taskRouter.get('/',Protect,getTasks); // get task by id
taskRouter.get('/:id',Protect,getTaskById); // update task details
taskRouter.post('/',Protect,adminOnly,createTask); //create a task ( admin only)
taskRouter.put('/:id',Protect,updateTask); // Update task details
taskRouter.delete('/:id',Protect,adminOnly,deleteTask); // Delete Task ( admin only )
taskRouter.put('/:id/status',Protect,updateTaskStatus); // Update task status
taskRouter.put('/:id/todo',Protect,updateTaskChecklist); // update task checklist

module.exports = taskRouter;