
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && user.matchPassword(password)) {
        const expiresInDays = process.env.JWT_EXPIRES_IN?.split("d")[0] || 30;
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: `${expiresInDays}d`,
        });

        // set JWT as HTTP-only cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * expiresInDays, // 30d
            // expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * expiresInDays), // 30d
        });

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            // token,
        });
    }

    throw new Error("Invalid email or password!");
});
const register = asyncHandler(async (req, res) => {
    return res.send("register");
});
const logout = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        expires: new Date(Date.now() + 10), // 10s
    });

    return res.status(200).json({
        message: "Logged out successfully!",
    });
});

const getProfile = asyncHandler(async (req, res) => {
    return res.send("getProfile");
});
const updateProfile = asyncHandler(async (req, res) => {
    return res.send("updateProfile");
});

const adminGetUsers = asyncHandler(async (req, res) => {
    return res.send("adminGetUsers");
});
const adminDeleteUser = asyncHandler(async (req, res) => {
    return res.send("adminDeleteUser");
});
const adminGetUserById = asyncHandler(async (req, res) => {
    return res.send("adminGetUserById");
});
const adminUpdateUser = asyncHandler(async (req, res) => {
    return res.send("adminUpdateUser");
});

export default {
    login,
    register,
    logout,
    getProfile,
    updateProfile,
    adminGetUsers,
    adminDeleteUser,
    adminGetUserById,
    adminUpdateUser,
};
