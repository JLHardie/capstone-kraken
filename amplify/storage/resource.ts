import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'userImages',
  access: (allow) => ({
    'picture-submissions/*': [
      allow.authenticated.to(['read','write']),
      allow.guest.to(['read', 'write'])
    ],
  })
});