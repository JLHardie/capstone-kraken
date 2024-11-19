import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useParams } from "react-router-dom";

const client = generateClient<Schema>();
const { forumId } = useParams<{ forumId: string }>();
const {data : forum} = await client.models.Forum.get({ id: forumId });
const {data : posts} = await forum.posts();

function Forum() {
    
    return (
      <main>
        <button>Add New Post</button>
        <h1>Forum: {forum?.name}</h1>
        <ul>
        {posts.length ? (
          posts.forEach((post: { id: any; subject: any; content: any; createdAt: string | number | Date; }) => {
            <div key={post.id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc' }}>
              <h2>{post.subject}</h2>
              <p>{post.content}</p>
              <small>Posted by: PLACEHOLDER on {new Date(post.createdAt).toLocaleDateString()}</small>
            </div>
          })
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