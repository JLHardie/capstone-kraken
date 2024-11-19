import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Forum from "./Forum";
import Post from "./Post";
import SearchBar from './SearchBar';
import Search from "./Search";
import { Authenticator } from '@aws-amplify/ui-react'
//import '@aws-amplify/ui-react/styles.css'

function App() {

  return (

    <Authenticator>
      <Router>
        <div>
          <h1>Kraken</h1>
          <SearchBar />
          <nav>
            <Link to="/forum">Forum</Link>
            <Link to="/post">Post</Link>
          </nav>
          <Routes>
            <Route path="/forum/:forumid" element={<Forum />} />
            <Route path="/post/:postid" element={<Post />} />
            <Route path="/search" element={<Search />} />
            <Route path="/" element={<h2>Welcome! Select a page:</h2>} />
          </Routes>
        </div>
      </Router>
    </Authenticator>
  );
}

export default App;
