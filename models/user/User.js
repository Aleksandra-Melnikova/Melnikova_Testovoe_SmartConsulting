import bcrypt from "bcrypt";
import { Passport } from "../passport/Passport.js";
import { WorkInfo } from "../workInfo/WorkInfo.js";
import { getUsersCollection } from "../../db.js";
import { keyGen } from "../../utils/keyGen.js";

export function User(data) {
  if (!data.username || !data.password) {
    throw new Error("Username and password are required");
  }

  this.id = data.id || keyGen();
  this.username = data.username;
  this.password = data.password;
  this.token = data.token || keyGen();
  this.lastName = data.lastName;
  this.firstName = data.firstName;
  this.middleName = data.middleName;
  this.birthDate = data.birthDate;
  this.phone = data.phone;
  this.passport = new Passport(data.passport);
  this.workInfo = new WorkInfo(data.workInfo);
}

User.prototype.setPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(password, salt);
};

User.prototype.checkPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

User.prototype.generateToken = function () {
  this.token = keyGen();
};

User.prototype.save = async function () {
  const usersCollection = getUsersCollection();

  if (!this.id) {
    await this.setPassword(this.password);
  }

  await usersCollection.updateOne(
    { id: this.id },
    { $set: this },
    { upsert: true },
  );

  return this;
};

User.findOne = async function (query) {
  const usersCollection = getUsersCollection();
  const result = await usersCollection.findOne(query);
  return result ? new User(result) : null;
};
