import { AuthSchema } from "@repo/common/schema";
import { Router } from "express";
import bcrypt from 'bcrypt'
import { prismaClient } from "@repo/db/db";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "@repo/backend-common/config";

export const authRouter: Router = Router()

authRouter.post('/signup', async (req, res) => {
    try{
        const { data, success, error } = AuthSchema.safeParse(req.body)
        if(!success && !data){
            throw new Error('Zod Error')
        }
        const hashedPassword = await bcrypt.hash(data.password, 5)
        const user = await prismaClient.user.create({
            data: {
                username: data.username,
                password: hashedPassword
            }
        })

        res.status(201).json({
            message: `Signed up ${data.username}, User added to DB !`,
            userId: user.id
        })
    } catch(err){
        console.error("Error creating user:", err);
        res.status(500).json({
            message: "Failed to create user",
            error: err
        });
    }
})
authRouter.post('/signin', async (req, res) => {
    const { data, success, error } = AuthSchema.safeParse(req.body)
    if(!success){
        res.json({
            error: error
        })
        return;
    }
    try{
        const user = await prismaClient.user.findUnique({
            where: {
                username: data.username
            }
        })

        if(!user){
            res.status(401).json({
                message: "User doesn't exist"
            })
            return;
        }

        const match = await bcrypt.compare(data.password, user.password)
        if(!match){
            res.status(401).json({
                message: "Incorrect password"
            })
            return;
        }

        const token = jwt.sign({
            userId: user.id
        }, JWT_SECRET)

        res.json({
            message: `Signed in ${data.username} !`,
            token: token
        })
        
    } catch(err){
        console.error("Error signing up:", err);
        res.status(500).json({
            message: "Failed to sign in",
            error: err
        });
    }
})