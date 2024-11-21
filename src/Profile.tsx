import { AccountSettings } from '@aws-amplify/ui-react';
import { signOut } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';

export default function Profile() {

    const doSignOut = async () => {
        await signOut()
    }

    return (
        <div>
            <h2>Profile</h2>
            <button type="button" onClick={doSignOut}>Sign Out</button>
            <AccountSettings.ChangePassword 
                displayText={{
                    currentPasswordFieldLabel: 'Enter current password',
                    newPasswordFieldLabel: 'Enter new password',
                    confirmPasswordFieldLabel: 'Confirm your password',
                    updatePasswordButtonText: 'Update your password',
                }}  
            />
        </div>
    )
}