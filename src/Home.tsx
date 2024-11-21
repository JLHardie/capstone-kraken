import type { Schema } from '../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { getCurrentUser } from 'aws-amplify/auth';
import { useState } from 'react';
import { Link } from "react-router-dom";

const client = generateClient<Schema>()
type Post = Schema['Post']['type'];
type Subscribo = Schema['Subscribo']['type'];

function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [subscribos, setSubscribos] = useState<Subscribo[]>([]);

    const getData = async () => {
        const {userId} = await getCurrentUser()
        const {data: postData} = await client.models.Post.list();
        const sortedPosts = [...postData].sort((a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setPosts(sortedPosts);

        const {data: subData} = await client.models.Subscribo.list({
            filter: {
                userId: {eq: userId}
            }
        });
        setSubscribos(subData);
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
        <div>
            <button onClick={createForum}>Create Forum</button>
            <h2>Welcome to the Feed</h2>
            <ul>
                {
                    subscribos.length > 0 ? (
                        posts.map((post) => (
                            <li key={post.id}>
                                <small>{post.user}</small>
                                <Link to={`/post/${post.id}`}>
                                    <h2>{post.subject}</h2>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <h1>Sub feed coming soon</h1>
                    )
                }
            </ul>
        </div>
    )
}

export default Home;