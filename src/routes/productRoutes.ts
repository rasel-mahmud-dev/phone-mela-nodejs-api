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
  
  
  app.post("/api/add-product", auth("ADMIN", "SELLER"), controllers.productController.addProduct)

  app.put("/api/products/update/:productId", auth("ADMIN", "SELLER"), controllers.productController.updateProduct)

  app.get("/api/product/detail/:productId",  controllers.productController.fetchProductDetail)

  app.post("/api/v2/filter-products", controllers.productController.filterProducts)

  app.get("/api/reviews/:productId", controllers.productController.fetchReviews)

  app.post("/api/review", auth("CUSTOMER", "ADMIN"), controllers.productController.addReview)

  app.post("/api/product/question", auth("CUSTOMER", "ADMIN"), controllers.productController.addQuestion)
  app.get("/api/product/questions/:productId", auth("CUSTOMER", "ADMIN"), controllers.productController.fetchQuestions)
}
export default productRoutes