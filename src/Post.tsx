import { Button, Card, Divider, Flex, Heading, Menu, MenuItem, ScrollView, Text, TextField, View } from "@aws-amplify/ui-react";
import { generateClient, SelectionSet } from "aws-amplify/data";
import { Schema } from "../amplify/data/resource";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCurrentUser } from "aws-amplify/auth";

const client = generateClient<Schema>();
const selectionSet = ['comments.*', 'id', 'subject', 'content', 'user.username', 'comments.commenter.username'] as const
const userSet = ['likedPosts.post.id', 'likedPosts.id', 'id', 'chats.chat.users.id'] as const;
type Post = Schema['Post']['type']
type User = Schema['User']['type']
type UserLikedPosts = SelectionSet<User, typeof userSet>
type PostWithComments = SelectionSet<Post, typeof selectionSet>

export default function Post() {
  const navigate = useNavigate();

  const {postId} = useParams<{postId: string}>();
  const [post, setPost] = useState<PostWithComments>()
  const [user, setUser] = useState<UserLikedPosts>()
  const [likesPost, setLikesPost] = useState<boolean>();
  const [likeLoading, setLikeLoading] = useState<boolean>();
  const [newComment, setNewComment] = useState("");


  useEffect(() => {
    setLikeLoading(true);
    const getData = async () => {
      if (!postId)
        throw new Error("postId not found")
      const { data: postData } = await client.models.Post.get(
        {id: postId},
        {selectionSet}
      )

      if (!postData)
        throw new Error("Failed to retrieve Post data.")
      setPost(postData);

      const {signInDetails} = await getCurrentUser();
      const signIn = signInDetails?.loginId;
      if (!signIn)
        throw new Error("User sign in not found")
      const { data: userData } = await client.models.User.get(
        {id: signIn},
        {selectionSet: userSet}
      );
      if (!userData)
        throw new Error("User data not found")
      setUser(userData);

      setLikesPost(false);
      userData.likedPosts.forEach((post) => {
        if (post.post.id === postId)
          setLikesPost(true);
      })
      setLikeLoading(false);
    }
    getData();
  }, [])

  const onClickLike = async () => {
    setLikeLoading(true);
    const id = user?.id;
    if (!id||!postId)
      throw new Error("userId not found");
    await client.models.PostLike.create({
      userId: id,
      postId: postId
    })
    setLikesPost(true);
    setLikeLoading(false);
  }

  const onClickUnlike = async () => {
    setLikeLoading(true);
    const id = user?.id;
    if (!id||!postId)
      throw new Error("userId not found");
    user.likedPosts.forEach(async (likedPost) => {
      if (likedPost.post.id === postId) {
        await client.models.PostLike.delete({id: likedPost.id})
        setLikesPost(false)
      }
    })
    setLikeLoading(false);
  }

  const onOpenDirectMessage = async (input: string | null) => {
    var hasDm = false;
    const chats = user?.chats
    if (chats) {
      chats.forEach((chat) => {
        chat.chat.users.forEach((user) => {
          if(user.id === input) {
            hasDm = true;
          }
        })
      })
    }
    console.log(hasDm)
    // (hasDm) ? (
    //   const { data: chatData } 
    //   navigate(`/dm/`)
    // ) : (

    // )
  }

  return (
    <View as="div">
      <Button onClick={() => navigate(`/post/${post?.id}`)} variation="primary">Back</Button>
      <View as="div" className="center-aligner">
        <Heading level={2}>{post?.subject}</Heading>
        <Divider size="small" orientation="horizontal"/>
        <Text>{post?.content}</Text>
        <Flex direction="row" justifyContent="flex-start">
          {
            (likeLoading) ? (
              <Button
                isLoading={true}
                isDisabled={true}
                variation="primary"
                loadingText="Please Wait..."
              />
            ) : (
              (!likesPost) ? (
                <Button 
                  colorTheme="success" 
                  variation="primary"
                  onClick={onClickLike}
                >
                  Like Post
                </Button>
              ) : (
                <Button 
                  colorTheme="error" 
                  variation="primary"
                  onClick={onClickUnlike}
                >
                  Unlike Post
                </Button>
              )
            )
          }
          <Text>Likes: {post?.comments.length}</Text>
        </Flex>
        <Divider size="large" orientation="horizontal"/>
        <ScrollView
          height="35vh"
        >
          {
            post?.comments.map((comment) => (
              <Card key={comment.id} className="postCard">
                <Flex direction="row">
                  <Heading level={4}>{comment.commenter.username}</Heading>
                  <Menu
                    menuAlign="start"
                    size="small"
                  >
                    <MenuItem
                      onClick={() => onOpenDirectMessage(comment.commenterId)}
                    >
                      Open Direct Message
                    </MenuItem>
                  </Menu>
                </Flex>
                <Text>{comment.content}</Text>
              </Card>
            ))
          }
        </ScrollView>
        <Flex 
          as="form"
          direction="row" 
          alignContent="center"
          onSubmit={() => console.log(newComment)}
          className="commentBar"
        >
          <TextField
            label="commentField"
            onChange={(e) => setNewComment(e.target.value)}
            labelHidden={true}
            className="field"
          />
          <Button
            type="submit"
            onClick={() => console.log("Comment Button Pressed")}
            variation="primary"
          >
            Comment
          </Button>
        </Flex>
      </View>
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