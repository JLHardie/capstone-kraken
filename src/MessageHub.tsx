import { useEffect, useState } from "react";
import { Schema } from "../amplify/data/resource";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { getCurrentUser } from "aws-amplify/auth";
import { Divider, ScrollView } from "@aws-amplify/ui-react";


const selectionSet = ['chats.*', 'chats.chat.*'] as const;
type User = Schema['User']['type'];
type UserWithChat = SelectionSet<User, typeof selectionSet>;
const client = generateClient<Schema>();

export default function MessageHub() {
    const [user, setUser] = useState<UserWithChat>();

    useEffect(() => {
        const retrieveData = async () => {
            const {signInDetails} = await getCurrentUser();
            const loginId = signInDetails?.loginId;
            if (!loginId) {
                throw new Error("BBBBB");
            }
            const { data: userData } = await client.models.User.get(
                {id: loginId},
                {selectionSet}
            )
            if(!userData) {
                throw new Error("FUCK");
            }
            setUser(userData)
        }
        retrieveData();
    })

    const getNameOfOtherUser = async (input: string) => {
        const { data: chatData } = await client.models.Chat.get(
            {id: input},
            {selectionSet: ['users.userId', 'users.user.username']}
        )
        const { signInDetails } = await getCurrentUser();
        if (chatData?.users[0].userId === signInDetails?.loginId)
            return chatData?.users[0].user.username
        return chatData?.users[1].user.username
    }


    return (
        <div>
            <ul>
                <ScrollView autoScroll="auto">
                    {
                        user?.chats.map((chat) => (
                            <li key={chat.chat.id}>
                                <Divider size="large" orientation="horizontal" />
                                {getNameOfOtherUser(chat.id)}
                            </li>
                        ))
                    }
                </ScrollView>
            </ul>
        </div>
    )
}