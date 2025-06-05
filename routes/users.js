import express from "express";
import auth from "../middleware/auth.js";
import { User } from "../models/user/User.js";
import { getUsersCollection } from "../db.js";

const usersRouter = express.Router();

usersRouter.post("/register", async (req, res) => {
  try {
    const userData = req.body;

    const requiredFields = [
      "username",
      "password",
      "lastName",
      "firstName",
      "birthDate",
      "phone",
      "passport.series",
      "passport.number",
      "passport.issuedBy",
      "passport.issueDate",
    ];

    const missingFields = requiredFields.filter((field) => {
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        return !userData[parent] || !userData[parent][child];
      }
      return !userData[field];
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        missingFields,
        message: `The following fields are required: ${missingFields.join(", ")}`,
      });
    }

    const existingUser = await User.findOne({ username: userData.username });
    if (existingUser) {
      return res.status(400).json({
        error: "Username already exists",
        message: "User with this name already exists",
      });
    }

    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(userData.phone)) {
      return res.status(400).json({
        error: "Invalid phone format",
        message: "Invalid phone format",
      });
    }

    const birthDate = new Date(userData.birthDate);
    if (isNaN(birthDate.getTime())) {
      return res.status(400).json({
        error: "Invalid birth date",
        message: "Birth date must be a valid date in format YYYY-MM-DD",
      });
    }

    const passportIssueDate = new Date(userData.passport.issueDate);
    if (isNaN(passportIssueDate.getTime())) {
      return res.status(400).json({
        error: "Invalid passport issue date",
        message:
          "Passport issue date must be a valid date in format YYYY-MM-DD",
      });
    }

    const user = new User(userData);
    await user.setPassword(userData.password);
    user.generateToken();
    await user.save();

    const userResponse = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      token: user.token,
    };

    res.status(201).json({
      ...userResponse,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: error.message,
      message: "An error occurred while registering",
    });
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
  const usersCollection = await getUsersCollection();

  await usersCollection.updateOne({ _id: user._id }, { $set: { token: null } });

  res.send({ message: "Success logout" });
});

export default usersRouter;
