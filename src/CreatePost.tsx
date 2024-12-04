import { Divider, Heading, View, TextField, TextAreaField, Button, Flex } from "@aws-amplify/ui-react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Schema } from "../amplify/data/resource";
import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import { getCurrentUser } from "aws-amplify/auth";

const client = generateClient<Schema>();
type Forum = Schema['Forum']['type']
type User = Schema['User']['type']
const navigate = useNavigate();

export default function CreatePost() {
    const {forumId} = useParams<{forumId: string}>();
    const [forum, setForum] = useState<Forum>();
    const [user, setUser] = useState<User>();
    const [postLoading, setPostLoading] = useState<boolean>();

    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if (!forumId) 
                throw new Error("Forum ID not found");
            const {data: forumData} = await client.models.Forum.get({id:forumId})
            if (!forumData)
                throw new Error("Forum Data not found")
            setForum(forumData)

            const {signInDetails} = await getCurrentUser();
            const signIn = signInDetails?.loginId;
            if (!signIn)
                throw new Error("Couldn't retrieve user login data")
            const {data: userData} = await client.models.User.get({id:signIn});
            if (!userData)
                throw new Error("Couldn't retrieve user data.")
            setUser(userData);
        }
        fetchData();


    }, [])

    const onPostClick = async () => {
        setPostLoading(true);
        const id = user?.id;
        if (!id || !subject || !content)
            throw new Error("Something is missing")
        await client.models.Post.create({
            userId: id,
            subject: subject,
            content: content,
            forumid: forumId,
        })
        navigate(-1);
    }

    return (
        <View>
            <Flex direction="column" justifyContent="center">
                <Heading level={2}>Create Post for {forum?.name}</Heading>
                <Divider orientation="horizontal" size="large" />
                
                <TextField 
                    label="Subject" 
                    onChange={(e) => setSubject(e.target.value)}
                    id="subjectField"
                />
                <TextAreaField
                    label="Content"
                    onChange={(e) => {
                        setContent(e.target.value)
                        console.log(content)
                    }}
                    id="contentField"
                />
                {
                    (postLoading) ? (
                        <Button 
                            isLoading={true} 
                            isDisabled={true}
                            loadingText="Posting..."
                        >
                            Make Post
                        </Button>
                    ) : (
                        <Button
                            onClick={onPostClick}
                        >
                            Make Post
                        </Button>
                    )
                }
            </Flex>
        </View>
    )
    // const { forumId } = useParams<{ forumId: string }>();
    // const [forum, setForum] = useState<Schema['Forum']['type'] | null>(null);

    // if (!forumId) {
    //     throw new Error("ForumId is required")
    //   }

    // const [subject, setSubject] = useState(""); // State for the subject
    // const [content, setContent] = useState(""); // State for the content
    // const [loading, setLoading] = useState(false); // State for loading status
    // const navigate = useNavigate(); // For navigation after submission

    // useEffect(() => {
    //     const fetchData = async () => {
          
    //       const { data: forum } = await client.models.Forum.get({ id: forumId });
    //       setForum(forum);
    //     };
    
    //     fetchData();
    //   }, [forumId]);


    // const handleSubmit = async (event: React.FormEvent) => {
    //     console.log(forumId);
    //     console.log(subject);
    //     console.log(content);
    //     event.preventDefault();
    //     setLoading(true);
    //     const { userId } = await getCurrentUser();

    //     try {
    //         if (!forumId) {
    //             throw new Error("Forum ID is missing.");
    //         }

    //         // Retrieve the forum to ensure it exists (optional step for validation)
    //         const { data : forumdata } = await client.models.Forum.get({ id: forumId });
    //         if (!forumdata) {
    //             throw new Error("Forum not found.");
    //         }
    //         console.log(forum)
    //         console.log(forumdata)
    //         if (!forum) {
    //             throw new Error("Forum not found.");
    //         }

    //         console.log(forumdata.id)

    //         // Create the post and link it to the forum
    //         const { data : post } = await client.models.Post.create({
    //             subject,
    //             content,
    //             containsImage: false, // Set default value for now
    //             datePosted: new Date().toISOString(),
    //             likes: 0, // Default likes count
    //             forumid: forumId, // Link to the forum by ID
    //             user: userId,
    //         });

    //         console.log("Post created:", post);

    //         // Navigate back to the forum page after successful creation
    //         navigate(`/forum/${forumId}`);
    //     } catch (err) {
    //         console.error("Error creating post:", err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // return (
    //     <div>
    //         <h2>Create a New Post</h2>
    //         <form onSubmit={handleSubmit}>
    //             <div>
    //                 <label htmlFor="subject">Subject:</label>
    //                 <input
    //                     type="text"
    //                     id="subject"
    //                     value={subject}
    //                     onChange={(e) => setSubject(e.target.value)}
    //                     required
    //                 />
    //             </div>
    //             <div>
    //                 <label htmlFor="content">Content:</label>
    //                 <textarea
    //                     id="content"
    //                     value={content}
    //                     onChange={(e) => setContent(e.target.value)}
    //                     required
    //                 />
    //             </div>
    //             <FileUploader
    //                 acceptedFileTypes={['image/*']}
    //                 path="public/"
    //                 maxFileCount={1}
    //                 isResumable
    //             />
    //             <button type="submit" disabled={loading}>
    //                 {loading ? "Submitting..." : "Submit"}
    //             </button>
    //         </form>
    //     </div>
    // );
}