import type {Schema} from '../amplify/data/resource';
import { generateClient, SelectionSet } from 'aws-amplify/data';
import { useState, useEffect } from 'react';
//import { getCurrentUser } from 'aws-amplify/auth';
import { ScrollView } from '@aws-amplify/ui-react';
import { useParams } from "react-router-dom";


const client = generateClient<Schema>()
const selectionSet = ['content', 'createdAt', 'id',
    'senderId', 'sender.username', 'sender.id'
] as const
type DirectMessage = Schema['DirectMessage']['type'];
type MessageWithUser = SelectionSet<DirectMessage, typeof selectionSet>;
//type User = Schema['User']['type'];

export default function DM() {
    
    const { dmId } = useParams<{dmId : string}>()
    const [messages, setMessages] = useState<MessageWithUser[]>([])
    //const [user, setUser] = useState<User | null>(null);
    const [loaded, setLoaded] = useState<boolean>();
    setLoaded(false);

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
            setMessages(messageData);
            setLoaded(true);
        }
        getMessages();

        const messageSub = client.models.DirectMessage.onCreate().subscribe({
            next: () => getMessages()
        });

        return () => messageSub.unsubscribe();
    })


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
                                    <small>{msg.sender.username}</small>
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