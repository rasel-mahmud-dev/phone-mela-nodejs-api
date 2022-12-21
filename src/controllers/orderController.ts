import {  OrderType, paymentType } from "../models/Order";
import mongoose from "mongoose";
import {NextFunction, Request, Response} from "express";
import uuid from "../utils/uuid";

const Order = mongoose.model("Order");
const Transaction = mongoose.model("Transaction");

interface OrderResponseType {
    order_id: string;
    product_id: string;
    customer_id: string;
    price: string;
    quantity: string;
    delivery_date: string;
    created_at: string;
    status_id: string;
    order_status: string;
    title: string;
}

export const fetchOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const o: any = await Order.find({ customer_id: req.auth._id }).populate("product_id", "title cover");
        res.send(o);
    } catch (ex) {
        next(ex)
    }
};


export const fetchTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let filter: {} = { customer_id: req.auth._id }
        if(req.auth.role === "ADMIN"){
            filter = {}
        }
        const o: any = await Transaction.find(filter)
        res.send(o);
    } catch (ex) {
        next(ex)
    }
};



export const fetchOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;


    try {
        const o: any = await Order.findOne({ orderId: Number(orderId), customerId: req.auth._id })
            .populate("shipping_id");
        res.send(o);

    } catch (ex) {
        next(ex)
    }
};



interface CreateBody {

    customer_id: string;
    delivery_date: Date;
    payment_method: paymentType;
    totalPrice: number;
    name: string;
    products: any[];
    product_id: string;
    quantity: number;
    shipper_id: string;
    shipping_id: string;
    description: string

}

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    let doc;
    try {
        const {

            name,
            products,
            delivery_date,
            payment_method,
            totalPrice,
            product_id = "000000000000000000000000",
            quantity,
            transactionId,
            description,
            shipper_id,
            shipping_id,
        } = req.body;

        const order: OrderType = {
            customerId: req.auth._id,
            delivery_date,
            description,
            orderId: Number(uuid(6)),
            transactionId,
            name,
            products,
            payment_method,
            price: totalPrice,
            product_id,
            quantity,
            shipper_id,
            shipping_id,
            order_status: "pending",
        };
        doc = new Order(order);
        doc = await doc.save();
        if(doc) {
            if(transactionId) {
                let newTransaction = new Transaction({
                    order_id: doc._id,
                    transactionId: transactionId,
                    customerId: req.auth._id,
                    price: totalPrice,
                })

                let result = await newTransaction.save()
                if (!result) {
                    throw Error("Order fail")
                }
            }
            res.status(201).json({
                _id: doc._id,
                orderId: order.orderId
            });

        } else {
            next(Error("Order create fail"))
        }
    } catch (ex) {
        if(doc && doc._id){
            Order.deleteOne({_id: doc._id})
        }
        next(ex)
    }
};

