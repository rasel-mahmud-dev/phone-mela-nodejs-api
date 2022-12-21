import mongoose from "mongoose";
import {Request, Response, NextFunction} from "express";
import {ObjectId} from "bson";
import {WishListType} from "../models/WishList";


interface WishlistResponse {
    _id: string
    customer_id: string
    product_id: string
    quantity: number
    createdAt: Date
    updatedAt: Date
    cover: string
    title: string
    price: number
}

const Wishlist = mongoose.model("Wishlist")

export const fetchWishlistProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let c: WishlistResponse[] = await Wishlist.aggregate([
            {$match: {customer_id: new ObjectId(req.auth._id)},},
            {
                $lookup: {
                    "from": "products",
                    "localField": "product_id",
                    "foreignField": "_id",
                    "as": "product"
                }
            },
            {$unwind: {path: "$product", preserveNullAndEmptyArrays: true}},
            // or
            {
                $addFields: {
                    cover: "$product.cover",
                    title: "$product.title",
                    price: "$product.price",
                },
            },
            {$unset: "product"}
        ])
        res.status(200).send(c)
    } catch (ex) {
        next(ex)
    }
}


export const addToWishlist = async (req: Request, res: Response, next: NextFunction) => {

    const {product_id} = req.body

    let c: WishListType = {
        customer_id: req.auth._id,
        product_id: product_id
    }

    let newWishlist = new Wishlist(c)
    try {
        newWishlist = await newWishlist.save()
        res.status(201).json({
            _id: newWishlist._id
        })
    } catch (ex) {
        res.status(500).send("internal Server error")
    }
}


export const removeToWishlist = async (req: Request, res: Response, next: NextFunction) => {
    const {wishlist_id} = req.body
    try {
        let isRemove = await Wishlist.deleteOne({ customer_id: req.auth._id, _id: wishlist_id})
        if (isRemove.deletedCount > 0) {
            return res.status(201).json({
                _id: wishlist_id
            })
        }

        res.status(404).json({message: "Product not found"})

    } catch (ex) {
        res.status(500).send("internal Server error")
    }
}