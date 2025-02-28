"use client"

import { RoomIdSchema } from "@repo/common/schema"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ChatRoomWS from "../../../components/ChatRoomWS"

export default function Page({ params } : {
    params: {
        roomId: string
    }
}){
    const router = useRouter()
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
    const [chats, setChats] = useState([])
    const [validRoomId, setValidRoomId] = useState<string | null>(null)

    useEffect(() => {
        const roomObj = RoomIdSchema.safeParse(params.roomId)
        
        if(!roomObj.success){
            alert('Invalid Room ID')
            router.push('/dashboard')
            return
        }
        
        setValidRoomId(roomObj.data)
        
        const fetchChats = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/chat/${roomObj.data}`)
                setChats(response.data.chats || [])
            } catch (error) {
                console.error("Error fetching chats:", error)
            }
        }

        fetchChats()
    }, [params.roomId, router, BACKEND_URL])

    if (!validRoomId) return <div>Loading...</div>

    return(
        <div>
            On {params.roomId}
            <ChatRoomWS chats={chats} roomId={validRoomId} />
        </div>
    )
}