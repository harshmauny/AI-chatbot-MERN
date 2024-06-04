import User from "../models/User.js";
import { Request, Response, NextFunction } from "express";

export const getAllUsers = async (req:Request, res:Response, next:NextFunction) => {
    try{
        const users = await User.find();
        return res.status(200).json({message:"ok",users});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error.message});
    }
    
};

export const userSignup = async (req:Request, res:Response, next:NextFunction) => {
    try{
        const users = await User.find();
        return res.status(200).json({message:"ok",users});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error.message});
    }
    
};