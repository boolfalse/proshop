
import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

export const isAuth = asyncHandler(async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        throw new Error("Not authorized!");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
        res.status(401);
        throw new Error("Not authorized!");
    }

    req.user = user;
    next();
});

export const isAdmin = asyncHandler(async (req, res, next) => {
    if (!req.user.isAdmin) {
        res.status(401);
        throw new Error("Not authorized as an admin!");
    }

    next();
});
