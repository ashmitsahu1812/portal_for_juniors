# 🚀 Deployment Guide: Portal for Juniors

This document outlines the step-by-step process to deploy both the **backend** (Node.js/Express) and **frontend** (React/Vite) of your application to production, connected to a cloud **MongoDB Atlas** database.

---

## 🗺️ Deployment Architecture

We recommend a **Split Deployment** model:
* **Database**: MongoDB Atlas (Free Cloud Database)
* **Backend API**: Render or Railway (Node.js Server hosting)
* **Frontend client**: Vercel or Netlify (Static hosting with custom domains and SSL)

---

## 1. 🗄️ Database Setup (MongoDB Atlas)

To move away from your local `localhost:27017` database, you'll need a managed cloud instance.

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Create a new project, then click **Create a Deployment** and select the **M1 Free Shared Tier**.
3. Choose your preferred cloud provider and region (close to your users/servers, e.g., AWS us-east-1 or ap-south-1).
4. **Security Configuration (Crucial)**:
   * **Database User**: Create a user with a username and strong password. **Write this down.**
   * **IP Access List**: For hosting platforms (like Render or Vercel), you must allow access from anywhere. Add `0.0.0.0/0` (allow access from all IPs) to the IP Whitelist.
5. In your cluster dashboard, click **Connect** -> **Drivers** and copy your **Connection String**. It will look similar to this:
   ```env
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
6. Replace `<username>` and `<password>` with the database credentials you created in step 4.

---

## 2. 🔌 Backend Deployment (Render)

Render is an easy-to-use platform that integrates directly with GitHub.

1. Create a [Render](https://render.com) account and click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. If your project is a monorepo, configure the following settings:
   * **Name**: `portal-backend`
   * **Region**: Select the same region as your MongoDB cluster.
   * **Runtime**: `Node`
   * **Root Directory**: `backend`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
   * **Instance Type**: `Free` (or any paid tier)
4. Go to the **Environment** tab on Render and add the following keys:

| Key | Value | Description |
| :--- | :--- | :--- |
| `MONGO_URI` | `mongodb+srv://...` | Your production MongoDB Atlas connection string |
| `JWT_SECRET` | `your_super_secret_random_key` | A strong random string to sign auth tokens |
| `CLIENT_ORIGIN` | `https://your-frontend-domain.vercel.app` | The production URL of your frontend (Vercel) |
| `NODE_ENV` | `production` | Sets server to run in production mode |

5. Click **Create Web Service**. Wait for the build to finish. Once successful, copy the live URL of your backend (e.g. `https://portal-backend.onrender.com`).

---

## 3. 🎨 Frontend Deployment (Vercel)

Vercel is optimized for frontend assets, rendering speed, and automated builds.

1. Create a [Vercel](https://vercel.com) account.
2. Click **Add New** -> **Project** and import your GitHub repository.
3. Configure the Project Settings:
   * **Framework Preset**: `Vite`
   * **Root Directory**: Select `frontend` (crucial!)
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Expand the **Environment Variables** section and add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://your-backend.onrender.com/api` | The Render backend URL followed by `/api` |

5. Click **Deploy**. Vercel will build your React code and deploy it to a live `.vercel.app` domain.
6. Once deployed, copy your frontend Vercel URL and update the **`CLIENT_ORIGIN`** environment variable in your **Render backend dashboard** to match this URL (to ensure CORS requests succeed).

---

## 4. 🚀 Seeding the Production Database

To populate your live database with modules, contests, and questions:

1. Locate the seed script in `backend/scripts/seed.js` or `backend/scripts/import_contest1.js`.
2. Locally, update your `backend/.env` file temporarily to point `MONGO_URI` to your live MongoDB Atlas connection string.
3. Run the following command from the `backend/` directory:
   ```bash
   npm run seed
   # or run specific scripts:
   node scripts/import_contest1.js
   ```
4. **⚠️ IMPORTANT**: Once the script completes, change your local `MONGO_URI` back to `mongodb://localhost:27017/lms_db` to avoid messing up production data during local testing.

---

## 🛠️ Post-Deployment Checklist

* [ ] CORS setup is verified (the frontend Vercel URL matches the backend `CLIENT_ORIGIN` exactly).
* [ ] Database IP Whitelist allows connection (`0.0.0.0/0`).
* [ ] Production DB seeded successfully.
* [ ] Testing signup and login works on the deployed URL.
* [ ] Code compilation (Python Judge) is working correctly on production.
