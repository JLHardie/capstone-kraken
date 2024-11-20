import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import React from "react"
import SearchBar from './SearchBar';
import Search from "./Search";
import Home from "./Home";
//import '@aws-amplify/ui-react/styles.css'

const Chatroom = React.lazy(() => import('./Chatroom'));
const Profile = React.lazy(() => import('./Profile'));
const CreatePost = React.lazy(() => import('./CreatePost'));
const Post = React.lazy(() => import('./Post'))
const Forum = React.lazy(() => import('./Forum'))

function App() {

  return (
    <Router>
      <div>
        <Link to={`/feed`}>
          <h1>Kraken</h1>
        </Link>
        <SearchBar />
        <Link to={`/profile`}>
          <button type="button">Profile</button>
        </Link>
        <Routes>
          <Route path="/feed" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forum/:forumId" element={<Forum />} />
          <Route path="/forum/:forumId/create" element={<CreatePost />} />
          <Route path="/post/:postId" element={<Post />} />
          <Route path="/search" element={<Search />} />
          <Route path="/chat/:userId" element={<Chatroom />} />
          <Route path="/" element={<Navigate to="/feed" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
