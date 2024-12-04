import { Card, Flex, Button, Link, Image } from "@aws-amplify/ui-react";
import SearchBar from "./SearchBar";

export default function Navbar() {
    return (
        <Card className="navbar-card">
        <Flex
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          alignContent="flex-start"
          wrap="nowrap"
          gap="1rem"
        >
          <Link to={`/feed`}>
            <Image alt="Kraken Logo" src="/Kraken.png" height="75px" width="75px" />
          </Link>
          <SearchBar />
          <Link to={`/profile`}>
            <Button>Profile</Button>
          </Link>
        </Flex>
      </Card>
    )
}