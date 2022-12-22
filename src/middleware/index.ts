import {getToken, parseToken} from "../jwt";
import {NextFunction, Request, Response} from "express";
import {addProduct} from "../controllers/productController";


export function auth(...roles: string[]) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            let token = getToken(req)
            if (!token) {
                return res.status(404).json({message: "please login first"})
            }
            let data = await parseToken(token)
            if (data && data._id) {
                req.auth = data

                if (!roles || roles.length === 0) {
                    return next()
                }
                if (roles.includes(data.role)) {
                    next()
                } else {
                    res.status(409).json({message: "your are unauthorized"})
                }

            } else {
                res.status(409).json({message: "your are unauthorized"})
            }
        } catch (ex) {
            res.status(409).json({message: "Please login first"})
        }
    }
}