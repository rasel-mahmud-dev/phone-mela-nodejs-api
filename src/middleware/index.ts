import {getToken, parseToken} from "../jwt";


export function admin(req, res, next) {

    (async function () {
        try {
            let token = getToken(req)
            if (!token) {
                return res.status(404).json({message: "please login first"})
            }
            let data = await parseToken(token)
            if (data && data.userId) {
                if (data.role === "admin") {
                    req.user = data
                    // req.session.user_id = data.userId
                    // req.session.role = data.userId
                    next()
                } else {
                    res.status(409).json({message: "Your are not admin"})
                }
            } else {
                res.status(409).json({message: "Please login first"})
            }
        } catch (ex) {
            res.status(409).json({message: "Please login first"})
        }
    }())
}

export function auth(...roles: string[]) {
    return async function (req, res, next) {
        try {
            let token = getToken(req)
            if (!token) {
                return res.status(404).json({message: "please login first"})
            }
            let data = await parseToken(token)
            if (data && data.userId) {
                req.user = data

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