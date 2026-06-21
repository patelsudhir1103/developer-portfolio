import express from "express";
import Message from "../models/Message.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Memory backup for database offline testing
let mockMessages = [];

// @desc    Post a contact message
// @route   POST /api/messages
// @access  Public
router.post("/", async (req, res) => {
  const { name, email, location, budget, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message are required fields" });
  }

  try {
    const newMessage = new Message({
      name,
      email,
      location: location || "Not specified",
      budget: budget || "Not specified",
      subject: subject || "No Subject",
      message,
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    console.log("Database offline, saving message to temporary server cache.");
    const fallbackMessage = {
      _id: `msg-${Date.now()}`,
      name,
      email,
      location: location || "Not specified",
      budget: budget || "Not specified",
      subject: subject || "No Subject",
      message,
      isRead: false,
      createdAt: new Date(),
    };
    mockMessages.unshift(fallbackMessage);
    res.status(201).json(fallbackMessage);
  }
});

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.log("Database offline, serving server cache messages.");
    res.json(mockMessages);
  }
});

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
router.put("/:id/read", protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (message) {
      message.isRead = true;
      const updatedMessage = await message.save();
      res.json(updatedMessage);
    } else {
      res.status(404).json({ message: "Message not found" });
    }
  } catch (error) {
    const msg = mockMessages.find((m) => m._id === req.params.id);
    if (msg) {
      msg.isRead = true;
      return res.json(msg);
    }
    res.status(500).json({ message: "Error updating message state", error: error.message });
  }
});

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (message) {
      await message.deleteOne();
      res.json({ message: "Message deleted successfully" });
    } else {
      res.status(404).json({ message: "Message not found" });
    }
  } catch (error) {
    const index = mockMessages.findIndex((m) => m._id === req.params.id);
    if (index !== -1) {
      mockMessages.splice(index, 1);
      return res.json({ message: "Fallback message deleted successfully" });
    }
    res.status(500).json({ message: "Error deleting message", error: error.message });
  }
});

export { router as messageRoutes };
