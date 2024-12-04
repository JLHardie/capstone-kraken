import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import Forum from "./Forum";
import Post from "./Post";
import Search from "./Search";
import Home from "./Home";
import CreatePost from "./CreatePost";
import Chatroom from "./Chatroom";
import Profile from "./Profile";
import DM from "./DM";
import MessageHub from "./MessageHub";
import { Button, Card, Flex, Image } from "@aws-amplify/ui-react";
import Navbar from "./Navbar";
//import '@aws-amplify/ui-react/styles.css'

function App() {

  return (
    <div>
      <Navbar />
      <Router>
        <div>
          <Routes>
            <Route path="/feed" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/forum/:forumId" element={<Forum />} />
            <Route path="/forum/:forumId/create" element={<CreatePost />} />
            <Route path="/post/:postId" element={<Post />} />
            <Route path="/search" element={<Search />} />
            <Route path="/forum/:forumId/chat" element={<Chatroom />} />
            <Route path="/dm/:dmId" element={<DM />} />
            <Route path="/dm" element={<MessageHub />} />
            <Route path="/" element={<Navigate to="/feed" replace />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
