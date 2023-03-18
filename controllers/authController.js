const bcrypt = require("bcrypt");
const User = require("../models/user");
const { RequestError } = require("../helpers");
const { registerSchema, loginSchema } = require("../schemas/auth");

const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      throw RequestError(400, "missing required name field");
    }
    const { email, password, subscription } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw RequestError(409, "Email in use");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      subscription,
    });
    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      throw RequestError(400, "missing required name field");
    }
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw RequestError(401, "Email or password is wrong");
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      throw RequestError(401, "Email or password is wrong");
    }
    const token = "qrqwtfq.fdqfqwf.14fdqawsfq";
    res.json({
      token,
      user: {
        email: existingUser.email,
        subscription: existingUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
