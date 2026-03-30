import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import { Menu, Search, Share2, Bookmark, ChevronRight, Mail, Instagram, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';

// --- Types ---
interface Post {
  id: string;
  title: string;
  slug: string;
  author: string;
  authorRole?: string;
  date: string;
  category: string;
  excerpt: string;
  content?: string;
  image: string;
  tags?: string[];
}

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      isScrolled ? "bg-white/80 backdrop-blur-xl shadow-sm py-3" : "bg-transparent py-5"
    )}>
      <nav className="flex justify-between items-center px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Menu className="w-6 h-6 text-on-surface cursor-pointer" />
          <Link to="/" className="text-xl font-black tracking-tighter text-on-surface font-sans">
            The Curated Sanctuary
          </Link>
        </div>
        <div className="hidden md:flex gap-8 items-center font-sans">
          <Link to="/" className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Home</Link>
          <Link to="/category/living-rooms" className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Living Rooms</Link>
          <Link to="/category/kitchen-hacks" className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Kitchen Hacks</Link>
          <Link to="/category/storage" className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Storage</Link>
        </div>
        <Search className="w-5 h-5 text-on-surface cursor-pointer" />
      </nav>
    </header>
  );
};

const Footer = () => (
  <footer className="w-full bg-stone-100 mt-20">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-10 py-16 max-w-7xl mx-auto">
      <div className="space-y-6">
        <p className="text-lg font-black text-on-surface font-sans">The Curated Sanctuary</p>
        <p className="text-sm font-serif italic text-on-surface-variant leading-relaxed">
          Editorial Living for Small Spaces. We believe that constraints are the ultimate catalyst for creativity.
        </p>
      </div>
      <div className="flex flex-col gap-4 font-sans">
        <p className="text-xs uppercase font-bold tracking-[0.2em] text-on-surface mb-2">Magazine</p>
        <Link to="/about" className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all">About Us</Link>
        <Link to="/policy" className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all">Editorial Policy</Link>
        <Link to="/privacy" className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all">Privacy</Link>
        <Link to="/contact" className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all">Contact</Link>
      </div>
      <div className="flex flex-col gap-4 font-sans">
        <p className="text-xs uppercase font-bold tracking-[0.2em] text-on-surface mb-2">Connect</p>
        <div className="flex gap-4">
          <Globe className="w-5 h-5 text-on-surface-variant cursor-pointer hover:text-primary" />
          <Instagram className="w-5 h-5 text-on-surface-variant cursor-pointer hover:text-primary" />
          <Mail className="w-5 h-5 text-on-surface-variant cursor-pointer hover:text-primary" />
        </div>
        <p className="text-[10px] text-stone-400 mt-8">© 2024 The Curated Sanctuary. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    setStatus('success');
    setEmail('');
  };

  return (
    <section className="my-20 bg-primary rounded-3xl p-10 text-center relative overflow-hidden text-on-primary">
      <div className="relative z-10 max-w-lg mx-auto">
        <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight font-sans">Curation, delivered.</h3>
        <p className="font-serif text-lg mb-8 opacity-90">Join 12,000+ urban dwellers receiving weekly guides on architectural living for small spaces.</p>
        
        {status === 'success' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 text-xl font-sans font-bold">
            <CheckCircle2 className="w-6 h-6" /> Thank you for joining!
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow bg-white/10 border-none rounded-xl px-6 py-4 text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 outline-none" 
              placeholder="Email address" 
            />
            <button 
              disabled={status === 'loading'}
              className="bg-white text-primary font-sans font-bold uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-stone-100 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'Joining...' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
    </section>
  );
};

// --- Pages ---

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/api/posts').then(res => res.json()).then(setPosts);
  }, []);

  return (
    <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
      <section className="mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <span className="text-xs font-bold font-sans uppercase tracking-[0.3em] text-primary">Featured Story</span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none font-sans">
              Small Space, <br /> Big Living.
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed max-w-md">
              We curate the most innovative architectural hacks for modern urban dwellers.
            </p>
            <Link to="/post/hidden-pantry-hack" className="inline-flex items-center gap-2 bg-on-surface text-white px-8 py-4 rounded-full font-sans font-bold uppercase tracking-widest text-xs hover:bg-primary transition-all">
              Read Latest Hack <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1588854337236-6889d631faa8?q=80&w=2070&auto=format&fit=crop" 
              alt="Hero" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl font-black font-sans tracking-tight">Recent Hacks</h2>
          <Link to="/blog" className="text-xs font-bold font-sans uppercase tracking-widest text-on-surface-variant hover:text-primary">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <Link to={`/post/${post.slug}`}>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 mb-6 relative">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold font-sans uppercase tracking-widest">
                    {post.category}
                  </div>
                </div>
                <h3 className="text-xl font-bold font-sans group-hover:text-primary transition-colors leading-tight mb-2">{post.title}</h3>
                <p className="text-on-surface-variant text-sm line-clamp-2 italic">{post.excerpt}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      
      <Newsletter />
    </main>
  );
};

const PostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [related, setRelated] = useState<Post[]>([]);

  useEffect(() => {
    fetch(`/api/posts/${slug}`).then(res => res.json()).then(setPost);
    fetch('/api/posts').then(res => res.json()).then(data => setRelated(data.filter((p: Post) => p.slug !== slug)));
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) return <div className="pt-40 text-center font-sans uppercase tracking-widest text-xs">Loading...</div>;

  return (
    <main className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-on-surface-variant font-sans mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/category/${post.category.toLowerCase().replace(' ', '-')}`} className="hover:text-primary transition-colors">{post.category}</Link>
        </nav>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-on-surface leading-tight mb-8 font-sans">
          {post.title}
        </h1>
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-stone-200 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop" alt="Author" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold font-sans uppercase tracking-wider text-on-surface">By {post.author}</p>
              <p className="text-xs text-on-surface-variant italic">{post.authorRole || 'Contributor'} • {post.date}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-100 text-on-surface hover:bg-primary/10 transition-all">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-100 text-on-surface hover:bg-primary/10 transition-all">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 mb-16">
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-stone-100 shadow-xl">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-6">
        <div className="markdown-body">
          <ReactMarkdown>{post.content || ''}</ReactMarkdown>
        </div>

        <div className="flex flex-wrap gap-2 mt-16 border-t border-outline-variant/20 pt-8">
          {post.tags?.map(tag => (
            <span key={tag} className="px-4 py-1.5 bg-stone-100 text-[10px] font-bold font-sans uppercase tracking-widest rounded-full text-on-surface-variant hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors">
              {tag}
            </span>
          ))}
        </div>
      </article>

      <section className="max-w-7xl mx-auto px-6 mt-24">
        <h4 className="text-xs font-bold font-sans uppercase tracking-[0.2em] text-on-surface-variant mb-10 text-center">Continue Reading</h4>
        <div className="flex overflow-x-auto pb-8 gap-8 no-scrollbar snap-x">
          {related.map(p => (
            <div key={p.id} className="min-w-[300px] md:min-w-[400px] snap-start group cursor-pointer">
              <Link to={`/post/${p.slug}`}>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 mb-6">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <p className="text-[10px] font-bold font-sans uppercase tracking-widest text-primary mb-2">{p.category}</p>
                <h5 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors font-sans">{p.title}</h5>
              </Link>
            </div>
          ))}
        </div>
      </section>
      
      <div className="max-w-3xl mx-auto px-6">
        <Newsletter />
      </div>
    </main>
  );
};

const AboutPage = () => (
  <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
    <h1 className="text-5xl font-black font-sans tracking-tighter mb-8">Our Mission</h1>
    <div className="prose prose-stone prose-lg">
      <p className="italic text-xl text-on-surface-variant mb-8">
        We believe that living small shouldn't mean living less.
      </p>
      <p>
        The Curated Sanctuary was born out of a necessity to find beauty and function in the tightest of urban quarters. Our team of designers and architects scour the globe for the most innovative hacks that transform cramped apartments into breathable sanctuaries.
      </p>
      <p>
        Every hack we share is tested for practicality, aesthetic value, and rental-friendliness. We're here to help you reclaim your space, one square inch at a time.
      </p>
    </div>
  </main>
);

const ContactPage = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => setStatus('success'), 1000);
  };

  return (
    <main className="pt-32 pb-20 px-6 max-w-xl mx-auto">
      <h1 className="text-5xl font-black font-sans tracking-tighter mb-8">Get in Touch</h1>
      {status === 'success' ? (
        <div className="bg-primary/10 p-8 rounded-2xl text-primary font-bold font-sans">
          Message sent! We'll get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold font-sans uppercase tracking-widest mb-2">Name</label>
            <input required className="w-full bg-stone-100 border-none rounded-xl p-4 focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-xs font-bold font-sans uppercase tracking-widest mb-2">Email</label>
            <input type="email" required className="w-full bg-stone-100 border-none rounded-xl p-4 focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-xs font-bold font-sans uppercase tracking-widest mb-2">Message</label>
            <textarea required className="w-full bg-stone-100 border-none rounded-xl p-4 focus:ring-1 focus:ring-primary h-32" />
          </div>
          <button className="w-full bg-on-surface text-white py-4 rounded-xl font-sans font-bold uppercase tracking-widest text-xs hover:bg-primary transition-all">
            Send Message
          </button>
        </form>
      )}
    </main>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ posts: 0, subscribers: 0, leads: 0 });
  const [posts, setPosts] = useState<Post[]>([]);
  const [view, setView] = useState<'stats' | 'posts' | 'new'>('stats');

  useEffect(() => {
    fetch('/api/stats').then(res => res.json()).then(setStats);
    fetch('/api/posts').then(res => res.json()).then(setPosts);
  }, []);

  const deletePost = async (id: string) => {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black tracking-tighter">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button onClick={() => setView('stats')} className={cn("px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest", view === 'stats' ? "bg-primary text-white" : "bg-stone-100")}>Stats</button>
          <button onClick={() => setView('posts')} className={cn("px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest", view === 'posts' ? "bg-primary text-white" : "bg-stone-100")}>Posts</button>
          <button onClick={() => setView('new')} className={cn("px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest", view === 'new' ? "bg-primary text-white" : "bg-stone-100")}>New Post</button>
        </div>
      </div>

      {view === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Total Posts</p>
            <p className="text-5xl font-black">{stats.posts}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Subscribers</p>
            <p className="text-5xl font-black">{stats.subscribers}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Leads</p>
            <p className="text-5xl font-black">{stats.leads}</p>
          </div>
        </div>
      )}

      {view === 'posts' && (
        <div className="space-y-4">
          {posts.map(p => (
            <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex justify-between items-center">
              <div>
                <p className="font-bold">{p.title}</p>
                <p className="text-xs text-on-surface-variant">{p.date}</p>
              </div>
              <button onClick={() => deletePost(p.id)} className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700">Delete</button>
            </div>
          ))}
        </div>
      )}

      {view === 'new' && (
        <div className="max-w-2xl bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
          <p className="italic text-on-surface-variant mb-8">New post functionality would go here (Form + API call).</p>
        </div>
      )}
    </main>
  );
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:slug" element={<PostPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </Router>
  );
};

export default App;
