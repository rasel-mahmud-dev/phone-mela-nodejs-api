import mongoose, {Schema} from "mongoose";
import {ObjectFlags} from "../types";

type ProductDetailsType = {
    _id?: string
    productId: string
    detail: object
    description: string
    highlights: string
    ram: string
    storage: string
    questions: [],
    colors: string
}


const schemaObject: ObjectFlags<ProductDetailsType> = {
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        unique: true,
        index: true
    },
    questions: [new Schema({
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        question: String, answer: String, createdAt: Date
    })],
    detail: Object,
    highlights: Array,
    description: String,
    ram: Array,
    storage: Array,
    colors: Array,
}

export default mongoose.model('ProductDetail', new mongoose.Schema(schemaObject, {timestamps: true}));
