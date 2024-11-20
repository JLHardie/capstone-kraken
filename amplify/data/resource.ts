import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Post: a
    .model({
      subject: a.string(),
      content: a.string(),
      containsImage: a.boolean(),
      datePosted: a.datetime(),
      likes: a.integer(),
      forumid: a.id(),
      forum: a.belongsTo("Forum", "forumid"),
      comments: a.hasMany("Comment", "postid"),
    }),
  Forum: a
    .model({
      name: a.string(),
      belongsTo: a.string(),
      description: a.string(),
      posts: a.hasMany("Post", "forumid"),
      scribers: a.hasMany("Subscribo", "forumid")
    }),
    Comment: a
      .model({
        content: a.string(),
        commenterId: a.string(),
        commenter: a.string(),
        likes: a.integer().default(0),
        postid: a.id(),
        post: a.belongsTo("Post", "postid"),
      }),
    Message: a
      .model({
        sender: a.string(),
        recipient: a.string(),
        content: a.string(),
      }),
    Subscribo: a
      .model({
        userId: a.string(),
        forumid: a.id(),
        forum: a.belongsTo("Forum", "forumid")
      }),
    Like: a
      .model({
        userId: a.string(),
        postid: a.id(),
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
