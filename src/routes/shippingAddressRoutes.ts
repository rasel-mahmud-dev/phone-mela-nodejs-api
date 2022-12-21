import {Application, Router} from "express";

import controllers from "../controllers"
import {auth} from "../middleware";


const shippingAddressRoutes = (app: Router) => {
    app.get("/api/shipping-addresses", auth("CUSTOMER"), controllers.shippingAddressController.getShippingAddress)
    app.post("/api/shipping-address", auth("CUSTOMER"), controllers.shippingAddressController.addShippingAddress)
}

export default shippingAddressRoutes