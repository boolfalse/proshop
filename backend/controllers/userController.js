
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";

const login = asyncHandler(async (req, res) => {
    return res.send("login");
});
const register = asyncHandler(async (req, res) => {
    return res.send("register");
});
const logout = asyncHandler(async (req, res) => {
    return res.send("logout");
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
