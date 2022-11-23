This demonstrates how you can add security to a campaign query resolvers while still resolving the User Directory specific data in the User Directory service.

npm run install -> in each folder
npm run start -> in each folder



In Apollo Explorer you can query:

`query Participant($participantId: ID!, $campaignId: ID!, $token: String) {
  participant(id: $participantId) {
    __typename
    id
    lastName
    firstName
  }
  campaign(id: $campaignId, token: $token) {
    id
    participants {
      id
      lastName
      firstName
    }
  }
}`

Add these variables:
`
{
  "participantId": "2",
  "campaignId": "5",
  "token": "bad",
}
`
