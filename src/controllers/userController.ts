import {NextFunction, Request, Response} from "express";

import {RequestWithSession} from "../types";
import User from "../models/User";
import {Types} from "mongoose";
import {ObjectId} from "bson";


export const logout = async (req: RequestWithSession, res: Response, next: NextFunction) => {
    // if(req.session) {
    //   req.session = null
    //   res.status(201).json({message: "You are logout"});
    // }
}


export const getAllCustomers = async (req: RequestWithSession, res: Response, next: NextFunction) => {
    try {
        let users = await User.find({}, "-password")
        res.status(200).send(users)
    } catch (ex) {
        next(ex)
    }

}

export const changeCustomerAccountStatus = async (req: RequestWithSession, res: Response, next: NextFunction) => {
    const {isBlock, customerId} = req.body
    try {
        let doc = await User.updateOne({
            _id: new ObjectId(customerId)
        }, {
            $set: {
                isBlock: isBlock
            }
        })
        if (doc.modifiedCount) {
            res.status(201).send("user updated")
        } else {
            res.status(304).send("")
        }
    } catch (ex) {
        next(ex)
    }

}