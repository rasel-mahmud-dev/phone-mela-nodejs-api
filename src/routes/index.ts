import express from "express";

require("../models")

import authRoutes from "./authRoutes"
import brandRoutes from "./brandRoutes"
import cartRoutes from "./cartRoutes"
import orderRoutes from "./orderRoutes"
import productRoutes from "./productRoutes"
import wishlistRoutes from "./wishlistRoutes"
import shippingAddressRoutes from "./shippingAddressRoutes"

const router = express.Router()


authRoutes(router)
brandRoutes(router)
cartRoutes(router)
orderRoutes(router)
productRoutes(router)
wishlistRoutes(router)
shippingAddressRoutes(router)

export default router
module.exports = router
