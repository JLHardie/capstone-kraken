// import { useEffect, useState } from "react";
// import type { Schema } from "../amplify/data/resource";
// import { generateClient } from "aws-amplify/data";
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Forum from "./Forum";
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

  

  return (

    <Authenticator>
      {({ signOut }) => (
        <Router>
        <div>
          <h1>My Application</h1>
          <nav>
            <Link to="/forum">Forum</Link>
          </nav>
          <Routes>
            <Route path="/todos" element={<Todos />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/" element={<h2>Welcome! Select a page:</h2>} />
          </Routes>
        </div>
      </Router>
      )}
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
