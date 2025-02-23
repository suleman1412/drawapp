import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'

export function authMiddleware(req:Request, res:Response, next:NextFunction){
    try{
        const token = req.headers['authorization'] || null

        if(!token){
            res.status(401).json({
                message: "Unauthorized"
            })
            throw new Error('Unauthorized')
        }
        const decoded = jwt.verify(token, JWT_SECRET)
        
        if(!decoded){
            res.status(403).json({
                message: "Unauthorized user"
            })
        }

        req.userId = (decoded as JwtPayload).userId
        console.log(req.userId)
        next()

    } catch(e){
        // console.error(e)
    }
}