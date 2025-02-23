"use client"
import axios from "axios"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { RoomIdSchema } from '@repo/common/schema'

export default function Home () {
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001'
    const [roomName, setRoomName] = useState('')
    const router = useRouter()
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try{
            const response = await axios.post(`${BACKEND_URL}/room`, {
                roomName
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            })

            const roomId = response.data.data.roomId
            router.push(`/room/${roomId}`)
        } catch(e){
            console.error(e)
        }
    }
    return (
        <div>
            Create Room
            <form onSubmit={handleSubmit}>
                <input placeholder="Room Name" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                <input type="submit" />
            </form>
            
        </div>
    )
}