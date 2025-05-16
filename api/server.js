const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

let db;

const connectDB = async () => {
  if (db) return db;
  try {
    const client = await MongoClient.connect(
      "mongodb+srv://admin:levanme99@cluster0.1pw4f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", // Your MongoDB URI
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    db = client.db("your-database-name"); // Replace with your database name
    return db;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

// Handler function for GET request to fetch items
module.exports = async (req, res) => {
  const db = await connectDB();
  const collection = db.collection("items"); // Replace with your collection name
  try {
    if (req.method === "GET") {
      const items = await collection.find().toArray();
      res.status(200).json(items); // Send back all items as a response
    } else if (req.method === "POST") {
      const { name, score } = req.body;
      if (!name || !score) {
        return res.status(400).json({ error: "Name and score are required" });
      }

      const newItem = { name, score };
      await collection.insertOne(newItem); // Insert new item into MongoDB
      res.status(201).json(newItem); // Send the newly created item as a response
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
