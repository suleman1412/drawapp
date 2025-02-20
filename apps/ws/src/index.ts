import { WebSocketServer } from 'ws';
import { JWT_SECRET } from '@repo/backend-common/config'
import jwt from 'jsonwebtoken'

const wss = new WebSocketServer({ port: 8080 })

const checkUser = (token: string): string | null => {
    try{
        const decoded = jwt.verify(token, JWT_SECRET)
        if(!decoded || typeof decoded === 'string'){
            console.log("Invalid token")
            return null;
        }
        
        return decoded.userId
    } catch(err){
        console.error(err)
        return null;
    }
}


wss.on('connection', (socket, req) => {
    // on error close the port
    socket.on('error', (err) => {
        console.error(err)
        socket.close()
    })

    // Token in the URL
    const url = req.url;
    if(!url){
        console.log('no url')
        socket.close()
        return;
    }
    
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token')
    if(!token){
        console.log('token not provided')
        socket.close()
        return null;
    }
    const userId = checkUser(token)
    if(!userId){
        socket.close()
    }
    
   
    // On any message, send back 'pong'
    socket.on('message', (message) => {
        socket.send(message.toString())
    })
})