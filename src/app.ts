import express, {NextFunction, Request, Response} from "express";


import  passport from 'passport';

require('dotenv').config()

import path from 'path';


const router = express.Router();




const cors = require("cors");




import routes from "./routes"
import mongoose from "mongoose";


// create all mongodb collection indexes
// initialMongodbIndexes()

// passport config initial...
require('./passport/google')
// require('./passport/facebook.js')

// import dataDir from "../src/utilities/dataDir";
// import {connectToDatabase} from "../src/services/mongodb/database.service";
// import sqlDatabase from "../src/services/sqlite/database.service";


const app = express()


const allowedOrigin = ["http://localhost:4000", "http://localhost:3000"]

const corsOptions = {
    origin: (origin: any[], cb: any)=>{
        if(allowedOrigin.indexOf(origin as any) !== -1){
            cb(null, true)
        } else{
            cb(null, true)
            // cb(new Error("You are Blocked"))
        }
    }
}

app.use(cors(process.env.NODE_ENV !== "development" ? corsOptions : {}))

app.use(passport.initialize())

app.get("/", function (req, res){

    res.write(`<?php

    echo 'Hello, World!';`)

    res.end()
})

app.use(routes)


// error handler
// use route for netlify serverless function
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if(process.env.NODE_ENV === "development"){
        console.log(err)
    }
    if(typeof err === "string") {
        res.status(500).json({message: err})
    } else {
        res.status(err.status || 500).json({
            message: err.message || "Internal server error"
        })
    }
})


let isDev = process.env.NODE_ENV === "development"

const uri = isDev ? "mongodb://127.0.0.1:27017/phone-mela" : process.env.MONGO_DB_URI
mongoose.connect(uri).then(r=>{
    console.log("database connected.")
}).catch(ex=>{
    console.log(ex)
    console.log("database not connect")
})


export default app;
module.exports  = app;


