require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const authRouter = require("./routes/authRoutes");
const connectDB = require("./config/db");
const userRouter = require("./routes/userRoutes");
const taskRouter = require("./routes/taskRoutes");
const reportRouter = require("./routes/reportRoutes");
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
//connecting to database
connectDB();

app.use(express.json());
//routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/reports", reportRouter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}/`);
// });



module.exports = app;