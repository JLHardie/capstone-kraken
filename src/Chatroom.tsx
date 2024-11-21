import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import { useParams } from "react-router-dom";

type Message = Schema['Message']['type'];
type Forum = Schema['Forum']['type'];
const client = generateClient<Schema>();

export default function Chatroom() {
    const [messages, setMessages] = useState<Message[]>([]);
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
        </div>
    )
}