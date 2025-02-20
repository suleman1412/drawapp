import { Router } from "express";
import { prismaClient } from "@repo/db/db";
import { authMiddleware } from "../middleware";
import { RoomSchema } from "@repo/common/schema";

export const roomRouter: Router = Router()

roomRouter.post('/', authMiddleware, async(req, res) => {
    const { data, success, error } = RoomSchema.safeParse({
        ...req.body,
        ownerId: req.userId
    })
    if (!success && !data){
        res.json({
            error: error
        })
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
})

roomRouter.get('/', authMiddleware, async(req, res) => {
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
        res.json({
            message: "User has no rooms created"
        })
        return;
    }

    res.json({
        message: "Rooms found",
        rooms
    })

})