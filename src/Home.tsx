import type { Schema } from '../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { getCurrentUser } from 'aws-amplify/auth';

const client = generateClient<Schema>()
const { userId } = await getCurrentUser();

function Home() {
    const createForum = async () => {
        await client.models.Forum.create({
            name: window.prompt("Name for forum?"),
            belongsTo: userId
        })
    }

    return (
        <div>
            <button onClick={createForum}>Create Forum</button>
            <h2>Welcome to the Feed</h2>
        </div>
    )
}

export default Home;