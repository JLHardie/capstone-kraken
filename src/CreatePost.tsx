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
            // if (!forumId) {
            //     throw new Error("Forum ID is missing.");
            // }

            // Retrieve the forum to ensure it exists (optional step for validation)
            const { data : forum } = await client.models.Forum.get({ id: forumId });
            if (!forum) {
                throw new Error("Forum not found.");
            }

            // Create the post and link it to the forum
            const { data : post } = await client.models.Post.create({
                subject,
                content,
                containsImage: false, // Set default value for now
                datePosted: new Date().toISOString(),
                likes: 0, // Default likes count
                forumid: forum.id, // Link to the forum by ID
            });

            console.log("Post created:", post);

            // Navigate back to the forum page after successful creation
            navigate(`/forum/${forumId}`);
        } catch (err) {
            console.error("Error creating post:", err);
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