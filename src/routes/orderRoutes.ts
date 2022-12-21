import { Router} from "express";

import controllers from "../controllers"
import {auth} from "../middleware";

const orderRoutes = (app: Router) => {

    app.post("/api/create-payment-intent", auth("CUSTOMER"), controllers.paymentController.createPaymentIntent)

    app.post("/api/order", auth("CUSTOMER"), controllers.orderController.createOrder)
    app.get("/api/orders", auth("CUSTOMER"), controllers.orderController.fetchOrders)
    app.get("/api/order/:orderId", auth("CUSTOMER"), controllers.orderController.fetchOrder)


    app.get("/api/orders/transactions", auth("CUSTOMER", "ADMIN"), controllers.orderController.fetchTransactions)

}

export default orderRoutes