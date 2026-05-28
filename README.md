# 🍿 Prakriti Pops — Bihar Ka Crunchy Revolution

Prakriti Pops is a modern e-commerce platform specializing in 100% natural, roasted makhana (fox nuts) from the heart of Mithila, Bihar. The project blends traditional purity with a GenZ-focused user experience.

## ✨ Features

### 🛒 Customer Experience
- **Dynamic Shop**: Browse makhana by categories and flavors.
- **Shopping Cart**: Seamless add-to-cart and quantity management powered by Zustand.
- **Checkout Flow**: Simplified checkout process with COD and Online payment options.
- **Order Tracking**: Track order status in real-time.
- **Multi-language**: Fully supported in **English** and **Hindi** for accessibility.
- **Responsive Design**: Optimized for all screen sizes using Tailwind CSS.

### 🧠 Admin Panel (The Brain)
- **Analytics Dashboard**: Visual insights into revenue, total orders, and top-selling products using Recharts.
- **Order Management**: Update order statuses (Pending $\rightarrow$ Confirmed $\rightarrow$ Shipped $\rightarrow$ Delivered) and delete orders.
- **Product Control**: Manage product listings, pricing, and visibility.
- **Coupons & Announcements**: Create discount codes and manage site-wide announcement banners.
- **Store Settings**: Control global settings like delivery charges, COD availability, and free delivery thresholds.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Backend/Database**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, and Real-time)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)

## 🚀 Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ravijeetchandra/prakriti-pops.git
   cd prakriti-pops
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**:
   Run the queries in `supabase/schema.sql` and `supabase/seed.sql` within your Supabase SQL Editor to set up the tables and initial data.

5. **Run the development server**:
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) to view the site.

## 🔑 Admin Access Setup

To access the admin panel at `/admin`:
1. **Create User**: Go to Supabase Dashboard $\rightarrow$ **Authentication** $\rightarrow$ **Users** $\rightarrow$ **Add User**.
2. **Grant Admin Role**: Go to **Table Editor** $\rightarrow$ `admin_users` table $\rightarrow$ **Insert Row** with the same email used for the Auth account.

## 🚢 Deployment

The recommended way to deploy this project is via **Vercel**.

### Steps to Deploy:
1. **Push to GitHub**: (Already done)
2. **Connect to Vercel**:
   - Log in to [Vercel](https://vercel.com).
   - Click **"Add New"** $\rightarrow$ **"Project"**.
   - Import the `prakriti-pops` repository from your GitHub account.
3. **Configure Environment Variables**:
   - In the Vercel project settings, add the same keys from your `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy**:
   - Click **"Deploy"**. Vercel will automatically build and host your site.

---
Made with ❤️ for the crunch of Bihar!
