import {Application, Router} from "express";

import controllers from "../controllers"
import {auth} from "../middleware";

const orderRoutes = (app: Router)=>{
  
  app.post("/api/order", auth("CUSTOMER"), controllers.orderController.createOrder)
  app.get("/api/orders", auth("CUSTOMER"), controllers.orderController.fetchOrders)
  app.get("/api/order/:orderId", auth("CUSTOMER"), controllers.orderController.fetchOrder)

}

export default orderRoutes