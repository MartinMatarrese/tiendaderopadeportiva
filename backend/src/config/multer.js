import multer from "multer";
import { __dirname } from "../patch.js";

const sotrageUsers = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`);
    },
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/public/img/users`)
    }
});

export const uploadUserPic = multer({storage: sotrageUsers});