"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, Instagram, Menu, MessageCircle, Search, ShoppingBag, X } from "lucide-react";

type Product = {
  name: string;
  type: "Plain" | "Patch Work" | "DTF Print" | "Print + Patch";
  colour: string;
  tone: string;
};

const collections = [
  { name: "Plain Kurtas", desc: "Clean, versatile bases for your style.", type: "Plain" },
  { name: "Patch Work", desc: "Mirror work, embroidery & festive details.", type: "Patch Work" },
  { name: "DTF Prints", desc: "Bold, premium custom printed designs.", type: "DTF Print" },
  { name: "Print + Patch", desc: "Mix print and traditional patch work.", type: "Print + Patch" }
] as const;

const products: Product[] = [
  { name: "Classic Ivory Kurta", type: "Plain", colour: "Ivory", tone: "#eee0c8" },
  { name: "Emerald Leaf Kurta", type: "DTF Print", colour: "Peacock Green", tone: "#174d46" },
  { name: "Mustard Mirror Kurta", type: "Patch Work", colour: "Mustard", tone: "#c99524" },
  { name: "Navy Heritage Kurta", type: "Print + Patch", colour: "Navy", tone: "#173b5b" },
  { name: "Maroon Floral Kurta", type: "DTF Print", colour: "Maroon", tone: "#7a252d" },
  { name: "Forest Mirror Kurta", type: "Patch Work", colour: "Green", tone: "#315849" },
  { name: "Sandstone Kurta", type: "Plain", colour: "Sand", tone: "#cbb493" },
  { name: "Royal Blue Fusion", type: "Print + Patch", colour: "Royal Blue", tone: "#2e4f78" }
];

