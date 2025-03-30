//Authentication middleware

import { body } from "express-validator";

router.post(
    "/signup",
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Invalid email format"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    ],
    signup
);

router.post(
    "/signin",
    [
        body("email").isEmail().withMessage("Invalid email format"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    signin
);