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
import { Button, Card, Flex, Grid, Image, Menu, MenuItem, View } from "@aws-amplify/ui-react";
//import '@aws-amplify/ui-react/styles.css'

export default function App() {
  //const navigate = useNavigate()

  return (
    <Router>
      <Grid
        columnGap="0.5rem"
        rowGap="0.5rem"
        templateColumns="15vw 85vw"
        templateRows="15vh 85vh"
      >
        <Flex
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          alignContent="flex-start"
          wrap="nowrap"
          gap="1rem"
          columnStart="1"
          columnEnd="-1"
        >
          <View as="div" height="100%" >
            <Link to={'/'}>
              <Image 
                alt="Kraken Logo" 
                src="/Kraken.png" 
                height="100%"
                objectFit="fill" />
            </Link>
            <SearchBar />
          </View>
          <Menu size="large" menuAlign="center">
            <MenuItem>Subscritions</MenuItem>
            <MenuItem>
              <Link to={'/dm'}>
                Direct Messages
              </Link>
            </MenuItem>
          </Menu>
          <Link to={`/profile`}>
            <Button variation="primary">Profile</Button>
          </Link>
        </Flex>
        <Card
          columnStart="1"
          columnEnd="2"
        >
          Nav
        </Card>
        <View
          as="div"
          columnStart="2"
          columnEnd="-1"
        >
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
        </View>
      </Grid>
    </Router>
  );
}
