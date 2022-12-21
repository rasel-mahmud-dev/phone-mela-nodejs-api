
import mongoose from "mongoose";
import {ObjectFlags} from "../types";


export type ShippingAddressType = {
    _id?: string
    customer_id: string
    firstName: string,
    lastName: string,
    phone: number
    post_code: number
    city: string
    state: string
    address: string
    apartment_suit: string
    country: string
    email?: string
    createdAt: Date
    isDefault: boolean
}

const schemaObject: ObjectFlags<ShippingAddressType> = {
    address: String,
    apartment_suit: String,
    city: String,
    country: String,
    createdAt: Date,
    customer_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", index: true},
    firstName: String,
    lastName: String,
    isDefault: {type: Boolean, default: true},
    phone: Number,
    post_code: Number,
    state: String,
    email: String
}

mongoose.model(
    'ShippingAddress',
    new mongoose.Schema(schemaObject, {timestamps: true})
);
