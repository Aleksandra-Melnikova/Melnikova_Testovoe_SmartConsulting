import express from "express";
import { connectDB } from "./db.js";
import usersRouter from "./routes/users.js";
import cors from "cors";

const app = express();
const port = 8000;

app.use(express.json());

const startServer = async () => {
  await connectDB();
  app.use(cors());
  app.get("/", (req, res) => {
    res.send("Server is running!");
  });
  app.use("/users", usersRouter);
  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });
};

startServer().catch((err) => console.error("Server error:", err));
