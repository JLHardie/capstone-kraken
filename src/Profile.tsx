import { AccountSettings, Alert, Card, ThemeProvider } from '@aws-amplify/ui-react';
import { signOut } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';

export default function Profile() {

    const doSignOut = async () => {
        await signOut()
    }

    const passChangeSuccess = async () => {
        alert("Password change success!")
    }

    const theme = {
        name: 'custom-theme',
        tokens: {
          colors: {
            border: {
              primary: { value: '{colors.neutral.40}' },
              secondary: { value: '{colors.neutral.20}' },
              tertiary: { value: '{colors.neutral.10}' },
            },
          },
          radii: {
            small: { value: '2px' },
            medium: { value: '3px' },
            large: { value: '4px' },
            xl: { value: '6px' },
          },
        },
      };

    return (
        <div>
            <ThemeProvider theme={theme}>
                <h2>Profile</h2>
                <button type="button" onClick={doSignOut}>Sign Out</button>
                <Card>
                    <AccountSettings.ChangePassword 
                        onSuccess={passChangeSuccess}
                        displayText={{
                            currentPasswordFieldLabel: 'Enter current password',
                            newPasswordFieldLabel: 'Enter new password',
                            confirmPasswordFieldLabel: 'Confirm your password',
                            updatePasswordButtonText: 'Update your password',
                        }}  
                    />
                </Card>
            </ThemeProvider>
        </div>
    )
}