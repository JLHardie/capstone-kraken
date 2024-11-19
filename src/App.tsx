// import { useEffect, useState } from "react";
// import type { Schema } from "../amplify/data/resource";
// import { generateClient } from "aws-amplify/data";
// import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Forum from "./Forum";
import Post from "./Post";
import Search from "./Search";
import { Authenticator } from '@aws-amplify/ui-react'
//import '@aws-amplify/ui-react/styles.css'

//const client = generateClient<Schema>();

function App() {
  // const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  // useEffect(() => {
  //   client.models.Todo.observeQuery().subscribe({
  //     next: (data) => setTodos([...data.items]),
  //   });
  // }, []);

  // function createTodo() {
  //   client.models.Todo.create({ content: window.prompt("Todo content") });
  // }

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // Navigate to the search page with the query as a URL parameter
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  const navigate = useNavigate();

  return (

    <Authenticator>
        <Router>
        <div>
          <h1>Kraken</h1>
          <nav>
            <Link to="/forum">Forum</Link>
            <Link to="/post">Post</Link>
          </nav>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a forum"
            />
            <button type="submit">Search</button>
          </form>
          <Routes>
            <Route path="/forum/:forumid" element={<Forum />} />
            <Route path="/post/:postid" element={<Post />} />
            <Route path="/search" element={<Search />} />
            <Route path="/" element={<h2>Welcome! Select a page:</h2>} />
          </Routes>
        </div>
      </Router>
    </Authenticator>
        
    // <Authenticator>
    //   {({ signOut }) => (
    //     <main>
    //       <h1>My todos</h1>
    //       <button onClick={createTodo}>+ new</button>
    //       <ul>
    //         {todos.map((todo) => (
    //           <li key={todo.id}>{todo.content}</li>
    //         ))}
    //       </ul>
    //       <div>
    //         🥳 App successfully hosted. Try creating a new todo.
    //         <br />
    //         <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
    //           Review next step of this tutorial.
    //         </a>
    //       </div>
    //       <button onClick={signOut}>Sign out</button>
    //     </main>
            
    //   )}
    //   </Authenticator>
  );
}

export default App;
