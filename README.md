# MahResin World 🎨

A premium resin art e-commerce website built with React, Node.js, and Supabase.

![MahResin World](https://via.placeholder.com/1200x400/0F4A3A/F4B400?text=MahResin+World)

## ✨ Features

### Customer Features
- 🏠 **Beautiful Home Page** - Hero slider, featured products, AI section
- 🛍️ **Collections** - Browse products by categories
- 📱 **Responsive Design** - Works perfectly on all devices
- 🛒 **Shopping Cart** - Add items, adjust quantities, checkout
- ❤️ **Wishlist** - Save favorite items (with Supabase sync)
- 👤 **User Accounts** - Register, login, manage profile
- 📦 **Order Tracking** - View order history and status
- 📝 **Blog** - Read articles about resin art
- 🤖 **AI Features** - Image generation and chat assistant
- 📧 **Contact Form** - Send messages directly

### Admin Features
- 📊 **Dashboard** - Overview stats, revenue, recent orders
- 📁 **Collections Management** - Add, edit, delete collections
- 🏷️ **Products Management** - Full product CRUD with images
- ✍️ **Blog Management** - Create and manage blog posts
- 📦 **Orders Management** - View and update order status
- 👥 **Users Overview** - View registered users
- 📨 **Messages** - View contact form submissions

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Supabase SDK** - Auth & API
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Supabase** - Database & Auth
- **OpenAI** - AI features

### Database
- **PostgreSQL** (via Supabase)

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier works)
- OpenAI API key (optional, for AI features)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/mahresin-world.git
cd mahresin-world
```

### 2. Setup Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Run the SQL from `database/schema.sql`
4. Create a storage bucket named `images` (set as public)
5. Copy your project URL and keys

### 3. Setup Frontend
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
# Add your Supabase credentials
```

**.env file:**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000/api
```

### 4. Setup Backend
```bash
cd ../backend
npm install

# Create .env file
cp .env.example .env
# Add your credentials
```

**.env file:**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key  # Optional
PORT=5000
```

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` to see the app!

## 🔐 Admin Setup

1. Register a new account through the website
2. Go to Supabase SQL Editor
3. Run: `UPDATE profiles SET is_admin = TRUE WHERE email = 'your@email.com';`
4. Login at `/admin/login`

## 📁 Project Structure

```
mahresin-world/
├── frontend/
│   ├── public/
│   │   └── assets/
│   │       └── slider/         # Hero slider images
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/         # Admin layout
│   │   │   ├── Home/          # Home page components
│   │   │   ├── Layout/        # Navbar, Footer
│   │   │   └── UI/            # Reusable components
│   │   ├── context/           # Auth, Cart, Wishlist
│   │   ├── lib/               # Supabase, API config
│   │   └── pages/
│   │       ├── Admin/         # Admin pages
│   │       └── ...            # Public pages
│   ├── package.json
│   └── tailwind.config.js
├── backend/
│   ├── routes/                # API routes
│   ├── server.js
│   └── package.json
├── database/
│   └── schema.sql             # Supabase schema
└── README.md
```

## 🎨 Design System

### Colors
- **Primary Dark:** `#0F4A3A`
- **Primary Deeper:** `#0B3F33`
- **Card Background:** `#0E3B34`
- **Accent Yellow:** `#F4B400`
- **Accent Teal:** `#2DD4BF`
- **Text Light:** `#F0FDF4`
- **Text Muted:** `#86EFAC`

### Fonts
- **Headings:** Playfair Display
- **Body:** Inter

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/collections` | Get all collections |
| GET | `/api/products` | Get all products |
| GET | `/api/products?featured=true` | Get featured products |
| GET | `/api/blogs` | Get all blogs |
| POST | `/api/orders` | Create order |
| GET | `/api/orders?user_id=xxx` | Get user orders |
| POST | `/api/wishlist` | Add to wishlist |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/ai/generate-image` | Generate AI image |
| POST | `/api/ai/chat` | AI chat assistant |

## 📸 Slider Images

Place your slider images in:
```
frontend/public/assets/slider/
├── sliderimage1.jpeg
├── sliderimage2.jpeg
├── sliderimage3.jpeg
└── sliderimage4.jpeg
```

Or copy from `d:\Aqsa-jhali\Sliderimages\`

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the dist folder
```

### Backend (Railway/Render)
```bash
cd backend
# Push to GitHub
# Connect to Railway/Render
```

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Credits

- Design inspired by modern e-commerce trends
- Built with ❤️ for MahResin World

---

**Need help?** Open an issue or contact support.
