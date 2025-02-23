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

export const RoomIdSchema = z.string()
    .uuid({ message: "Please enter a valid UUID" })
    .min(36, { message: "UUID must be exactly 36 characters long" })
    .max(36, { message: "UUID must be exactly 36 characters long" });

export type RoomIdSchemaType = z.infer<typeof RoomIdSchema>
export type AuthSchemaType = z.infer<typeof AuthSchema>
export type RoomSchemaType = z.infer<typeof RoomSchema>