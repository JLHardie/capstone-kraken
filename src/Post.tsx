import { View } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

export default function Post() {
  return (
    <View as="div">

    </View>
  )
  // const navigate = useNavigate();
  // const { postId } = useParams<{ postId: string }>();

  // if (!postId) {
  //   throw new Error("Invalid postId.")
  // }

  // const [post, setPost] = useState<Schema['Post']['type'] | null>(null);
  // const [comments, setComments] = useState<Schema['Comment']['type'][]>([]);
  // const [newComment, setNewComment] = useState('');
  // //const [myLike, setLikes] = useState<Schema['Like']['type'][]>([]);

  // const handleNewComment = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const { username, userId } = await getCurrentUser();
  //   if ((newComment.trim() !== '') && !(!post)) {
  //       const { data: newCommentData } = await client.models.Comment.create({
  //         content: newComment,
  //         commenter: username,
  //         commenterId: userId,
  //         postid: post.id
  //       })

  //       console.log(newCommentData)

  //       navigate(`/post/${postId}`);
  //       setNewComment('');
  //   }
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     //const {userId} = await getCurrentUser();
  //     const { data: postData } = await client.models.Post.get({id: postId})
  //     if (!postData) {
  //       throw new Error("Post not found");
  //     }
  //     setPost(postData);

  //     // const { data: likesData } = await client.models.Like.list({
  //     //   filter: {
  //     //     and: [
  //     //       {postid: {eq: postData.id}},
  //     //       {userId: {eq: userId}}
  //     //     ]
  //     //   }
  //     // })
  //     // if (likesData) {
  //     //   setLikes(likesData)
  //     // }

  //     const { data: commentsData } = await client.models.Comment.list({
  //       filter: {
  //         postid : { eq : postId }
  //       }
  //     })
  //     if (!commentsData) {
  //       throw new Error("Comments not found");
  //     }
  //     setComments(commentsData);
  //   }
  //   fetchData();
  // }, [postId]);

  // const pressLike = async () => {
  //   const {userId} = await getCurrentUser();
  //   const { data: like } = await client.models.Like.create({
  //     userId: userId,
  //     postid: post?.id,
  //   })
  //   console.log(like)
  //   console.log(post)
  //   console.log(post?.likes)
  //   if (!(!post) && (post.likes != undefined)) {
  //     const numLikes = post.likes?.valueOf()
  //     const {data: postData} = await client.models.Post.update({
  //       id: post.id,
  //       likes: numLikes + 1,
  //     })
  //     console.log(postData)
  //   }
  // }


  // return (
  //   <div>
  //     {
  //       post ? (
  //         <div>
  //           <h1>{post.subject}</h1>
  //           <p>{post.content}</p>
  //           <small>Posted on: {post.datePosted}</small>
  //           <button onClick={pressLike}>Likes: {post.likes}</button>
  //         </div>
  //       ) : (
  //         <h3>Post data failed to load</h3>
  //       )
  //     }
  //     <div>
  //       <h3>Comments</h3>
  //       <form onSubmit={handleNewComment}>
  //         <input
  //           type="text"
  //           placeholder="Make a comment..."
  //           value={newComment}
  //           onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewComment(e.target.value)}
  //         />
  //         <button type="submit">Comment</button>
  //       </form>
  //       <ul>
  //         {comments.length ? (
  //             comments.map((comment) => (
  //               <li key={comment.id} style={{ marginBottom: '10px' }}>
  //                 <h3>{comment.commenter}</h3>
  //                 <p>{comment.content}</p>
  //                 <small>Commented on: {new Date(comment.createdAt).toLocaleDateString()}</small>
  //               </li>
  //             ))
  //         ) : (
  //           <p>No comments yet. Be the first to comment!</p>
  //         )}
  //       </ul>
  //     </div>
  //   </div>
    
  // );
}