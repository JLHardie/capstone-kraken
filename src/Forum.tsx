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
      // Observe the forum based on the forumId
      const forumSubscription = client.models.Forum.observeQuery().subscribe({
        next: async (data) => setForums(data.items.filter(forum => forum.id === forumId)),
        error: (error) => console.error("Error fetching forum:", error),
      });
  
      // Observe posts associated with the forumId
      const postSubscription = client.models.Post.observeQuery().subscribe({
        next: async (data) => {
          // Resolve the forum for each post by calling the forum method
          const filteredPosts = await Promise.all(data.items.map(async (post) => {
            const forum = await post.forum(); // Call the method to get the forum object
            if (forum && forum.data?.id === forumId) {
              return post; // Include post if forum id matches
            }
            return null; // Otherwise, return null (will be filtered out)
          }));
    
          // Filter out null entries
          setPosts(filteredPosts.filter(post => post !== null));
        },
        error: (error) => console.error("Error fetching posts:", error),
      });
  
      return () => {
        forumSubscription.unsubscribe();
        postSubscription.unsubscribe();
      };
    }, [forumId]);
    
    return (
      <main>
        <button>Add New Post</button>
        {forums.map((forum) => (
          <h1>Forum: {forum.name}</h1>
        ))}
  
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