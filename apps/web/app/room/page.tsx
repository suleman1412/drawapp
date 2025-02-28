"use client"
import axios from "axios"
import { useEffect, useState } from "react"

export default function GetRooms() {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/room`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                setRooms(response.data.rooms);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();
    }, []);

    return (
        <div>
            Fetch all rooms of the current user
            {rooms.map((data, index) => (
                <div key={index}>
                    {data.roomId}
                </div>
            ))}
        </div>
    );
}