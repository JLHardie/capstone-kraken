import { View } from "@aws-amplify/ui-react";

export default function CreatePost() {
    return (
        <View as="div">
            
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