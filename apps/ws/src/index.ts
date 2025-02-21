import WebSocket, { WebSocketServer } from 'ws';
import { JWT_SECRET } from '@repo/backend-common/config'
import jwt from 'jsonwebtoken'

const wss = new WebSocketServer({ port: 8080 })

interface User{
    userId: string,
    rooms: string[],
    ws: WebSocket
}

const users: User[] = []

const authenticateUser = (token: string): string | null => {
    try{
        const decoded = jwt.verify(token, JWT_SECRET)
        if(!decoded || typeof decoded === 'string'){
            throw Error("Invalid token")
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

    const userId = authenticateUser(token)
    if(!userId){
        socket.close()
        return
    }
    users.push({
        userId,
        rooms: [],
        ws: socket
    })

    socket.on('message', (data) => {
        const parsedData = JSON.parse((data.toString()))
        if(parsedData.type === 'join_room'){
            const user = users.find(x => x.ws === socket)
            user?.rooms.push(parsedData.roomId)
            console.log(users)
        }

        if(parsedData.type === 'leave_room'){
            const user = users.find(x => x.ws === socket)
            if(!user){
                return;
            }
            user.rooms = user?.rooms.filter(x => x === parsedData.roomId)
        }


        if (parsedData.type === 'chat'){
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            users.forEach(user => {
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        message: message,
                        roomId 
                    }))
                }
            })
        }
    })
   

})