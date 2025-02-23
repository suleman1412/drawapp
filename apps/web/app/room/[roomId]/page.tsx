"use client"

import { RoomIdSchema } from "@repo/common/schema"
import { useRouter } from "next/navigation"

export default function Page({ params } : {
    params: {
        roomId: string
    }
}){
    const roomId = RoomIdSchema.safeParse(params.roomId)
    const router = useRouter()
    if(!roomId.success && !roomId.data){
        alert('Invalid Room ID')
        router.push('/dashboard')
        return;
    }
    

    return(
        <div>
            On {params.roomId}
        </div>
    )
}