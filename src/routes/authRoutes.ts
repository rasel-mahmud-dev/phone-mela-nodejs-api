import {Application} from "express";
import passport from "passport"

import controllers from "../controllers";
import {fetchCustomerProfile} from "../controllers/authController";
import {auth} from "../middleware";
import {changeCustomerAccountStatus, getAllCustomers} from "../controllers/userController";
import {throws} from "assert";

const authRoutes = (app: Application) => {
    app.post("/api/signup", controllers.authController.userRegistration);
    app.post("/api/sign-in", controllers.authController.login);
    app.get("/api/sign-current-user", controllers.authController.loginCurrentUser);

    app.get("/api/auth/customers", auth("ADMIN"), getAllCustomers);

    app.post("/api/auth/change-customer-status", auth("ADMIN"), changeCustomerAccountStatus);

    app.get("/api/auth/customer-profile/:userId", auth(), fetchCustomerProfile);


    app.post("/api/auth/create-payment-intent", controllers.authController.createPaymentIntent)
    app.post("/api/auth/payment", controllers.authController.payment)

    app.get('/api/auth/google', passport.authenticate('google', {session: false, scope: ['profile',  'email']}));

    app.get("/api/auth/callback/google", passport.authenticate('google', {session: false}),
        function (req, res, next) {

            try {

                // if(req.user.email){
                    throw new Error("Please Try again with different google account")
                // }


            } catch (ex){
                let message = ex?.message
                res.redirect(process.env.FRONTEND+ "/auth/callback/google?message="+message)
                // next(ex)
            }
        });
};

export default authRoutes