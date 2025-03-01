import express from 'express'
import { authRouter } from './routes/authRouter';
import { roomRouter } from './routes/roomRouter'
import { chatRouter } from './routes/chatRouter';
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001
app.use(express.json())
app.use(cors({
    origin: ['http://localhost:3000']
}))

app.use('/auth', authRouter)
app.use('/room', roomRouter)
app.use('/chat', chatRouter)


app.listen(PORT, () => console.log(`server on port ${PORT}`))