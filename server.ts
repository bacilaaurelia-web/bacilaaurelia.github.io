import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Data Store (In-memory for demo)
  let posts = [
    {
      id: "1",
      title: "How to Build a Hidden Pantry in Under 2 Hours",
      slug: "hidden-pantry-hack",
      author: "Elena Vance",
      authorRole: "Lead Curator",
      date: "March 14, 2024",
      category: "Storage Hacks",
      excerpt: "In a city apartment where every square inch is precious, the gap between your fridge and the wall isn't just empty space—it's a missed opportunity.",
      content: `In a city apartment where every square inch is precious, the gap between your fridge and the wall isn't just empty space—it's a missed opportunity. Today, we're reclaiming it.

## The Anatomy of the "Skinny" Pantry

Most small kitchens suffer from 'shallow storage fatigue.' We fill deep cabinets with spices only to lose them in the dark abyss of the back row. A vertical, rolling pantry solves this by bringing every item into the light. This project requires no heavy demolition and can be completed before your Sunday brunch is over.

### THE 2-HOUR TOOLKIT
- 1x Pre-primed MDF board (custom width)
- 4x Heavy-duty rubber casters
- A decorative handle to match your cabinets

## Hack #1: The Tension Rod Divider
Before you build the frame, consider the internal organization. Instead of fixed shelves, use heavy-duty tension rods. This allows you to adjust the height of your shelving as your grocery needs change—perfect for taller olive oil bottles or short spice jars.

## Hack #2: Magnetic Backing
The secret to a high-end pantry isn't just the front facing—it's the utility on the back. Apply a sheet of thin galvanized steel to the side facing the fridge. Now, your pantry doubles as a magnetic message board for shopping lists or recipe cards.`,
      image: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?q=80&w=2070&auto=format&fit=crop",
      tags: ["#DIYHacks", "#KitchenStorage", "#RentalFriendly"]
    },
    {
      id: "2",
      title: "The 3-Mirror Rule for Expanding Small Studios",
      slug: "3-mirror-rule",
      author: "Elena Vance",
      date: "March 10, 2024",
      category: "Living Rooms",
      excerpt: "Mirrors are the oldest trick in the book, but positioning them correctly is an art form.",
      content: `Mirrors are the oldest trick in the book, but positioning them correctly is an art form. In a small studio, a single mirror isn't enough. You need the "3-Mirror Rule."

## 1. The Window Reflection
Place your largest mirror directly opposite your main window. This doubles the natural light and creates a "virtual window" that makes the room feel twice as deep.

## 2. The Narrow Hallway Trick
In narrow entryways, use a floor-to-ceiling mirror on one side. It breaks the "tunnel effect" and makes the transition into your main living space feel grander.

## 3. The Corner Expansion
Place a mirror in a dark corner. It reflects light back into the room and eliminates the "dead space" that often makes small rooms feel cramped.`,
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2064&auto=format&fit=crop",
      tags: ["#InteriorDesign", "#SmallSpaces", "#Lighting"]
    },
    {
      id: "3",
      title: "Mastering the Art of the Decanted Pantry",
      slug: "decanted-pantry",
      author: "Elena Vance",
      date: "March 5, 2024",
      category: "Kitchen Hacks",
      excerpt: "Uniformity is the secret to visual peace in a cluttered kitchen.",
      content: `Uniformity is the secret to visual peace in a cluttered kitchen. Decanting your dry goods into glass jars isn't just for aesthetics—it's a functional hack.

## Why Decant?
- **Visibility:** You know exactly when you're running low on flour.
- **Freshness:** Airtight seals keep pests out and flavor in.
- **Space:** Square jars stack better than irregular boxes.

## The Starter Set
Begin with your most-used items: rice, pasta, flour, and sugar. Use uniform labels for that high-end editorial look.`,
      image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=2070&auto=format&fit=crop",
      tags: ["#Organization", "#KitchenHacks", "#Minimalism"]
    }
  ];

  let leads = [];
  let subscribers = [];

  // API Routes
  app.get("/api/posts", (req, res) => {
    res.json(posts);
  });

  app.get("/api/posts/:slug", (req, res) => {
    const post = posts.find(p => p.slug === req.params.slug);
    if (post) res.json(post);
    else res.status(404).json({ error: "Post not found" });
  });

  app.post("/api/posts", (req, res) => {
    const newPost = { ...req.body, id: Date.now().toString() };
    posts.unshift(newPost);
    res.json(newPost);
  });

  app.delete("/api/posts/:id", (req, res) => {
    posts = posts.filter(p => p.id !== req.params.id);
    res.json({ success: true });
  });

  app.get("/api/stats", (req, res) => {
    res.json({
      posts: posts.length,
      subscribers: subscribers.length,
      leads: leads.length
    });
  });

  app.get("/api/subscribers", (req, res) => {
    res.json(subscribers);
  });

  app.get("/api/leads", (req, res) => {
    res.json(leads);
  });

  app.post("/api/subscribe", (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    subscribers.push({ email, date: new Date() });
    res.json({ success: true });
  });

  app.post("/api/contact", (req, res) => {
    const { name, email, message } = req.body;
    leads.push({ name, email, message, date: new Date() });
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
