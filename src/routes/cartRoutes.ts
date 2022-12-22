import {Application, Router} from "express";

import controllers from "../controllers"
import {auth} from "../middleware";


const cartRoutes = (app: Router)=>{
  app.get("/api/carts",  auth("CUSTOMER", "ADMIN"), controllers.cartController.fetchCartProducts)
  app.post("/api/add-cart", auth("CUSTOMER", "ADMIN"), controllers.cartController.addToCart)
  app.post("/api/remove-cart", auth("CUSTOMER", "ADMIN"), controllers.cartController.removeToCart)
}

export default cartRoutes