export default function Home() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const filtered = useMemo(() => products.filter((p) => {
    const categoryMatch = category === "All" || p.type === category;
    const searchMatch = (p.name + " " + p.type + " " + p.colour).toLowerCase().includes(search.toLowerCase());
    return categoryMatch && searchMatch;
  }), [category, search]);

  const addToCart = () => setCartCount((n) => n + 1);

  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <a className="logo" href="#" onClick={() => setMenuOpen(false)}>
            <span className="logo-mark">HC</span><span>HINGLAJ<small>Creation</small></span>
          </a>
          <nav className={"nav-links " + (menuOpen ? "nav-links-open" : "")}>
            <a href="#shop" onClick={() => setMenuOpen(false)}>Shop</a>
            <a href="#collections" onClick={() => setMenuOpen(false)}>Collections</a>
            <a href="#custom" onClick={() => setMenuOpen(false)}>Custom Design</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </nav>
          <div className="nav-actions">
            <div className="search-wrap"><Search size={17}/><input aria-label="Search products" placeholder="Search kurtas" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            <button className="icon-btn mobile-menu-btn" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={18}/> : <Menu size={18}/>}</button>
            <button className="icon-btn" aria-label="Shopping bag" onClick={() => setCartOpen(true)}><ShoppingBag size={18}/>{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}</button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero"><div className="container"><div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Navratri Collection 2026</span>
            <h1>Your Style.<br/>Your Kurta.</h1>
            <p>Traditional roots, modern style. Discover men's kurtas with DTF prints, handcrafted patch work and custom combinations made for your festive look.</p>
            <div className="btn-row"><a className="btn btn-gold" href="#shop">Shop Collection <ArrowRight size={17}/></a><a className="btn btn-light" href="#custom">Create Custom Kurta</a></div>
            <div className="trust-row"><span><Check size={15}/> Sizes S–XXL</span><span><Check size={15}/> Customisation</span><span><Check size={15}/> Men's Kurtas</span></div>
          </div>
          <div className="hero-art"><div className="hero-badge">HINGLAJ<br/><span>CREATION</span></div><div className="kurta-silhouette"/><div className="hero-caption">PRINT · PATCH · CUSTOM</div></div>
        </div></div></section>

        <section className="section" id="collections"><div className="container">
          <div className="section-head"><div><span className="eyebrow">Explore</span><h2>Find Your Style</h2></div><p>Choose a ready style or combine colours, prints and patches to create something uniquely yours.</p></div>
          <div className="collections">
            {collections.map((c, index) => <button className="collection collection-btn" key={c.name} onClick={() => { setCategory(c.type); document.getElementById("shop")?.scrollIntoView({behavior:"smooth"}); }}>
              <div><span className="collection-no">0{index + 1}</span><h3>{c.name}</h3><p>{c.desc}</p><span className="collection-link">Shop now <ArrowRight size={15}/></span></div>
            </button>)}
          </div>
        </div></section>

        <section className="section shop-section" id="shop"><div className="container">
          <div className="section-head shop-head"><div><span className="eyebrow">The Collection</span><h2>Shop Kurtas</h2></div>
            <div className="shop-controls">{["All","Plain","Patch Work","DTF Print","Print + Patch"].map((item) =>
              <button key={item} className={"filter " + (category === item ? "filter-active" : "")} onClick={() => setCategory(item)}>{item}</button>
            )}</div>
          </div>
          <div className="products">
            {filtered.map((p) => <article className="product-card" key={p.name}>
              <button className="product-img" style={{"--pc":p.tone} as React.CSSProperties} onClick={addToCart} aria-label={"Add " + p.name + " to cart"}>
                <span className="tag">{p.type}</span><span className="product-kurta"/><span className="quick-add">Add to bag</span>
              </button>
              <div className="product-body"><div className="product-type">{p.colour}</div><h3>{p.name}</h3><div className="meta">Sizes S–XXL · Customisation available</div>
                <div className="product-bottom"><span className="price">Custom Quote</span><button className="mini-add" onClick={addToCart}>+</button></div>
              </div>
            </article>)}
          </div>
          {filtered.length === 0 && <div className="empty-state">No kurtas found. Try another search or category.</div>}
        </div></section>

        <section className="section"><div className="container"><div className="custom" id="custom">
          <div><span className="eyebrow">Made Your Way</span><h2>Create Your Own Custom Style</h2><p>Choose your kurta colour, add DTF prints, pick patch work and mix elements to build a festive look that feels like you.</p>
            <a className="btn btn-gold" href="https://wa.me/917405652991" target="_blank">Start on WhatsApp <MessageCircle size={17}/></a>
          </div>
          <div className="steps"><div className="step"><b>01 · Choose your colour</b><span>Pick from the available kurta colours.</span></div><div className="step"><b>02 · Add DTF prints</b><span>Select a print style and placement.</span></div><div className="step"><b>03 · Pick patch work</b><span>Choose mirror work and festive patches.</span></div><div className="step"><b>04 · Mix & match</b><span>Combine the details for your own design.</span></div></div>
        </div></div></section>

        <section className="section feature-strip"><div className="container feature-grid"><div><strong>01</strong><span>Festive-ready designs</span></div><div><strong>02</strong><span>Custom print & patch</span></div><div><strong>03</strong><span>Sizes S to XXL</span></div><div><strong>04</strong><span>Order on WhatsApp</span></div></div></section>
      </main>

      <footer className="footer" id="contact"><div className="container footer-grid">
        <div><div className="logo"><span className="logo-mark">HC</span><span>HINGLAJ<small>Creation</small></span></div><p>Custom men's kurtas for Navratri and festive occasions. Traditional roots, modern style.</p></div>
        <div><b>Collections</b><p>Plain Kurtas<br/>Patch Work<br/>DTF Prints<br/>Print + Patch</p></div>
        <div><b>Connect</b><p>WhatsApp: 7405652991<br/>Instagram: @hinglaj.creation.store</p><div className="btn-row"><a className="btn btn-gold" href="https://wa.me/917405652991" target="_blank"><MessageCircle size={16}/> WhatsApp</a><a className="btn btn-light" href="https://instagram.com/hinglaj.creation.store" target="_blank"><Instagram size={16}/> Instagram</a></div></div>
      </div></footer>

      {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head"><h3>Your Bag</h3><button className="icon-btn" onClick={() => setCartOpen(false)}><X size={18}/></button></div>
        {cartCount === 0 ? <div className="cart-empty"><ShoppingBag size={38}/><h3>Your bag is empty</h3><p>Add a kurta to start building your order.</p><button className="btn btn-gold" onClick={() => setCartOpen(false)}>Continue Shopping</button></div> :
          <div className="cart-content"><div className="cart-item"><span className="cart-thumb"/><div><b>Selected Kurta</b><p>Custom quote · Size to be confirmed</p><button onClick={() => setCartCount(0)}>Remove</button></div></div><a className="btn btn-gold cart-wa" href="https://wa.me/917405652991?text=Hi%20Hinglaj%20Creation,%20I%20want%20to%20order%20a%20kurta." target="_blank">Continue on WhatsApp <MessageCircle size={17}/></a></div>}
      </aside></div>}
    </>
  );
}
