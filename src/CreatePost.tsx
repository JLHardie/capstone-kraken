import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function CreatePost() {
    const { forumId } = useParams<{ forumId: string }>();
    const [subject, setSubject] = useState(""); // State for the subject
    const [content, setContent] = useState(""); // State for the content
    const [loading, setLoading] = useState(false); // State for loading status
    const navigate = useNavigate(); // For navigation after submission

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        try {
            // Create a new post in the database
            const newPost = await client.models.Post.create({
                subject,
                content,
                forumId, // Associate the post with the current forum
                createdAt: new Date().toISOString(),
            });

            console.log("Post created:", newPost);

            // Navigate back to the forum page after creation
            navigate(`/forum/${forumId}`);
        } catch (error) {
            console.error("Error creating post:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Create a New Post</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="subject">Subject:</label>
                    <input
                        type="text"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
    );
}

export default CreatePost