import { RoomIdSchema } from "@repo/common/schema";
import { prismaClient } from "@repo/db/db";
import { Router } from "express";
import { authMiddleware } from "../middleware";

export const chatRouter: Router = Router()

chatRouter.get('/:roomId', async(req, res) => {
    try{
        const roomId = RoomIdSchema.safeParse(req.params);
        if(!roomId.success && !roomId.data){
            res.status(400).json({
                message: "Not a valid roomId",
                error: roomId.error.errors,
            });
            return;
        }
        
        const chats = await prismaClient.chat.findMany({
            where: { roomId: roomId.data },
            orderBy: { createdAt: 'desc' },
            take: 50
        })
    
        if(chats.length === 0){
            res.json({
                message: `No chats found for this room ${roomId.data}`,
                chats
            })
            return;
        }
    
        res.json({
            message: `Chats for room ${roomId.data}`,
            chats
        })
    } catch(err){
        res.status(500).json({ message: "Error fetching chats", error: err });
        return;
    }
    
})