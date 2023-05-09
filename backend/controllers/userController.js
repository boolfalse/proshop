
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import { generateToken } from "../utils/token.js";

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
        await generateToken(res, user._id);

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            // token,
        });
    }

    res.status(401);
    throw new Error("Invalid email or password!");
});
const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists!");
    }

    const user = await User.create({
        name,
        email,
        password, // hashed in userModel.js
    });
    await generateToken(res, user._id);

    return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        // token,
    });
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
    const user = await User.findById(req.user._id);

    if (user) {
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    }

    res.status(404);
    throw new Error("User not found!");
});
const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        // fields to update
        user.name = req.body.name || user.name;
        user.password = req.body.password || user.password;

        const updatedUser = await user.save();

        return res.status(201).json({
            _id: user._id,
            email: user.email,
            isAdmin: user.isAdmin,
            // updated fields
            name: updatedUser.name,
        });
    }

    res.status(404);
    throw new Error("User not found!");
});

const adminGetUsers = asyncHandler(async (req, res) => {
    const users = await User.find({
        // isAdmin: false,
    });

    return res.status(200).json(users);
});
const adminDeleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (user && !user.isAdmin) {
        await User.deleteOne({ _id: userId })
        return res.status(200).json({ message: 'User deleted.' });
    }

    res.status(404);
    throw new Error('Resource not found!');
});
const adminGetUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');
    if (user) {
        return res.status(200).json(user);
    }

    res.status(404);
    throw new Error('Resource not found!');
});
const adminUpdateUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (user && !user.isAdmin) {
        // fields to update
        user.name = req.body.name || user.name;

        const updatedUser = await user.save();

        return res.status(201).json({
            _id: updatedUser._id,
            // updated fields
            name: updatedUser.name,
        });
    }

    res.status(404);
    throw new Error('Resource not found!');
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
