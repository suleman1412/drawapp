import express from 'express'

const app = express()
app.use(express.json())

app.post('/signup', (req, res) => {
    const body = req.body;
    console.log(body)
})
app.post('/signin', (req, res) => {
    const body = req.body;
    console.log(body)
})
app.post('/createRoom', (req, res) => {
    const body = req.body;
    console.log(body)
})

app.listen(3001, () => console.log('server on port 3001'))