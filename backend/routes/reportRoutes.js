const express = require('express');
const { Protect, adminOnly } = require('../middlewares/authMiddleware');
const { exportUsersReport, exportTasksReport } = require('../controllers/reportControllers');

const reportRouter = express.Router();

reportRouter.get('/exports/tasks',Protect,adminOnly,exportTasksReport) // exports tasks report in pdf/Excel format
reportRouter.get('/export/users',Protect,adminOnly,exportUsersReport) // exports user-task detail in pdf.excel format
module.exports = reportRouter;