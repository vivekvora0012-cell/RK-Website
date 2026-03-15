# 🚀 Step-by-Step Deployment Guide (Beginner Friendly)

Follow these 4 simple parts to get **R.K. Industries** live on the internet!

---

## Part 1: Put your code on GitHub
GitHub is where Vercel will look to find your website code.

1.  **Go to [GitHub.com](https://github.com)** and log in (or create a free account).
2.  Click the **"+" icon** at the top right and select **"New repository"**.
3.  Give it a name (e.g., `rk-website`) and click **"Create repository"**.
4.  **Copy the URL** of your new repository (it looks like `https://github.com/yourname/rk-website.git`).
5.  Open your terminal in `d:\Website Data\RK_Website` and run these three commands (one by one):
    ```bash
    git remote add origin YOUR_COPIED_URL_HERE
    git branch -M main
    git push -u origin main
    ```

---

## Part 2: Set up your Cloud Database (Turso)
Since Vercel cannot store files, we use Turso to keep your products and blogs safe.

1.  **Go to [Turso.tech](https://turso.tech)** and sign up for a free account.
2.  Follow the onboarding to **Create a New Database** (give it a name like `rk-db`).
3.  Once created, click on your database to find the **URLs**:
    - **Database URL**: It starts with `libsql://...` (Copy this!)
    - **Auth Token**: Click "Generate Token" and copy the long string.
4.  Open your `.env` file in your code editor and add these lines:
    ```env
    TURSO_DATABASE_URL=your_libsql_url_here
    TURSO_AUTH_TOKEN=your_auth_token_here
    ```

---

## Part 3: Move your data to the Cloud
This step copies your local products and blogs to your new Turso database.

1.  In your terminal, run this command:
    ```bash
    node migrate-turso.js
    ```
2.  If you see **"🎉 Migration to Turso complete!"**, your cloud database is ready!

---

## Part 4: Connect to Vercel
This is the final step that makes your website public!

1.  **Go to [Vercel.com](https://vercel.com)** and sign up with GitHub.
2.  Click **"Add New..."** -> **"Project"**.
3.  Find your `rk-website` repository and click **"Import"**.
4.  In the **"Environment Variables"** section, ADD all your secrets from your `.env` file:
    - `ADMIN_PASSWORD` = `Vivek$7990`
    - `TURSO_DATABASE_URL` = (Your Turso URL)
    - `TURSO_AUTH_TOKEN` = (Your Turso Token)
5.  Click **"Deploy"**.

---

**That's it!** Vercel will give you a link (like `rk-website.vercel.app`) that anyone in the world can visit.
