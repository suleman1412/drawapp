import express from 'express'
import { JWT_SECRET } from '@repo/backend-common/config'
import { AuthSchema, RoomSchema } from "@repo/common/schema"
import jwt from 'jsonwebtoken'
import { authMiddleware } from './middleware'

const app = express()
app.use(express.json())

app.post('/signup', (req, res) => {
    const { data, success, error } = AuthSchema.safeParse(req.body)
    if(!success){
        res.json({
            error: error
        })
        return;
    }
    res.json({
        message: `Signed up ${data.username} !`
    })
})
app.post('/signin', (req, res) => {
    const { data, success, error } = AuthSchema.safeParse(req.body)
    if(!success){
        res.json({
            error: error
        })
        return;
    }
    // const userId = fetch from db
    const userId = "1"
    const token = jwt.sign({
        userId: userId
    } , JWT_SECRET)
    
    req.headers['authorization'] = token
    
    res.json({
        message: `Signed in ${data.username} !`,
        token: token
    })
})
app.post('/createRoom', authMiddleware, (req, res) => {
    const { data, success, error } = RoomSchema.safeParse({
        ...req.body,
        // @ts-ignore
        userId: req.userId
    })
    if (!success){
        res.json({
            error: error
        })
        return;
    }

    res.status(200).json({
        // @ts-ignore
        message: `Room created for ${req.userId} : ${req.body}` 
    })
})

app.listen(3001, () => console.log('server on port 3001'))