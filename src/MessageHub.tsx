import { useEffect, useState } from "react";
import { Schema } from "../amplify/data/resource";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { getCurrentUser } from "aws-amplify/auth";
import { Divider, ScrollView } from "@aws-amplify/ui-react";


const selectionSet = ['chat.users.user.username', 'chat.*', 'chat.users.userId', 'chatId'] as const;
type UserChat =  Schema['UserChat']['type'];
type UserChatFiltered = SelectionSet<UserChat, typeof selectionSet>;
const client = generateClient<Schema>();

export default function MessageHub() {
    const [userChats, setUserChats] = useState<UserChatFiltered[]>([]);
    const [currentUserId, setCurrentUserId] = useState('');

    useEffect(() => {
        const retrieveData = async () => {
            const {signInDetails} = await getCurrentUser();
            const loginId = signInDetails?.loginId;
            if (!loginId) {
                throw new Error("BBBBB");
            }
            setCurrentUserId(loginId);
            const { data: userChatData } = await client.models.UserChat.list({
                filter: {userId: {eq: loginId}},
                selectionSet
            })
            if(!userChatData) {
                throw new Error("FUCK");
            }
            setUserChats(userChatData)
        }
        retrieveData();
    })

    const getNameOfOtherUser = (input: string) => {
        userChats.forEach((chat) => {
            if (chat.chatId === input) {
                if (chat.chat.users[0].userId === currentUserId)
                    return chat.chat.users[1].user.username
                return chat.chat.users[0].user.username
            }
        })
    }


    return (
        <div>
            <ul>
                <ScrollView autoScroll="auto">
                    {
                        userChats.map((chat) => (
                            <li key={chat.chat.id}>
                                <Divider size="large" orientation="horizontal" />
                                <p>{
                                    getNameOfOtherUser(chat.chatId)
                                }</p>
                            </li>
                        ))
                    }
                </ScrollView>
            </ul>
        </div>
    )
}