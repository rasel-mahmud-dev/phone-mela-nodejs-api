import {Application, Router} from "express";

import controllers from "../controllers"
import {auth} from "../middleware";


const shippingAddressRoutes = (app: Router) => {
    app.get("/api/shipping-addresses", auth("CUSTOMER", "ADMIN"), controllers.shippingAddressController.getShippingAddress)
    app.post("/api/shipping-address", auth("CUSTOMER", "ADMIN"), controllers.shippingAddressController.addShippingAddress)
    app.delete("/api/shipping-address/:id", auth("CUSTOMER", "ADMIN"), controllers.shippingAddressController.deleteShippingAddress)
}

export default shippingAddressRoutes