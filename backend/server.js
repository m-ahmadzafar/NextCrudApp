require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const carRoutes = require("./routes/cars");


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());


// Routes
app.use("/api", carRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// MongoDB Event Listeners (Debugging)
mongoose.connection.on("error", (err) => console.error("MongoDB Error:", err));
mongoose.connection.on("disconnected", () => console.log("MongoDB Disconnected"));


// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

