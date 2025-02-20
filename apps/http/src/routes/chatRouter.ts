import { prismaClient } from "@repo/db/db";
import { Router } from "express";

export const chatRouter: Router = Router()

chatRouter.get('/:roomId', async(req, res) => {
    const { roomId } = req.params;
    try{
        const chats = await prismaClient.chat.findMany({
            where: { roomId: roomId },
            select: {
                message: true,
                user: { select: { username: true } },
                room: { select: { roomName: true }},
                createdAt: true,
            },
            orderBy: { createdAt: 'asc' }
        })
    
        if(chats.length === 0){
            res.json({
                message: `No chats found for this room ${roomId}`,
                chats
            })
            return;
        }
    
        res.json({
            message: `Chats for room ${roomId}`,
            chats
        })
    } catch(err){
        res.status(500).json({ message: "Error fetching chats", error: err });
        return;
    }
    
})