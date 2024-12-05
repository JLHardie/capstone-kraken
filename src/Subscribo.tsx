import { useEffect, useState } from "react";
import { type Schema } from "../amplify/data/resource";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { getCurrentUser } from "aws-amplify/auth";
import { Card, Heading, ScrollView, View } from "@aws-amplify/ui-react";
import { Link } from "react-router-dom";


const client = generateClient<Schema>();
const selectionSet = ['forum.*', 'id'] as const
type ForumSubscription = Schema['ForumSubscription']['type']
type ForumSubWithForumName = SelectionSet<ForumSubscription, typeof selectionSet>

export default function Subscribo() {

    const [forumSubscriptions, setForumSubscriptions] = useState<ForumSubWithForumName[]>([]);

    useEffect(() => {
        const getData = async () => {
            const {signInDetails} = await getCurrentUser();
            if (!signInDetails?.loginId)
                throw new Error("signInDetails not found.");
            const {data: forumSubscriptionsData} = await client.models.ForumSubscription.list({
                filter : {
                    userId : {eq : signInDetails.loginId}
                },
                selectionSet: ['forum.*', 'id']
            })
            if (!forumSubscriptionsData) {
                throw new Error("Something broke")
            }
            setForumSubscriptions(forumSubscriptionsData)
        }
        getData();
    }, [])

    return (
        <View className="center-aligner">
            <Heading level={2}>Subscribed Forums</Heading>
            <ul>
                <ScrollView
                    height="70vh"
                >
                    {
                        (forumSubscriptions?.length) ? (
                            forumSubscriptions.map((forumSub) => (
                                <Card key={forumSub.id} className="postCard">
                                    <Link to={`/forum/${forumSub.forum.id}`}>
                                        <Heading level={3}>{forumSub.forum.name}</Heading>
                                    </Link>
                                </Card>
                            ))
                        ) : (
                            <Heading style={{color: "white"}}>No subscriptions yet...</Heading>
                        )
                    }
                </ScrollView>
            </ul>
        </View>
    )

}