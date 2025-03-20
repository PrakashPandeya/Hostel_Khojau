

import User from "../models/user.model.js";

import bcrypt from "bcryptjs";
import { generateToken } from "../utils/utils.js";


export const signup = async (req, res) => {

    try {
        const { name, email, password, role } = req.body;

        // find user by email for  uniqueness 
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "user already exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // hash password    
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user 
        const newUser = new User({ name, email, password: hashedPassword, role });
        console.log(newUser);
        if (newUser) {
            // generate json web token 
            generateToken(newUser._id, res);
            await newUser.save();
        }

        // sucess message
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        // Error message
        res.status(500).json({ message: "Error signing up", error: error.message });
    }
}
export const signin = async (req, res) => {

    try {
        const { email, password } = req.body;

        // find user by name
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare entered password with stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        generateToken(user._id, res);
        // Successful authentication
        res.status(200).json({ message: "Signin successful", user });
    } catch (error) {
        res.status(500).json({ message: "Error signing in", error: error.message });
    }
}

export const signout = async (_, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.json({ message: "User sucessfully logged out" })

    } catch (error) {
        console.log("internal error")
        res.status(500).json({ message: "Internal server error" })
    }
}

export const updateProfile = async (_, res) => {
    res.send("Profile updated")
}