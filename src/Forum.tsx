import { type Schema } from "../amplify/data/resource";
import {useState, useEffect} from "react"
import { generateClient } from "aws-amplify/data";
import { useParams, Link } from "react-router-dom";
import { getCurrentUser } from 'aws-amplify/auth';
import { Button, Card, Divider, Flex, Heading, ScrollView, View, Text } from "@aws-amplify/ui-react";


const client = generateClient<Schema>();
type Forum = Schema['Forum']['type'];
type Post = Schema['Post']['type'];


export default function Forum() {

  const {forumId} = useParams<{ forumId: string }>();
  const [forum, setForum] = useState<Forum>();
  const [posts, setPosts] = useState<Post[]>();
  const [isSubbed, setIsSubbed] = useState<boolean>();

  useEffect(() => {
    console.log("UseEffect used")
    const fetchData = async () => {
      if (!forumId) {
        throw new Error("ForumId not found");
      }
      const {data: forumData} = await client.models.Forum.get({
        id: forumId
      })
      if (!forumData) {
        throw new Error("ForumData not found")
      }
      setForum(forumData);

      const {data: postData} = await client.models.Post.list({
        filter: {
          forumid: {eq: forumId}
        }
      })
      const sortedPosts = postData.sort((a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      setPosts(sortedPosts);

      const { signInDetails } = await getCurrentUser();
      const userId = signInDetails?.loginId;
      if(!userId)
        throw new Error("userId not found")
      const {data: userData} = await client.models.User.get({
        id: userId,
      }, {
        selectionSet: ['subscriptions.forumId']
      })
      console.log(userData?.subscriptions)
      setIsSubbed(false);
      userData?.subscriptions.forEach((sub) => {
        if (sub.forumId === forumId)
          setIsSubbed(true);
      })
    }
    fetchData();
  }, [])

  const onClickSub = async () => {
    const { signInDetails } = await getCurrentUser();
    const userId = signInDetails?.loginId;
    if(!userId)
      throw new Error("userId not found")
    const {data: userData} = await client.models.User.get({
      id: userId,
    })

    if (!userData?.id || !forumId) {
      throw new Error("Subscription failed")
    }
    await client.models.ForumSubscription.create({
      userId: userData?.id,
      forumId: forumId,
    })
    setIsSubbed(true);
  }

  const onClickUnsub = async () => {
    const { signInDetails } = await getCurrentUser();
    const userId = signInDetails?.loginId;
    if(!userId)
      throw new Error("userId not found")
    const {data: userData} = await client.models.User.get({
      id: userId,
    })

    if (!userData?.id || !forumId) {
      throw new Error("Subscription failed")
    }
    const {data: forumSubs} = await client.models.ForumSubscription.listForumSubscriptionByUserId(
      {userId:userId}
    )
    forumSubs.forEach(async (sub) => {
      if(sub.forumId === forumId) {
        await client.models.ForumSubscription.delete({id: sub.id})
        setIsSubbed(false);
      }
    })
  }

  return (
    <View as="div">
      <Heading level={2}>{forum?.name}</Heading>
      <Flex
        direction="row"
        justifyContent="flex-start"
      >
        {(!isSubbed) ?
          (<Button variation="primary" onClick={onClickSub}>Subscribe</Button>) :
          (<Button variation="primary" colorTheme="error" onClick={onClickUnsub}>Unsubscribe</Button>)}   
        <Link to={`/forum/${forumId}/create`}>
          <Button variation="primary">New Post</Button>
        </Link>
      </Flex>
      <Divider size="large" orientation="horizontal" />
      <ScrollView height="75vh">
        {
          posts?.map((post) => (
            <Card key={post.id} className="postCard">
              <Link to={`/post/${post.id}`}>
                <Heading level={4}>{post.subject}</Heading>
                <Text>{post.content}</Text>
                <Text fontSize=".75em">Posted by Placeholder</Text>
              </Link>
            </Card>
          ))
        }
      </ScrollView>
    </View>
  )

  // const { forumId } = useParams<{ forumId: string }>();

  // if (!forumId) {
  //   throw new Error("ForumId is required")
  // }
  
  // const [posts, setPosts] = useState<Schema['Post']['type'][]>([]);
  // const [forum, setForum] = useState<Schema['Forum']['type'] | null>(null);

  // // Fetch forum and posts data on mount
  // useEffect(() => {
  //   const fetchData = async () => {
      
  //     const { data: forum } = await client.models.Forum.get({ id: forumId });
  //     setForum(forum);
      
  //     const { data : postsData } = await client.models.Post.list({
  //       filter: {
  //         forumid : { eq : forumId}
  //       }
  //     })
  //     const sortedPosts = [...postsData].sort((a, b) =>
  //       new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  //   );
  //   setPosts(sortedPosts);
  //   };

  //   fetchData();
  // }, [forumId]);

  // // Show loading state if data is not yet fetched
  // if (!forum || !posts) {
  //   return <div>Loading...</div>;
  // }

  // const subButtonClick = async () => {
  //   const { userId } = await getCurrentUser();
  //   const { data: newSub } = await client.models.Subscribo.create({
  //     userId: userId,
  //     forumid: forum.id
  //   })
  //   console.log(newSub)
  // }

  // return (
  //   <main>
  //     <Link to={`/forum/${forum.id}/create`}>
  //       <button>Add New Post</button>
  //     </Link>
  //     <h1>Forum: {forum.name}</h1>
  //     <button onClick={subButtonClick}>Subscribe</button>
  //     <ul>
  //       {posts.length ? (
  //         posts.map((post) => (
  //           <Link to={`/post/${post.id}`}>
  //             <li key={post.id}>
  //               <h2>{post.subject}</h2>
  //               <p>{post.content}</p>
  //               <small>
  //                 Posted by: PLACEHOLDER on{" "}
  //                 {new Date(post.createdAt).toLocaleDateString()}
  //               </small>
  //             </li>
  //           </Link>
  //         ))
  //       ) : (
  //         <div>
  //           <h1>There are no posts... yet.</h1>
  //           <h2>Be the first!</h2>
  //         </div>
  //       )}
  //     </ul>
  //   </main>
  // );
}