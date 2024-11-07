import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
//import React from "react";
import { useParams } from "react-router-dom";

const client = generateClient<Schema>();

function Forum() {
    const { forumId } = useParams<{ forumId: string }>();
    const [forums, setForums] = useState<Array<Schema["Forum"]["type"]>>([]);
    const [posts, setPosts] = useState<Array<Schema["Post"]["type"]>>([]);

    useEffect(() => {
      // Fetch the forum information, if needed
      const fetchForum = async () => {
        try {
          const forumData = await client.query("Forum", (f) => f.id("eq", forumId));
          setForums(forumData);
        } catch (error) {
          console.error("Error fetching forum:", error);
        }
      };
  
      // Fetch posts for the specific forum
      const fetchPosts = async () => {
        try {
          const postsData = await client.query("Post", (p) => p.forumId("eq", forumId));
          setPosts(postsData);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };
  
      fetchForum();
      fetchPosts();
    }, [forumId]);
    
    return (
      <main>
        <button>Add New Post</button>
        <h1>Forum: {forums.length ? forums[0].name : "Loading..."}</h1>
  
        {posts.length ? (
          posts.map((post) => (
            <div key={post.id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc' }}>
              <h2>{post.subject}</h2>
              <p>{post.content}</p>
              <small>Posted by: PLACEHOLDER on {new Date(post.createdAt).toLocaleDateString()}</small>
            </div>
          ))
        ) : (
          <div>
            <h1>There are no posts... yet.</h1>
            <h2>Be the first!</h2>
          </div>
        )}
      </main>
    );
}

export default Forum;