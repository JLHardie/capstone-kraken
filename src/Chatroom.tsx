import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import { useParams } from "react-router-dom";

type Message = Schema['Message']['type'];
const client = generateClient<Schema>();

export default function Chatroom() {
    const [messages, setMessages] = useState<Message[]>([]);
    const { userId } = useParams<{userId : string}>()
    if (!userId) {
        throw new Error("Missing userId")
    }

    useEffect(() => {
        const sub = client.models.Message.observeQuery().subscribe({
            next: ({ items }) => {
                setMessages([...items]);
            },
        });
        return () => sub.unsubscribe();
    }, []);

    return (
        <div>
            <h2>Chat with: {userId}</h2>
            <ul>
                {
                    messages.map((message) => (
                        <li key={message.id}>{message.content}</li>
                    ))
                }
            </ul>
        </div>
    )
}