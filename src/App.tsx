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
import MessageHub from "./MessageHub";
import { Button, Flex, Image, Menu, MenuItem } from "@aws-amplify/ui-react";
//import '@aws-amplify/ui-react/styles.css'

function App() {
  //const navigate = useNavigate()

  return (
    <Router>
      <Flex
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        alignContent="flex-start"
        wrap="nowrap"
        gap="1rem"
        id="navbar-card"
      >
        <Link to={`/feed`} height="100%">
          <Image alt="Kraken Logo" src="/Kraken.png" height="100%" />
        </Link>
        <SearchBar />
        <Menu size="large" menuAlign="center">
          <MenuItem>Subscritions</MenuItem>
          <MenuItem
            //onClick={() => navigate(`/dm`)}
          >Direct Messages</MenuItem>
        </Menu>
        <Link to={`/profile`}>
          <Button variation="primary">Profile</Button>
        </Link>
      </Flex>
      <main>
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
      </main>
    </Router>
  );
}

export default App;
