import express from 'express'
import { JWT_SECRET } from '@repo/backend-common/config'
import { AuthSchema, RoomSchema } from "@repo/common/schema"
import jwt from 'jsonwebtoken'
import { authMiddleware } from './middleware'
import { prismaClient } from '@repo/db/db'
import bcrypt from 'bcrypt'

const app = express()
app.use(express.json())

app.post('/signup', async (req, res) => {
    const { data, success, error } = AuthSchema.safeParse(req.body)
    if(!success && !data){
        res.json({
            error: error
        })
        return;
    }
    try{
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
app.post('/signin', async (req, res) => {
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
app.post('/createRoom', authMiddleware, async(req, res) => {
    const { data, success, error } = RoomSchema.safeParse({
        ...req.body,
        // @ts-ignore
        ownerId: req.userId
    })
    if (!success && !data){
        res.json({
            error: error
        })
        return;
    }
    const room = await prismaClient.room.create({
        data: {
            roomName: data.roomName,
            ownerId: data.ownerId
        }
    })

    res.status(200).json({
        message: "Room created",
        data: {
            ownerId: data.ownerId,
            roomId: room.roomId
        }
    })
})


app.listen(3001, () => console.log('server on port 3001'))