const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL,{});
    console.log(process.env.MONGO_URL);
    console.log("Mongoose connected")
  }catch(err) {
    console.log("Error while connecting to mongoose",err)
    process.exit(1)
  } 
}

module.exports = connectDB;

