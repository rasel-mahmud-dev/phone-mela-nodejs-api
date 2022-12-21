import {ObjectFlags} from "../types";
import mongoose from "mongoose";

export interface TransactionType {
    order_id: string,
    transactionId: string,
    customerId: string,
    price,
}

const schemaObject: ObjectFlags<TransactionType> = {
    price: Number,
    transactionId: String,
    order_id: {type: mongoose.Schema.Types.ObjectId, ref: "Order"},
    customerId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
}

mongoose.model('Transaction', new mongoose.Schema(schemaObject, {timestamps: true}));
