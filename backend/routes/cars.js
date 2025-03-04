const router = require("express").Router();
const Car = require("../models/CarModel");

// Fetch All Cars
router.get("/cars", async (req, res) => {
    try {
      const cars = await Car.find();
      res.status(200).json(cars);
    } catch (err) {
      res.status(500).json({ message: "Error fetching cars", error: err.message });
    }
  });
  
  // Add a New Car
  router.post("/cars", async (req, res) => {
    try {
      const newCar = new Car(req.body);
      const savedCar = await newCar.save();
      res.status(201).json(savedCar);
    } catch (err) {
      res.status(400).json({ message: "Failed to add car", error: err.message });
    }
  });
  
  // Edit a Car
  router.put("/cars/:id", async (req, res) => {
    try {
      const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedCar) return res.status(404).json({ message: "Car not found" });
      res.status(200).json(updatedCar);
    } catch (err) {
      res.status(400).json({ message: "Error updating car", error: err.message });
    }
  });
  
  // Delete a Car
  router.delete("/cars/:id", async (req, res) => {
    try {
      const deletedCar = await Car.findByIdAndDelete(req.params.id);
      if (!deletedCar) return res.status(404).json({ message: "Car not found" });
      res.status(200).json({ message: "Car deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting car", error: err.message });
    }
  });
  
  // Delete Multiple Cars
  router.post("/cars/delete", async (req, res) => {
    try {
      if (!req.body.ids || req.body.ids.length === 0) {
        return res.status(400).json({ message: "No car IDs provided" });
      }
      await Car.deleteMany({ _id: { $in: req.body.ids } });
      res.status(200).json({ message: "Selected cars deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting multiple cars", error: err.message });
    }
  });

  module.exports = router;