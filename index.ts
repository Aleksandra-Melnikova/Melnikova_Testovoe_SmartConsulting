import express from "express";
import * as mongoose from "mongoose";
import artistsRouter from "../JS-26Melnikova/HomeWork-85/api/routers/artists";
import albumsRouter from "../JS-26Melnikova/HomeWork-85/api/routers/albums";
import tracksRouter from "../JS-26Melnikova/HomeWork-85/api/routers/tracks";
import usersRouter from "../JS-26Melnikova/HomeWork-85/api/routers/users";
import trackHistoryRouter from "../JS-26Melnikova/HomeWork-85/api/routers/track_history";
import cors from "cors";
import AdminRouter from "../JS-26Melnikova/HomeWork-85/api/routers/admin";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

const run = async () => {
  await mongoose.connect("mongodb://localhost/testovoe");

  app.listen(port, () => {
    console.log(`Server started on port http://localhost:${port}`);
  });
};

run().catch((err) => console.log(err));
