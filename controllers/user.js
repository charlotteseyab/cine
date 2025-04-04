import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { loginSchema, registerSchema, updateUserSchema } from "../validators/user.js";

export const register = async (req, res, next) => {
    const { value, error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(422).json({ error: "Validation Failed", details: error.details });
    }

    const { name, email, password, role } = value;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });

        const savedUser = await newUser.save();
       
        const token = jwt.sign(
            { 
                userId: savedUser._id
            }, 
             process.env.JWT_SECRET, 
            { 
                expiresIn: "1h" 
            }
        );

        return res.status(201).json({
            message: "User registered successfully",
            user: savedUser,
            token,
        });
    } catch (error) {
        next();
    }
};

export const login = async (req, res, next) => {
    const { value, error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(422).json({ error: "Validation Failed", details: error.details });
    }

    const { email, password } = value;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                userId: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

        return res.status(200).json({
            message: "User logged in successfully",
            user,
            token,
        });
    } catch (error) {
        next();
    }
};

export const updateProfile = async(req, res, next) => {
    try {
       const {error, value} = updateUserSchema.validate({
        ...req.body,
        avatar:req.file?.filename
       });
       if (error) {
        return res.status(422).json({ error: "Validation Failed", details: error.details });
       }
       const oldUser = await User.findById(req.user._id);
       if (!oldUser) {
        return res.status(404).json({ error: "User not found" });
       }
       const user = await User.findByIdAndUpdate(req.user._id, value, {
        new: true,
        runValidators: true,
       });
       if (!user) {
        return res.status(404).json({ error: "User not found" });
       }
       const response = {
        token,
        user,
       };
         return res.status(200).json({
          message: "User updated successfully",
          user: response,
         });
    } catch (error) {
        next(error);
        
    }
}