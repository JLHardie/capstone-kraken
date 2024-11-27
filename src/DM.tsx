import type {Schema} from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import { useState, useEffect } from 'react';
import { AuthUser, getCurrentUser } from 'aws-amplify/auth';
import { Divider, ScrollView } from '@aws-amplify/ui-react';
import { useParams } from "react-router-dom";


const client = generateClient<Schema>()
type DirectMessage = Schema['DirectMessage']['type'];

export default function DM() {
    const { dmId } = useParams<{dmId : string}>()
    const [messages, setMessages] = useState<DirectMessage[]>([])
    const [user, setUser] = useState<AuthUser | null>(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (err) {
                console.error("Error fetching user:", err);
                setUser(null);
            }
        };

        fetchUser();

        const sub = client.models.DirectMessage.observeQuery().subscribe({
            next: ({items}) => {
                // const filtedMessages = items.filter(
                //     (msg) => msg.sender === user?.userId || msg.recipient === user?.userId
                // )
                const sortedMessages = [...items].sort((a, b) =>
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );
                setMessages(sortedMessages);
            }
            
        })
        return () => sub.unsubscribe();
    })


    return (
        <div>
            <h2>{}</h2>
            <div>
                <ul>
                    <ScrollView height="500px" autoScroll='auto'>
                    {/* {
                        messages.map((message) => (
                            (
                                ( message.sender === dmId ) ||
                                ( message.recipient === dmId)
                            ) ? (
                                <li key={message.id}>
                                    <Divider
                                        size="large"
                                        orientation="horizontal" />
                                    <small>{message.sender}</small>
                                    <p>{message.content}</p>
                                </li>
                            ) : (
                                <h2>No messages yet.</h2>
                            )
                        ))
                    } */}
                    </ScrollView>
                </ul>
            </div>
                {/* <form onSubmit={handleNewComment}>
                    <input
                        type="text"
                        placeholder="Send Message..."
                        value={newMessage}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                    />
                    <button type="submit">Comment</button>
                </form> */}
        </div>
    )
}