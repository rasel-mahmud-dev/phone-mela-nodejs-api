import {Application, Router} from "express";

import controllers from "../controllers"
import {auth} from "../middleware";


const cartRoutes = (app: Router)=>{
  app.get("/api/carts",  auth("CUSTOMER"), controllers.cartController.fetchCartProducts)
  app.post("/api/add-cart", auth("CUSTOMER"), controllers.cartController.addToCart)
  app.post("/api/remove-cart", auth("CUSTOMER"), controllers.cartController.removeToCart)
}

export default cartRoutes