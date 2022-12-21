import mongoose from "mongoose";

import {Request, Response, NextFunction} from "express"
import {ShippingAddressType} from "../models/ShippingAddress";

const ShippingAddress = mongoose.model("ShippingAddress")


export const getShippingAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let docs = await ShippingAddress.find({customer_id: req.auth._id})
        res.status(200).send(docs)
    } catch (ex) {
        next(ex)
    }
}

export const deleteShippingAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let doc = await ShippingAddress.deleteOne({customer_id: req.auth._id, _id: req.params.id})
        if(doc.deletedCount) {
            res.status(201).send("ok")
        }
    } catch (ex) {
        next(ex)
    }
}

export const addShippingAddress = async (req: Request, res: Response, next: NextFunction) => {
    const {
        address,
        apartment_suit,
        city,
        email,
        country,
        customer_id,
        firstName,
        lastName,
        phone,
        post_code,
        state
    } = req.body

    try {

        let o: ShippingAddressType = {
            address: address,
            apartment_suit: apartment_suit,
            city: city,
            email: email,
            country: country,
            createdAt: new Date(),
            customer_id: customer_id,
            firstName,
            lastName,
            isDefault: true,
            phone: phone,
            post_code: post_code,
            state: state
        }

        let newAddress = new ShippingAddress(o)
        let doc = await newAddress.save()
        res.status(201).send(doc)

    } catch (ex) {
        next(ex)
    }

}