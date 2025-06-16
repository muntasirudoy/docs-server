import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AVATER_PLACEHOLDER } from "../constant/constant";
export const register = async (req: Request, res: Response): Promise<void> => {
  const { fullName, email, password, avatar } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    password: hashed,
    avatar: AVATER_PLACEHOLDER,
  });

  const token = jwt.sign({ id: user._id }, "Secrate"!, {
    expiresIn: "7d",
  });
  res.status(201).json({ token, data: user, status: 201 });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      res
        .status(404)
        .json({ message: "User not found", status: 404, error: true });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res
        .status(401)
        .json({ message: "Invalid credentials", status: 401, error: true });
      return;
    }

    const token = jwt.sign({ id: user._id }, "Secrate"!, {
      expiresIn: "7d",
    });

    res.status(200).json({ token, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};
