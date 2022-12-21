import {Application, Router} from "express";

import controllers from "../controllers"

const brandRoutes = (app: Router)=>{
  
  app.get("/api/brands", controllers.brandController.fetchBrands)
  
}
export default brandRoutes