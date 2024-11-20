import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { getCurrentUser } from 'aws-amplify/auth';

const client = generateClient<Schema>();

function Post() {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();

  if (!postId) {
    throw new Error("Invalid postId.")
  }

  const [post, setPost] = useState<Schema['Post']['type'] | null>(null);
  const [comments, setComments] = useState<Schema['Comment']['type'][]>([]);
  const [newComment, setNewComment] = useState('');

  const handleNewComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, userId } = await getCurrentUser();
    if ((newComment.trim() !== '') && !(!post)) {
        const { data: newCommentData } = await client.models.Comment.create({
          content: newComment,
          commenter: username,
          commenterId: userId,
          postid: post.id
        })

        console.log(newCommentData)

        navigate(`/post/${postId}`);
        setNewComment('');
    }
  };

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
        <form onSubmit={handleNewComment}>
          <input
            type="text"
            placeholder="Make a comment..."
            value={newComment}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewComment(e.target.value)}
          />
          <button type="submit">Comment</button>
        </form>
        {comments.length ? (
          <ul>
            comments.map((comment) => (
              <li key={comment.id} style={{ marginBottom: '10px' }}>
                <h3>{comments.commenter}</h3>
                <p>{comment.content}</p>
                <small>Commented on: {new Date(comment.createdAt).toLocaleDateString()}</small>
              </li>
            ))
          </ul>
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
    
  );
}

export default Post;