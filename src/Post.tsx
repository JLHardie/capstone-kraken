import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

function Post() {
  const { postId } = useParams<{ postId: string }>();
  const [posts, setPosts] = useState<Array<Schema["Post"]["type"]>>([]);
  const [comments, setComments] = useState<Array<Schema["Comment"]["type"]>>([]);

  useEffect(() => {
    const postSubscription = client.models.Post.observeQuery().subscribe({
        next: async (data) => setPosts(data.items.filter(post => post.id === postId)),
        error: (error) => console.error("Error fetching posts:", error),
      });

    const commentSubscription = client.models.Comment.observeQuery().subscribe({
      next: async (data) => {
        const filteredComments = await Promise.all(data.items.map(async (comment) => {
            const post = await comment.post();
            if (post && post.data?.id === postId) {
              return comment;
            }
            return null;
        }))
        setComments(filteredComments.filter(comment => comment !== null));
      },
      error: (error) => console.error("Error fetching comments:", error),
    });
    return () => {
        commentSubscription.unsubscribe();
        postSubscription.unsubscribe();
      };
  }, [postId]);


  return (
    <div>
        {
            posts.length ? (
                posts.map((post) => (
                    <div>
                    <h1>{post.subject}</h1>
                    <p>{post.content}</p>
                    <small>Posted on: {(post.datePosted)}</small>
                    </div>
                ))
            ) : (
                <h2>Post data failed to load.</h2>
            )
        }
      <div>
        <h3>Comments</h3>
        {comments.length ? (
          comments.map((comment) => (
            <div key={comment.id} style={{ marginBottom: '10px' }}>
              <p>{comment.content}</p>
              <small>Commented on: {new Date(comment.createdAt).toLocaleDateString()}</small>
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
    
  );
}

export default Post;