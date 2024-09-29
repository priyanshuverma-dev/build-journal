# Build Journal - Project Management App

Build Journal is a web application that helps developers document their project ideas, development progress, and feature additions, all in one place. It also allows generating markdown project logs, providing documentation, and tracking a project from start to end.

## Features

- **Project Documentation**: Automatically generate detailed markdown logs for project documentation.
- **Project Tracking**: Update your project with new features and development progress.
- **Authentication**: Secure login using GitHub OAuth.
- **Tech Stack**: Utilize your chosen tech stack to tailor your project setup.

---

## Getting Started

### Prerequisites

To run the project locally, ensure you have the following:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (for database connection)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/priyanshuverma-dev/build-journal.git
   cd build-journal
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Set up environment variables:**

   Create a `.env` file at the root of the project and add the following:

   ```bash
   DATABASE_URL=your-database-url
   AUTH_SECRET=your-auth-secret
   AUTH_GITHUB_ID=your-github-client-id
   AUTH_GITHUB_SECRET=your-github-client-secret
   GROQ_API_KEY=your-groq-api-key
   ```

4. **Run the application:**

   To run the project locally, use:

   ```bash
   bun dev
   ```

   The app should be running on `http://localhost:3000`.

---

## Environment Variables

The application requires the following environment variables to be set:

- **`DATABASE_URL`**: MongoDB connection URL.
- **`AUTH_SECRET`**: A secret key used for authentication sessions.
- **`AUTH_GITHUB_ID`**: GitHub OAuth application client ID for user authentication.
- **`AUTH_GITHUB_SECRET`**: GitHub OAuth application client secret for authentication.
- **`GROQ_API_KEY`**: API key used for copilotkit and other project-related content via GROQ queries.
- **`MISTRAL_API_KEY`**: API key used to generate markdown.

---

## Technologies Used

- **Next.js**: Server-side rendering and static site generation.
- **Tailwind CSS**: For responsive UI design.
- **NextAuth.js**: Authentication solution with GitHub OAuth.
- **Prisma**: Database ORM for MongoDB.
- **Framer Motion**: Animation and interactive UI elements.
- **AI APIs**: For markdown generation and copilotkit.

---

## Authentication

This project uses **GitHub OAuth** for authentication. To set up your GitHub OAuth credentials:

1. Go to [GitHub Developer Settings](https://github.com/settings/developers).
2. Create a new OAuth app.
3. Set the callback URL to `http://localhost:3000/api/auth/callback/github`.
4. Copy the **Client ID** and **Client Secret** into the `.env` file as `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`.

---

## Database Setup

This project uses **MongoDB** as the database. You can either host your MongoDB database on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or set it up locally. Add your MongoDB connection string to the `DATABASE_URL` environment variable.

---

## Deployment

For deploying this project, you can use platforms like **Vercel** or **Netlify** for serverless deployment. Be sure to set the necessary environment variables in the deployment environment.

---

## License

This project is licensed under the MIT License.
