# API Specification

## Authentication
- `POST /auth/register`: Register a new user.
  - Body: `{ email, password, fullName }`
- `POST /auth/login`: Login an existing user.
  - Body: `{ email, password }`
- `GET /auth/me`: Get current user info. (Authenticated)

## Chat
- `GET /chat`: Fetch user chat history. (Authenticated)
- `POST /chat`: Send a message and get a supportive response. (Authenticated)
  - Body: `{ message }`
  - Response: `{ response, sentiment, id, createdAt }`
- `DELETE /chat`: Clear chat history. (Authenticated)

## Mood
- `GET /mood`: Fetch user mood history. (Authenticated)
- `POST /mood`: Log daily mood. (Authenticated)
  - Body: `{ mood, label, note? }`
- `GET /mood/stats`: Get mood statistics. (Authenticated)
  - Response: `{ average, trend: [{ date, mood }] }`

## Dashboard
- `GET /dashboard/summary`: Get overall dashboard statistics. (Authenticated)
  - Response: `{ totalChats, averageMoodScore, userActivitySummary }`
