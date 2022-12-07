import { Application } from "express";

import controllers from "../controllers";
import { fetchCustomerProfile } from "../controllers/authController";
import { auth } from "../middleware";
import {getAllCustomers} from "../controllers/userController";

const authRoutes = (app: Application) => {
    app.post("/api/signup", controllers.authController.userRegistration);
    app.post("/api/sign-in", controllers.authController.login);
    app.get("/api/sign-current-user", controllers.authController.loginCurrentUser);

    app.get("/api/auth/customers", auth(), getAllCustomers);

    app.get("/api/auth/customer-profile/:userId", auth(), fetchCustomerProfile);


    app.post("/api/auth/create-payment-intent",controllers.authController.createPaymentIntent)
    app.post("/api/auth/payment",controllers.authController.payment)
};

export default authRoutes