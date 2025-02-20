import express, { Router } from 'express'
import { JWT_SECRET } from '@repo/backend-common/config'
import { AuthSchema, RoomSchema } from "@repo/common/schema"
import jwt from 'jsonwebtoken'
import { authMiddleware } from './middleware'
import { prismaClient } from '@repo/db/db'
import bcrypt from 'bcrypt'
import { authRouter } from './routes/authRouter';
import { roomRouter } from './routes/roomRouter'

const app = express()
const PORT = process.env.PORT || 3001
app.use(express.json())

app.use('/auth', authRouter)
app.use('/room', roomRouter)


app.listen(PORT, () => console.log(`server on port ${PORT}`))