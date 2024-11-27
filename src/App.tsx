import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import Forum from "./Forum";
import Post from "./Post";
import SearchBar from './SearchBar';
import Search from "./Search";
import Home from "./Home";
import CreatePost from "./CreatePost";
import Chatroom from "./Chatroom";
import Profile from "./Profile";
import DM from "./DM";
import { Flex } from "@aws-amplify/ui-react";
//import '@aws-amplify/ui-react/styles.css'

function App() {

  return (
    <Router>
      <div>
      <Flex
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        alignContent="flex-start"
        wrap="nowrap"
        gap="1rem"
      >
          <Link to={`/feed`}>
            <h1>Kraken</h1>
          </Link>
          <SearchBar />
          <Link to={`/profile`}>
            <button type="button">Profile</button>
          </Link>
        </Flex>
        <Routes>
          <Route path="/feed" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forum/:forumId" element={<Forum />} />
          <Route path="/forum/:forumId/create" element={<CreatePost />} />
          <Route path="/post/:postId" element={<Post />} />
          <Route path="/search" element={<Search />} />
          <Route path="/forum/:forumId/chat" element={<Chatroom />} />
          <Route path="/dm/:dmId" element={<DM />} />
          <Route path="/" element={<Navigate to="/feed" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
