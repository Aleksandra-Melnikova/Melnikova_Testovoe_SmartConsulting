import { getUsersCollection } from "../db.js";

const auth = async (req, res, next) => {
  const token = req.get("Authorization");

  if (!token) {
    return res.status(401).send({ error: "No token present" });
  }

  try {
    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ token });

    if (!user) {
      return res.status(401).send({ error: "Wrong token!" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

export default auth;
