# Portfolio API

Node.js + Express + MongoDB backend for portfolio projects. Supports categories, Cloudinary images, and full CRUD.

## Setup

1. **Install dependencies**
   ```bash
   cd api && npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your:
   - `MONGODB_URI` (local: `mongodb://localhost:27017/portfolio` or MongoDB Atlas connection string)
   - `JWT_SECRET` (long random string for admin auth, e.g. `openssl rand -hex 32`)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (from [Cloudinary Console](https://cloudinary.com/console))

3. **Seed sample data** (optional)
   ```bash
   node scripts/seed.js
   ```

4. **Run the server**
   ```bash
   npm run dev
   ```
   API runs at `http://localhost:5000`

## API Endpoints

**Auth** (admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/signup-allowed` | Public. `{ allowed: true }` only when no admin exists yet |
| POST | `/api/auth/signup` | Create first admin. Body: `{ email, password }` (min 6 chars) |
| POST | `/api/auth/login` | Login. Body: `{ email, password }`. Returns `{ token, email }` |
| GET | `/api/auth/me` | Current admin (requires `Authorization: Bearer <token>`) |

**Projects** — GET is public; POST/PUT/DELETE require `Authorization: Bearer <token>`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects (`?category=idOrSlug`, `?featured=true`) |
| GET | `/api/projects/:id` | Get single project |
| POST | `/api/projects` | Create project (auth required; supports `multipart/form-data` for images) |
| PUT | `/api/projects/:id` | Update project (auth required) |
| DELETE | `/api/projects/:id` | Delete project (auth required) |

**Categories** — GET is public; POST/PUT/DELETE require auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:id` | Get single category |
| POST | `/api/categories` | Create category (auth required) |
| PUT | `/api/categories/:id` | Update category (auth required) |
| DELETE | `/api/categories/:id` | Delete category (auth required) |

## Project Schema

- `title` (required)
- `description` (required)
- `category` (required, ref: Category)
- `link` - Live demo URL
- `repoUrl` - GitHub/source URL
- `techStack` - Array of strings (e.g. `["React", "Node.js"]`)
- `additionalTools` - Array of strings
- `images` - Array of `{ url, publicId?, alt? }` (Cloudinary URLs)
- `featured` - Boolean
- `order` - Number for sorting

## Creating a Project with Images

**JSON body** (images as URLs from Cloudinary dashboard):
```json
{
  "title": "My Project",
  "description": "A cool app",
  "category": "categoryIdHere",
  "link": "https://example.com",
  "techStack": ["React", "Node.js"],
  "additionalTools": ["Figma"],
  "images": [{"url": "https://res.cloudinary.com/.../image.jpg", "alt": "Screenshot"}]
}
```

**Multipart form-data** (upload files directly):
- `images` - File field (up to 10 images)
- Other fields as form fields (techStack/additionalTools as JSON strings)
