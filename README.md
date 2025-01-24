# Chat Server - Real-Time Online Chat

## Getting Started ▶️

### Prerequisites

- Node.js (v18 or higher)
- Next.js (v13)
- Upstash account for database setup

### Steps

1. Clone this repository:

   ```bash
   git clone https://github.com/samuel032khoury/chatserver
   cd chatserver
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   - Add the following variables to `.env.local`:

     ```env
     NEXTAUTH_SECRET=<your_nextauth_secret>
     
     UPSTASH_REDIS_REST_URL=<your_upstash_redis_rest_url>
     UPSTASH_REDIS_REST_TOKEN=<your_upstash_redis_rest_token>
     
     GOOGLE_CLIENT_ID=<your_google_client_id>
     GOOGLE_CLIENT_SECRET=<your_google_client_secret>
     
     PUSHER_APP_ID=<your_pusher_app_id>
     NEXT_PUBLIC_PUSHER_APP_KEY=<your_next_public_pusher_app_key>
     PUSHER_APP_SECRET=<your_pusher_app_secret>
     ```

     - Generate NEXTAUTH_SECRET by running `npx auth secret` command.
     - Get Upstash API [here](https://upstash.com).
     - Set up Google OAuth Service at [Google Cloud Platform](https://console.cloud.google.com) > API & Services > Credentials
       - Make sure to add `http://<your_project_domain>` to the field *Authorized JavaScript origins*.
       - Make sure to add `http://<your_project_domain>/api/auth/callback/google` to the field *Authorized redirect URIs*.
     - Set up Pusher Service [here](https://pusher.com).

4. Run the development server:

   ```bash
   npm run dev
   ```

   The application will be accessible at `http://localhost:3000`.
