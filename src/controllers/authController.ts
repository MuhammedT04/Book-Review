import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserSchema from "../models/User";
import dotenv from "dotenv";
dotenv.config();


const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;


//SIGN UP

export const SignUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body)
    const existing = await UserSchema.findOne({ email });
    if (existing) {
      res.json({ errors: false, message: "Email already exist" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserSchema.create({
      userName: name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.userName, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error });
  }
};


//LOGIN AND JWT

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserSchema.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // access token

    const accessToken = jwt.sign(
      { id: user._id },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // refresh token

    const refreshToken = jwt.sign(
      { id: user._id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );


    //save refresh token in cookie

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      id: user._id,
      name: user.userName,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err });
  }
};


//REFRESH AND ACCESS TOKEN

export const refreshAccessToken = (req: Request, res: Response) => {
    
  const token = req.cookies.refreshToken;
  if (!token) {
    res.sendStatus(401);
    return;
  }
  try {
    const userData = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET!
    ) as any;

    const newAccessToken = jwt.sign(
      { id: userData.id, role: userData.role },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.sendStatus(403);
  }
};