import { z } from 'zod'

export const AuthSchema = z.object({
    username: z
        .string()
        .min(3, {message: "Username has to be minimum of 3 letters"})
        .max(10, {message: "Username has to be maximum of 10 letters"}),
    password: z
        .string()
        .min(5, {message: "Password has to be minimum of 5 letters"})
        .max(12, {message: "Password has to be maximum of 20 letters"})
})

export const RoomSchema = z.object({
    roomName: z.string(),
    ownerId: z.number().int().positive()
})