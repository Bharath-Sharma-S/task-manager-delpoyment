const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require("../controllers/authControllers");
const { Protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");



const authRouter = express.Router();


authRouter.post('/register',registerUser); //Regester User
authRouter.post("/login",loginUser); // Login User
authRouter.get("/profile",Protect,getUserProfile); // Get User Profile
authRouter.put("/profile",Protect,updateUserProfile); // Update Profile 


authRouter.post("/upload-image",upload.single('image'),(req,res)=> {
  if(!req.file) {
    return res.status(400).json({message:"No file uploaded"});
  }
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  res.status(200).json({imageUrl})
})


module.exports = authRouter;