import {Application, Router} from "express";

import controllers from "../controllers"
import {auth} from "../middleware";

const wishlistRoutes = (app: Router)=>{
  
  app.get("/api/wishlist", auth("CUSTOMER"), controllers.wishlistController.fetchWishlistProducts)
  app.post("/api/add-wishlist", auth("CUSTOMER"), controllers.wishlistController.addToWishlist)
  
  app.post("/api/remove-wishlist", auth("CUSTOMER"), controllers.wishlistController.removeToWishlist)
}

export default wishlistRoutes