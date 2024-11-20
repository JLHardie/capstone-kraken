import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

function Post() {
  const { postId } = useParams<{ postId: string }>();

  if (!postId) {
    throw new Error("Invalid postId.")
  }

  const [post, setPost] = useState<Schema['Post']['type'] | null>(null);
  const [comments, setComments] = useState<Schema['Comment']['type'][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: postData } = await client.models.Post.get({id: postId})
      if (!postData) {
        throw new Error("Post not found");
      }
      setPost(postData);

      const { data: commentsData } = await client.models.Comment.list({
        filter: {
          postid : { eq : postId }
        }
      })
      if (!commentsData) {
        throw new Error("Comments not found");
      }
      setComments(commentsData);
    }
    fetchData();
  }, [postId]);


  return (
    <div>
      {
        post ? (
          <div>
            <h1>{post.subject}</h1>
            <p>{post.content}</p>
            <small>Posted on: {post.datePosted}</small>
          </div>
        ) : (
          <h3>Post data failed to load</h3>
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