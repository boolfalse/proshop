
import jwt from "jsonwebtoken";

export const generateToken = (res, userId) => {
    const expiresInDays = process.env.JWT_EXPIRES_IN?.split("d")[0] || 30;
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
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
}
