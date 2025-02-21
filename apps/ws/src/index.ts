import WebSocket, { WebSocketServer } from "ws";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { JWT_SECRET } from '@repo/backend-common/config'

const wss = new WebSocketServer({ port: 8080 })

interface User {
    userId: string,
    rooms: string[],
    ws: WebSocket
}

const users: User[] = [];

const authenticateUser = (token : string): string | null => {
    try{
        const decoded = jwt.verify(token, JWT_SECRET)
        if(!decoded) {
            throw new Error('Unverfiable token')
        }

        return (decoded as JwtPayload).userId
    } catch (er){
        console.error(er)
        return null;
    }
}

wss.on('connection', (socket, req) => {
    try{
        const url = req.url;
        const queryParams = new URLSearchParams(url?.split('?')[1])
        const token  = queryParams.get('token')
    
        if(!token){
            throw new Error('Please provide a token')
        }

        const userId = authenticateUser(token)
        if(!userId){
            throw new Error('UserId not authenticated')
        }

        // All users would get pushed into a global users array
        users.push({
            userId: userId,
            rooms: [],
            ws: socket
        })

        console.log(`User ${userId} connected`);

        socket.on('close', () => {
            const getUser = users.find(u => u.ws === socket);
            if(!getUser){
                console.error('User not found in active connections')
                return;
            }
            console.log(`User ${getUser.userId} disconnected`);
        });

        socket.on('message', (data) => {
            // ParseData
            const parsedData = JSON.parse(data.toString())

            // Get User
            const getUser = users.find(x => x.ws === socket)
            if(!getUser){
                console.error('User not found in active connections')
                return;
            }
            
            // Functionalities in the room
            if(parsedData.type === 'join_room'){
                if (!parsedData.roomId) {
                    console.error('No roomId provided for join_room');
                    return;
                }
                getUser.rooms.push(parsedData.roomId)
                console.log(`User ${getUser.userId} joined room ${parsedData.roomId}`);
            } else if(parsedData.type === 'leave_room'){
                if (!parsedData.roomId) {
                    console.error('No roomId provided for leave_room');
                    return;
                }
                getUser.rooms = getUser.rooms.filter(x => x !== parsedData.roomId)
                console.log(`User ${getUser.userId} left room ${parsedData.roomId}`);
            } else if(parsedData.type === 'chat'){
                
                if (!parsedData.roomId || !parsedData.message) {
                    console.error('Missing roomId or message for chat');
                    return;
                }

                const roomId = parsedData.roomId
                const message = parsedData.message
                
                if (!getUser.rooms.includes(roomId)) {
                    console.error(`User ${getUser.userId} tried to send to room ${roomId} they haven't joined`);
                    return;
                }

                users.forEach(x => {
                    if(x.rooms.includes(roomId) && x.ws !== socket){
                        x.ws.send(JSON.stringify({
                            type : 'chat',
                            message: message,
                            userId: getUser.userId,
                            roomId: roomId,
                            createdAt: new Date().toISOString()
                        }))
                    }
                })
            }
        })
    } catch(er){
        console.error('Error completing the request. ', er)
        socket.close()
    }
})

console.log("WSS server on 8080")