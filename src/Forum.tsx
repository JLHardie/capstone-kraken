import { type Schema } from "../amplify/data/resource";
import {useState, useEffect} from "react"
import { generateClient } from "aws-amplify/data";
import { useParams, Link } from "react-router-dom";
import { getCurrentUser } from 'aws-amplify/auth';


const client = generateClient<Schema>();



function Forum() {

  const { forumId } = useParams<{ forumId: string }>();

  if (!forumId) {
    throw new Error("ForumId is required")
  }
  
  const [posts, setPosts] = useState<Schema['Post']['type'][]>([]);
  const [forum, setForum] = useState<Schema['Forum']['type'] | null>(null);

  // Fetch forum and posts data on mount
  useEffect(() => {
    const fetchData = async () => {
      
      const { data: forum } = await client.models.Forum.get({ id: forumId });
      setForum(forum);
      
      const { data : postsData } = await client.models.Post.list({
        filter: {
          forumid : { eq : forumId}
        }
      })
      setPosts(postsData);
    };

    fetchData();
  }, [forumId]);

  // Show loading state if data is not yet fetched
  if (!forum || !posts) {
    return <div>Loading...</div>;
  }

  const subButtonClick = async () => {
    const { userId } = await getCurrentUser();
    const { data: newSub } = await client.models.Subscribo.create({
      userId: userId,
      forumid: forum.id
    })
    console.log(newSub)
  }

  return (
    <main>
      <Link to={`/forum/${forum.id}/create`}>
        <button>Add New Post</button>
      </Link>
      <h1>Forum: {forum.name}</h1>
      <button onClick={subButtonClick}>Subscribe</button>
      <ul>
        {posts.length ? (
          posts.map((post) => (
            <Link to={`/post/${post.id}`}>
              <li key={post.id}>
                <h2>{post.subject}</h2>
                <p>{post.content}</p>
                <small>
                  Posted by: PLACEHOLDER on{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </small>
              </li>
            </Link>
          ))
        ) : (
          <div>
            <h1>There are no posts... yet.</h1>
            <h2>Be the first!</h2>
          </div>
        )}
      </ul>
    </main>
  );
}

export default Forum;