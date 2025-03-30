import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/utils.js";
import { validationResult, body } from "express-validator";

// User Signup
export const signup = async (req, res) => {
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        // Generate token and send response
        const token = generateToken(newUser._id);
        res.status(201).json({ message: "User registered successfully", token, user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error signing up", error: error.message });
    }
};

// User Signin
export const signin = async (req, res) => {
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate token and send response
        const token = generateToken(user._id);
        res.status(200).json({ message: "Signin successful", token, user });
    } catch (error) {
        res.status(500).json({ message: "Error signing in", error: error.message });
    }
};

// User Signout
export const signout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "User successfully logged out" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Update Profile (Placeholder)
export const updateProfile = async (req, res) => {
    try {
        // Add logic for updating user profile
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

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