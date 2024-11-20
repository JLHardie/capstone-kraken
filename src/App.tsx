import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import Forum from "./Forum";
import Post from "./Post";
import SearchBar from './SearchBar';
import Search from "./Search";
import Home from "./Home";
import CreatePost from "./CreatePost";
import { Authenticator } from '@aws-amplify/ui-react'
//import '@aws-amplify/ui-react/styles.css'

function App() {

  return (

    <Authenticator>
      <Router>
        <div>
          <Link to={`/feed`}>
            <h1>Kraken</h1>
          </Link>
          <SearchBar />
          <Routes>
            <Route path="/feed" element={<Home />} />
            <Route path="/forum/:forumId" element={<Forum />} />
            <Route path="/forum/:forumId/create" element={<CreatePost />} />
            <Route path="/post/:postId" element={<Post />} />
            <Route path="/search" element={<Search />} />
            <Route path="/" element={<Navigate to="/feed" replace />} />
          </Routes>
        </div>
      </Router>
    </Authenticator>
  );
}

export default App;
