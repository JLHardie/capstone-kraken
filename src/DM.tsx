import type {Schema} from '../amplify/data/resource';
import { generateClient, SelectionSet } from 'aws-amplify/data';
import { useState, useEffect } from 'react';
import { Divider, ScrollView } from '@aws-amplify/ui-react';
import { useParams } from "react-router-dom";
import { getCurrentUser } from 'aws-amplify/auth';


const client = generateClient<Schema>()
const selectionSet = ['content', 'createdAt', 'id',
    'senderId', 'sender.username', 'sender.id'
] as const
type DirectMessage = Schema['DirectMessage']['type'];
type MessageWithUser = SelectionSet<DirectMessage, typeof selectionSet>;
//type User = Schema['User']['type'];

export default function DM() {
    
    const { dmId } = useParams<{dmId : string}>()
    const [messages, setMessages] = useState<MessageWithUser[]>([]);
    const [newMessage, setNewMessage] = useState('');
    //const [user, setUser] = useState<User | null>(null);
    const [loaded, setLoaded] = useState<boolean>();

    useEffect(() => {
        
        // getCurrentUser().then(async (result) => {
        //     const {data: userData} = await client.models.User.get({
        //         id: result.userId
        //     });
        //     setUser(userData)
        //     setLoaded(true);
        // })

        const getMessages = async () => {
            const {data: messageData} = await client.models.DirectMessage.list({
                selectionSet,
                filter: {chatId: {eq: dmId}},
            })
            const sortedMessages = messageData.sort((a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            )
            setMessages(sortedMessages);
            setLoaded(true);
        }
        getMessages();

        const messageSub = client.models.DirectMessage.onCreate().subscribe({
            next: () => getMessages()
        });

        return () => messageSub.unsubscribe();
    }, [])

    const handleNewMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { signInDetails } = await getCurrentUser();
        const loginId = signInDetails?.loginId

        if(!dmId || !loginId) {
            throw new Error("AAAAAAAAAA")
        }

        const {data: newMessageData } = await client.models.DirectMessage.create({
            content: newMessage,
            senderId: loginId,
            chatId: dmId
        })

        console.log(newMessageData);
        setNewMessage("");
    }


    return (
        <div>
            <h2>{}</h2>
            <div>
                <ul>
                    <ScrollView height="500px" autoScroll='auto'>
                    {
                        (loaded) ? (
                            messages.map((msg) => (
                                <li key={msg.id}>
                                    <Divider
                                        size="large"
                                        orientation="horizontal"  />
                                    <small>{msg.sender.username}</small>
                                    <p>{msg.content}</p>
                                    <Divider
                                        size="large"
                                        orientation="horizontal"  />
                                </li>
                            ))
                        ) : (
                            <h2>Loading...</h2>
                        )
                        // messages.map((message) => (
                        //     (
                        //         ( message.sender === dmId ) ||
                        //         ( message.recipient === dmId)
                        //     ) ? (
                        //         <li key={message.id}>
                        //             <Divider
                        //                 size="large"
                        //                 orientation="horizontal" />
                        //             <small>{message.sender}</small>
                        //             <p>{message.content}</p>
                        //         </li>
                        //     ) : (
                        //         <h2>No messages yet.</h2>
                        //     )
                        // ))
                    }
                    </ScrollView>
                </ul>
            </div>
                <form onSubmit={handleNewMessage}>
                    <input
                        type="text"
                        placeholder="Send Message..."
                        value={newMessage}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                    />
                    <button type="submit">Send</button>
                </form>
        </div>
    )
}