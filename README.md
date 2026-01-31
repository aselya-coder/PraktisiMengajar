# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## Deployment & Setup

### 1. Environment Variables
This project uses Supabase for authentication and data storage. You need to configure the environment variables.

1. Rename `.env.example` to `.env` (or create a new `.env` file).
2. Fill in the following variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL= # Optional: Leave empty for production/Vercel
   ```

### 2. Database Setup (Supabase)
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the SQL Editor in Supabase dashboard.
3. Run the SQL commands from `supabase_schema.sql` (included in this repo).
4. Create an Admin User:
   - Go to Authentication > Users.
   - Click "Add User" -> "Create New User".
   - Enter email and password.
   - Use these credentials to login at `/admin`.

### 3. Deploy to Vercel
1. Push this code to GitHub/GitLab/Bitbucket.
2. Import the project in Vercel.
3. Add the Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in Vercel Project Settings.
4. Deploy!

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
