import {NextFunction, Request, Response} from "express";

import {RequestWithSession} from "../types";
import User from "../models/User";


export const logout = async (req: RequestWithSession, res: Response, next: NextFunction) => {
    // if(req.session) {
    //   req.session = null
    //   res.status(201).json({message: "You are logout"});
    // }
}


export const getAllCustomers = async (req: RequestWithSession, res: Response, next: NextFunction) => {
    try {
        let users = await User.find({}, "-password")
        res.send(users)
    } catch (ex) {
        next(ex)
    }

}