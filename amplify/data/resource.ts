import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  User: a
    .model({
      username: a.string(),
      chats: a.hasMany("UserChat","userId"),
      messages: a.hasMany("DirectMessage", "senderId"),
      subscriptions: a.hasMany("ForumSubscription","userId"),
      likedPosts: a.hasMany("PostLike","userId"),
      posts: a.hasMany("Post", "userId"),
      comments: a.hasMany("Comment", "commenterId"),
    }),
  UserChat: a
    .model({
      userId: a.id().required(),
      user: a.belongsTo("User","userId"),
      chatId: a.id().required(),
      chat: a.belongsTo("Chat", "chatId"),
    }),
  Chat: a
    .model({
      name: a.string(),
      messages: a.hasMany("DirectMessage","chatId"),
      users: a.hasMany("UserChat", "chatId"),
    }),
  DirectMessage: a
    .model({
      chatId: a.id().required(),
      chat: a.belongsTo("Chat","chatId"),
      senderId: a.id().required(),
      sender: a.belongsTo("User", "senderId"),
      content: a.string(),
    }),
  Post: a
    .model({
      subject: a.string(),
      content: a.string(),
      containsImage: a.boolean(),
      likes: a.hasMany("PostLike","postId"),
      forumid: a.id(),
      forum: a.belongsTo("Forum", "forumid"),
      comments: a.hasMany("Comment", "postid"),
      userId: a.id().required(),
      user: a.belongsTo("User", "userId"),
    }),
  PostLike: a
    .model({
      userId: a.id().required(),
      user: a.belongsTo("User", "userId"),
      postId: a.id().required(),
      post: a.belongsTo("Post", "postId"),
    }),
  Forum: a
    .model({
      name: a.string(),
      belongsTo: a.string(),
      description: a.string(),
      posts: a.hasMany("Post", "forumid"),
      subscribers: a.hasMany("ForumSubscription", "forumId"),
      messages: a.hasMany("Message", "forumid"),
    }),
  ForumSubscription: a
    .model({
      userId: a.id().required(),
      user: a.belongsTo("User", "userId"),
      forumId: a.id().required(),
      forum: a.belongsTo("Forum", "forumId"),
    }).secondaryIndexes((index) => [index("userId")]),
  Comment: a
    .model({
      content: a.string(),
      commenterId: a.id(),
      commenter: a.belongsTo("User","commenterId"),
      postid: a.id(),
      post: a.belongsTo("Post", "postid"),
    }),
  Message: a
    .model({
      sender: a.string(),
      forumid: a.id(),
      forum: a.belongsTo("Forum","forumid"),
      content: a.string(),
    })
})
.authorization((allow) => [
  allow.publicApiKey(),
  allow.owner()
]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
