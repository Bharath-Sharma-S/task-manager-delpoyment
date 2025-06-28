const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:{type:String,required:true},
  email:{type:String,required:true,unique:true},
  password:{type:String,required:true},
  profileImageUrl:{type:String,default:null},
  role:{type:String,enum:["admin","member"],default:"member"},
},{timestamps:true})

const UserModel = mongoose.model("User",UserSchema);

module.exports = UserModel;