# 🚀 Electrical Hall - Database Setup Guide

## SUPER SIMPLE STEP-BY-STEP

### 1. Go to Cloudflare Dashboard
Open your browser and go to: https://dash.cloudflare.com/

### 2. Create D1 Database
- Click "Workers & Pages" (left menu)
- Click "D1" (might be under "More" > "Databases")
- Click "Create Database"
- Name: `electrical-hall-db`
- Click "Create"

### 3. Copy Your Database ID
On the database page, find and copy the "Database ID" (looks like: `a1b2c3d4-e5f6-7890-abcd-1234567890ab`)

### 4. Update wrangler.toml
Open `wrangler.toml` and replace `your-database-id-here` with your actual database ID, then uncomment the lines:

```toml
#:schema node_modules/wrangler/config-schema.json
name = "electrical-hall-nig-ltd"
compatibility_date = "2024-04-01"

[vars]

# D1 Database
[[d1_databases]]
binding = "DB"
database_name = "electrical-hall-db"
database_id = "YOUR_ACTUAL_DATABASE_ID_HERE"
```

### 5. Run Migration
Open your terminal in the project folder and run:

```bash
npx wrangler d1 migrations apply electrical-hall-db --remote
```

### 6. Deploy!
Push your changes to GitHub, and Cloudflare Pages will automatically deploy everything!

---

## ✅ That's It!
Your app will now use a real database! All data will be saved permanently!
