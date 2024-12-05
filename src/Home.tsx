import type { Schema } from '../amplify/data/resource'
import { generateClient, SelectionSet } from 'aws-amplify/data'
import { getCurrentUser } from 'aws-amplify/auth';
import { useState } from 'react';
import { Link } from "react-router-dom";

const client = generateClient<Schema>()
const selectionSet = ['subject', 'content', 'id', 'user.username', 'createdAt'] as const;
type Post = Schema['Post']['type'];
type PostWithUsername = SelectionSet<Post, typeof selectionSet>;
//type Subscribo = Schema['Subscribo']['type'];

function Home() {
    const [posts, setPosts] = useState<PostWithUsername[]>([]);
    //const [subscribos, setSubscribos] = useState<Subscribo[]>([]);
    //const [subbedPosts, setSubbedPosts] = useState<Post[]>([]);

    const getData = async () => {
        //const {userId} = await getCurrentUser()
        const {data: postData} = await client.models.Post.list({
            selectionSet
        });
        const sortedPosts = [...postData].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(sortedPosts)

        // const {data: subData} = await client.models.Subscribo.list({
        //     filter: {
        //         userId: {eq: userId}
        //     }
        // });
        // setSubscribos(subData);

        // Extract forum IDs from subscribed data
        //const subscribedForumIds = subData.map((sub) => sub.forumid);

        // Fetch posts and filter them by subscribed forum IDs
        // const filteredPosts = sortedPosts.filter((post) =>
        //     subscribedForumIds.includes(post.forumid)
        // );
        // setSubbedPosts(filteredPosts)
    }
    getData();

    const createForum = async () => {
        const { userId } = await getCurrentUser();
        await client.models.Forum.create({
            name: window.prompt("Name for forum?"),
            belongsTo: userId
        })
    }

    return (
        <div className="center-aligner">
            <button onClick={createForum}>Create Forum</button>
            <h2>Welcome to the Feed</h2>
            <ul>
                {/* {subscribos.length > 0 ? (
                    subbedPosts.map((post) => (
                        <li key={post.id}>
                            <small>{post.user}</small>
                            <Link to={`/post/${post.id}`}>
                                <h2>{post.subject}</h2>
                            </Link>
                        </li>
                    ))
                ) : ( */}
                    {posts.map((post) => (
                        <li key={post.id}>
                            <small>{post.user.username}</small>
                            <Link to={`/post/${post.id}`}>
                                <h2>{post.subject}</h2>
                            </Link>
                        </li>
                    ))}
                {//)}
}
            </ul>
        </div>
    )
}

export default Home;