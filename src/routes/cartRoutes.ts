import {Application} from "express";

import controllers from "../controllers"
import {auth} from "../middleware";

const cartRoutes = (app: Application)=>{
  app.get("/api/carts", auth, controllers.cartController.fetchCartProducts)
  app.post("/api/add-cart", auth, controllers.cartController.addToCart)
  app.post("/api/remove-cart", auth, controllers.cartController.removeToCart)
}

export default cartRoutes