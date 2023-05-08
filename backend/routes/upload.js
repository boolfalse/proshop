
import {isAdmin, isAuth} from "../middleware/authMiddleware.js";
import express from 'express';
import multer from 'multer';
import path from "path";
const router = express.Router();

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            const fieldName = file.fieldname;
            const date = Date.now();
            const extension = path.extname(file.originalname); // .jpg, .png, .jpeg
            cb(null, `${fieldName}-${date}${extension}`);
        },
    }),
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpg|jpeg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb({ error: 'Available formats: jpg|jpeg|png' });
        }
    }
});

router.post('/', isAuth, isAdmin, upload.single('image'), async (req, res) => {
    return res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        image: `/${req.file.path}`,
    });
});

export default router;
