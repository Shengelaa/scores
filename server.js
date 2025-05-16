const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Create an instance of express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB URI - Replace with your actual MongoDB connection URI
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://admin:levanme99@cluster0.1pw4f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// MongoDB schema for storing items
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: String, required: true },
});

// Create a model based on the schema
const Item = mongoose.model("Item", ItemSchema);

// GET endpoint: Fetch all items from the database
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find(); // Fetch all items
    res.status(200).json(items); // Return the items as JSON
  } catch (err) {
    res.status(500).json({ error: "Error fetching items" });
  }
});

// POST endpoint: Create a new item
// POST endpoint: Create a new item
app.post("/items", async (req, res) => {
  const { name, score } = req.body;

  // Validate input
  if (!name || !score) {
    return res.status(400).json({ error: "Name and score are required" });
  }

  try {
    // Create a new item
    const newItem = new Item({ name, score });
    await newItem.save();
    res.status(201).json(newItem); // Return the newly created item
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error creating item", details: err.message });
  }
});

// Set the backend to listen on port 5000 or use the environment port (for deployment platforms)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
