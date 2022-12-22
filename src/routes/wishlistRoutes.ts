import {Application, Router} from "express";

import controllers from "../controllers"
import {auth} from "../middleware";

const wishlistRoutes = (app: Router)=>{
  
  app.get("/api/wishlist", auth("CUSTOMER", "ADMIN"), controllers.wishlistController.fetchWishlistProducts)
  app.post("/api/add-wishlist", auth("CUSTOMER", "ADMIN"), controllers.wishlistController.addToWishlist)
  
  app.post("/api/remove-wishlist", auth("CUSTOMER", "ADMIN"), controllers.wishlistController.removeToWishlist)
}

export default wishlistRoutes