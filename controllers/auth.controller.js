import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const data = req.body;
    const hashPassword = bcrypt.hashSync(data.password, 5);
    await User.create({ ...data, password: hashPassword });

    res.status(201).send("User has been created.");
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = bcrypt.compareSync(password, user.password);
    if (!isCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_KEY
    );

    const data = { ...user._doc, authToken: token };
    delete data.password;

    res.status(200).send(data);
  } catch (err) {
    next(err);
  }
};
