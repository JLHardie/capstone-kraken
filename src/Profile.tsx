import { signOut } from 'aws-amplify/auth';

export default function Profile() {

    const doSignOut = async () => {
        await signOut()
    }

    return (
        <div>
            <h2>Profile</h2>
            <button type="button" onClick={doSignOut}>Sign Out</button>
        </div>
    )
}