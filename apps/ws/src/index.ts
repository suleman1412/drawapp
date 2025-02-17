import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', (socket) => {
    
    // on error close the port
    socket.on('error', (err) => {
        console.error(err)
        socket.close()
    })

    // On any message, send back 'pong'
    socket.on('message', () => {
        socket.send('pong')
    })
})