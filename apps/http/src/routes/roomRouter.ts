import { Router } from "express";
import { prismaClient } from "@repo/db/db";
import { authMiddleware } from "../middleware";
import { RoomSchema } from "@repo/common/schema";

export const roomRouter: Router = Router()

roomRouter.post('/', authMiddleware, async(req, res) => {
    try{
        const { data, success, error } = RoomSchema.safeParse({
            ...req.body,
            ownerId: req.userId
        })
        if (!success && !data){
            res.status(400).json({
                message: "Validation error",
                error: error.errors, 
            });
            return;
        }

        const room = await prismaClient.room.create({
            data: {
                roomName: data.roomName,
                ownerId: data.ownerId
            }
        })
    
        res.status(200).json({
            message: "Room created",
            data: {
                ownerId: data.ownerId,
                roomId: room.roomId
            }
        })
    } catch(e){
        console.error(e)
        res.status(500).json({
            message: "Internal Server Error",
            error: e
        })
    }
})

roomRouter.get('/', authMiddleware, async(req, res) => {
    try{
        console.log('get')
        const rooms = await prismaClient.room.findMany({
            where: { 
                ownerId: req.userId
            },
            select: {
                roomName: true,
                roomId: true
            }
        })
    
        if(!rooms){
            res.status(404).json({
                message: "User has no rooms created"
            })
            return;
        }
    
        res.status(200).json({
            message: "Rooms found",
            rooms
        })
    } catch(e){
        console.error(e)
        res.status(500).json({
            message: "Internal Server Error",
            error: e
        })
    }

})