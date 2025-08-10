import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import config from "config";
import { User } from "../../../model/user.js";

describe("User.generateAuthToken", () => {
  it("should return a valid json web token", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decode = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(decode).toMatchObject(payload);
  });
});
