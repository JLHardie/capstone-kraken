import type { Schema } from '../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { getCurrentUser } from 'aws-amplify/auth';

const client = generateClient<Schema>()

function Home() {
    const createForum = async () => {
        const { userId } = await getCurrentUser();
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