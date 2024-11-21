import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import { useParams } from "react-router-dom";
import { getCurrentUser } from 'aws-amplify/auth';

type Message = Schema['Message']['type'];
type Forum = Schema['Forum']['type'];
const client = generateClient<Schema>();

export default function Chatroom() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [forum, setForum] = useState<Forum>();
    const { forumId } = useParams<{forumId : string}>()
    if (!forumId) {
        throw new Error("Missing forumId")
    }
    

    useEffect(() => {
        const getData = async () => {
            const { data: forumData } = await client.models.Forum.get({id: forumId})
            if(!forumData) {
                throw new Error("forumData not found")
            }
            await setForum(forumData);
            console.log(forum);
        }
        getData();

        const sub = client.models.Message.observeQuery().subscribe({
            next: ({ items }) => {
                setMessages([...items]);
            },
        });
        return () => sub.unsubscribe();
    }, []);

    const handleNewComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { username } = await getCurrentUser();
        if ((newMessage.trim() !== '') && !(!forum)) {
            const { data: newMessageData } = await client.models.Message.create({
              content: newMessage,
              sender: username,
              forumId: forum.id
            })
    
            console.log(newMessageData)
            setNewMessage('');
        }
      };

    return (
        <div>
            <h2>{}</h2>
            <ul>
                {
                    messages.map((message) => (
                        (message.forumid === forumId) ? (
                            <li key={message.id}>{message.content}</li>
                        ) : (
                            <h2>No messages yet.</h2>
                        )
                    ))
                }
            </ul>
                <form onSubmit={handleNewComment}>
                    <input
                        type="text"
                        placeholder="Send Message..."
                        value={newMessage}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                    />
                    <button type="submit">Comment</button>
                </form>
        </div>
    )
}