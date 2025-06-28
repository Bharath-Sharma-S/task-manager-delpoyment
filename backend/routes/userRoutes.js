const express = require('express');
const { Protect, adminOnly } = require('../middlewares/authMiddleware');
const { getUserBYId, deleteUser, getUsers } = require('../controllers/userControllers');

const userRouter = express.Router();

userRouter.get("/",Protect,adminOnly,getUsers) // Get all Users (Admin Only)
userRouter.get("/:id",Protect,getUserBYId);


module.exports = userRouter;