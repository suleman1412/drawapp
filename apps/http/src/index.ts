import express from 'express'
import { authRouter } from './routes/authRouter';
import { roomRouter } from './routes/roomRouter'

const app = express()
const PORT = process.env.PORT || 3001
app.use(express.json())

app.use('/auth', authRouter)
app.use('/room', roomRouter)


app.listen(PORT, () => console.log(`server on port ${PORT}`))