import express from "express";
import auth from "../middleware/auth.js";
import { User } from "../models/user/User.js";

const usersRouter = express.Router();

usersRouter.post("/register", async (req, res) => {
  try {
    const userData = req.body;
    const existingUser = await User.findOne({ username: userData.username });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const user = new User(userData);
    await user.setPassword(userData.password);
    user.generateToken();
    await user.save();

    res.status(201).json({
      token: user.token,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

usersRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }

    const isPasswordValid = await user.checkPassword(req.body.password);
    if (!isPasswordValid) {
      return res.status(403).json({ error: "Invalid password" });
    }

    user.generateToken();
    await user.save();

    res.status(200).json({
      token: user.token,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

usersRouter.delete("/logout", auth, async (req, res) => {
  const user = req.user;
  user.token = null;
  await user.save();
  res.send({ message: "Success logout" });
});

export default usersRouter;
