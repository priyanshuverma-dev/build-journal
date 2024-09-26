This is a Next.js Auth Starter Project with prisma and next-auth.

## Getting Started

1. Clone the repository
2. Install the dependencies
3. Create a `.env` file in the root of the project and copy the contents of the `.env.example` file into it. Replace the values with your own. The `DATABASE_URL` should be a connection string to your Mongodb database. The `AUTH_SECRET` should be a random string. The `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` should be the client id and client secret of your Github OAuth app. The `NEXTAUTH_URL` should be the URL of your application.

For example, if you are running the application locally, the value should be `http://localhost:3000`. The `.env` file should look like this

```
DATABASE_URL="mnogodb://localhost:27017/your-database-name"
AUTH_SECRET=""

AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
```

4. Run the following commands to create the database and run the migrations:

```
npx prisma db push
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
