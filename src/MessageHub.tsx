import { useEffect, useState } from "react";
import { Schema } from "../amplify/data/resource";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { getCurrentUser } from "aws-amplify/auth";
import { Divider, ScrollView } from "@aws-amplify/ui-react";
import { Link } from "react-router-dom";
import { Nullable } from "@aws-amplify/data-schema";


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

    const getNameOfOtherUser = (input: { readonly chat: { readonly users: { readonly user: { readonly username: Nullable<string>; }; readonly userId: string; }[]; readonly name: Nullable<string>; readonly id: string; readonly owner: string | null; readonly createdAt: string; readonly updatedAt: string; }; readonly chatId: string; }) => {
        const otherUser = input.chat.users.find((user) => user.userId != currentUserId)
        return otherUser?.user.username
    }


    return (
        <div>
            <ul className="centerAligner">
                <ScrollView autoScroll="auto">
                    {
                        userChats.map((chat) => (
                            <li key={chat.chatId}>
                                <Link to={`/dm/${chat.chatId}`}>
                                    <Divider size="large" orientation="horizontal" />
                                    <p>{
                                        getNameOfOtherUser(chat)
                                    }</p>
                                    <Divider size="large" orientation="horizontal" />
                                </Link>
                            </li>
                        ))
                    }
                </ScrollView>
            </ul>
        </div>
    )
}