import express, { Router } from 'express'
import { JWT_SECRET } from '@repo/backend-common/config'
import { AuthSchema, RoomSchema } from "@repo/common/schema"
import jwt from 'jsonwebtoken'
import { authMiddleware } from './middleware'
import { prismaClient } from '@repo/db/db'
import bcrypt from 'bcrypt'
import { authRouter } from './routes/authRouter';

const app = express()


app.use(express.json())
app.use('/auth', authRouter)


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