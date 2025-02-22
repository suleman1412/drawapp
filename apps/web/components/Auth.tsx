"use client";
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Auth({ page }: {
    page: "signin" | "signup"
}){
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001'
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault()
        const response = await axios.post(`${BACKEND_URL}/auth/${page}`, {
            username,
            password
        })

        if(page === 'signin'){
            const token = await response.data.token
            localStorage.setItem('token', token)
            router.push('/dashboard')
            return;
        }

        router.push('/signin')


    }
    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <input type="submit"></input>
            </form>
        </div>
    )
}