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
            res.status(400).json({
                message: "Validation error",
                error: error.errors, 
            });
            return;
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
    try{
        const { data, success, error } = AuthSchema.safeParse(req.body)
        if(!success && !data){
            res.status(400).json({
                message: "Validation error",
                error: error.errors,
            });
            return;
        }
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

        res.status(201).json({
            message: `Signed in ${data.username} !`,
            token: token
        })

    } catch(err){
        console.error("Error creating user:", err);
        res.status(500).json({
            message: "Failed to create user",
            error: err instanceof Error ? err.message : "Internal server error", 
        });
    }
})