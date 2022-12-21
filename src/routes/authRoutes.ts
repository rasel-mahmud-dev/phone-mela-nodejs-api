import { Router} from "express";
import passport from "passport"

import controllers from "../controllers";
import {fetchCustomerProfile} from "../controllers/authController";
import {auth} from "../middleware";
import {changeCustomerAccountStatus, getAllCustomers} from "../controllers/userController";

import {createToken} from "../jwt";
import User, {UserType} from "../models/User";

const authRoutes = (app: Router) => {
    app.post("/api/signup", controllers.authController.userRegistration);
    app.post("/api/sign-in", controllers.authController.login);
    app.get("/api/sign-current-user", controllers.authController.loginCurrentUser);

    app.get("/api/auth/customers", auth("ADMIN"), getAllCustomers);

    app.post("/api/auth/change-customer-status", auth("ADMIN"), changeCustomerAccountStatus);

    app.get("/api/auth/customer-profile/:userId", auth(), fetchCustomerProfile);


    app.post("/api/auth/create-payment-intent", controllers.authController.createPaymentIntent)
    app.post("/api/auth/payment", controllers.authController.payment)

    app.get('/api/auth/google', passport.authenticate('google', {session: false, scope: ['profile', 'email']}));

    function errorCallback(res, message){
        return res.redirect(process.env.FRONTEND + `/auth/callback/google?message=${message}`);
    }

    app.get("/api/auth/callback/google", passport.authenticate('google', {session: false}),
        async function (req, res, next) {

            try {

                if (!req.user || !req?.user?.email) {
                    throw new Error("Please Try again with different google account")
                }

                const {username,  email, avatar = "", id = ""} = req.user

                let user = await User.findOne<UserType>({email: email});
                if (!user) {
                    let newUser: any = {
                        role: "CUSTOMER",
                    }
                    if(newUser.avatar) newUser.avatar = avatar
                    if(newUser.first_name) newUser.first_name = username?.split(" ")[0] || ""
                    if(newUser.username) newUser.username = username
                    if(newUser.avatar) newUser.avatar = avatar

                    let doc = await User.updateOne(
                        {email: email},
                        {$set:  newUser },
                        {upsert: true }
                    )

                    if (doc) {
                        let token = await createToken(doc.upsertedId, newUser.email)
                        res.redirect(process.env.FRONTEND + "/auth/callback/google?token=" + token);
                    } else {
                        errorCallback(res, "Your are not register yet")
                    }

                } else {
                    if (user._id) {
                        let token = await createToken(user._id, user.role)
                        res.redirect(process.env.FRONTEND + "/auth/callback/google?token=" + token);
                    } else {
                        errorCallback(res, "Login fail. please try again")
                    }
                }
            } catch (ex) {
                let message = ex?.message
                res.redirect(process.env.FRONTEND + "/auth/callback/google?message=" + message)
            }
        });
};

export default authRoutes