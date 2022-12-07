import { Application} from "express";

import authRoutes  from "./authRoutes"
import brandRoutes  from "./brandRoutes"
import cartRoutes  from "./cartRoutes"
import orderRoutes  from "./orderRoutes"
import productRoutes  from "./productRoutes"
import wishlistRoutes  from "./wishlistRoutes"
import shippingAddressRoutes  from "./shippingAddressRoutes"

const routes = (app: Application)=> {
  authRoutes(app)
  brandRoutes(app)
  cartRoutes(app)
  orderRoutes(app)
  productRoutes(app)
  wishlistRoutes(app)
  shippingAddressRoutes(app)
}




export default routes
module.exports = routes
