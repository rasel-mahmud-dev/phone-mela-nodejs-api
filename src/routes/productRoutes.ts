import {Application, Router} from "express";

import controllers from "../controllers"
import {fetchProducts} from "../controllers/productController";
import {auth} from "../middleware";


const productRoutes = (app: Router)=>{
  app.get("/api/products", fetchProducts)

  app.get("/api/product/:id", controllers.productController.fetchProduct)

  app.post("/api/homepage-products", controllers.productController.fetchHomePageProducts)
  app.post("/api/homepage-products/v2", controllers.productController.fetchHomePageProductsV2)
  app.post("/api/top-wishlist-products", controllers.productController.topWishlistProducts)
  
  
  app.post("/api/add-product", auth("ADMIN"), controllers.productController.addProduct)
  app.put("/api/products/update/:productId", auth("ADMIN"), controllers.productController.updateProduct)
  
  app.post("/api/v2/filter-products", controllers.productController.filterProducts)

  app.get("/api/reviews/:productId", controllers.productController.fetchReviews)

  app.post("/api/review", auth("CUSTOMER"), controllers.productController.addReview)
}
export default productRoutes