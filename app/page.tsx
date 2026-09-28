"use client";

import { ShoppingBag, Search, Menu, ArrowRight, MessageCircle, Instagram } from "lucide-react";

const collections = [
  { name: "Plain Kurtas", desc: "Clean, versatile bases for your style." },
  { name: "Patch Work", desc: "Mirror work, embroidery & festive details." },
  { name: "DTF Prints", desc: "Bold, premium custom printed designs." },
  { name: "Print + Patch", desc: "Mix print and traditional patch work." }
];

const products = [
  { name: "Emerald Leaf Kurta", type: "DTF Print", price: "Custom", color: "#174d46" },
  { name: "Mustard Mirror Kurta", type: "Patch Work", price: "Custom", color: "#d29a18" },
  { name: "Navy Heritage Kurta", type: "Print + Patch", price: "Custom", color: "#173b5b" },
  { name: "Maroon Floral Kurta", type: "DTF Print", price: "Custom", color: "#7a252d" }
];

export default function Home() {
  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <a className="logo" href="#">
            <span className="logo-mark">HC</span>
            <span>HINGLAJ<small>Creation</small></span>
          </a>
          <nav className="nav-links">
            <a href="#shop">Shop</a><a href="#collections">Collections</a><a href="#custom">Custom Design</a><a href="#contact">Contact</a>
          </nav>
          <div className="nav-actions">
            <button className="icon-btn" aria-label="Search"><Search size={18}/></button>
            <button className="icon-btn" aria-label="Shopping bag"><ShoppingBag size={18}/></button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <div className="hero-grid">
              <div className="hero-copy">
                <span className="eyebrow">Navratri Collection 2026</span>
                <h1>Your Style.<br/>Your Kurta.</h1>
                <p>Traditional roots, modern style. Discover men's kurtas with DTF prints, handcrafted patch work and custom combinations made for your festive look.</p>
                <div className="btn-row">
                  <a className="btn btn-gold" href="#shop">Shop Collection <ArrowRight size={17}/></a>
                  <a className="btn btn-light" href="#custom">Create Custom Kurta</a>
                </div>
              </div>
              <div className="hero-art"><div className="kurta-silhouette"/></div>
            </div>
          </div>
        </section>

        <section className="section" id="collections">
          <div className="container">
            <div className="section-head">
              <div><span className="eyebrow">Explore</span><h2>Find Your Style</h2></div>
              <p>Choose a ready style or combine colours, prints and patches to create something uniquely yours.</p>
            </div>
            <div className="collections">
              {collections.map(c => <a className="collection" href="#shop" key={c.name}><div><h3>{c.name}</h3><p>{c.desc}</p></div></a>)}
            </div>
          </div>
        </section>

        <section className="section" id="shop">
          <div className="container">
            <div className="section-head">
              <div><span className="eyebrow">Featured</span><h2>Selected Kurtas</h2></div>
              <a className="btn btn-light" style={{color:"var(--ink)",borderColor:"var(--line)"}} href="#collections">View All</a>
            </div>
            <div className="products">
              {products.map((p, i) => <article className="product-card" key={p.name}>
                <div className="product-img" style={{"--pc":p.color} as React.CSSProperties}><span className="tag">{p.type}</span></div>
                <div className="product-body"><h3>{p.name}</h3><div className="meta">Sizes S – XXL · Customisation available</div><div className="price">{p.price}</div></div>
              </article>)}
            </div>
          </div>
        </section>

        <section className="section" id="custom">
          <div className="container">
            <div className="custom">
              <div>
                <span className="eyebrow">Made Your Way</span>
                <h2>Create Your Own Custom Style</h2>
                <p>Choose your kurta colour, add DTF prints, pick patch work and mix elements to build a festive look that feels like you.</p>
                <a className="btn btn-gold" href="https://wa.me/917405652991">Start on WhatsApp <MessageCircle size={17}/></a>
              </div>
              <div className="steps">
                <div className="step"><b>01 · Choose your colour</b><span>Pick from the available kurta colours.</span></div>
                <div className="step"><b>02 · Add DTF prints</b><span>Select a print style and placement.</span></div>
                <div className="step"><b>03 · Pick patch work</b><span>Choose mirror work and festive patches.</span></div>
                <div className="step"><b>04 · Mix & match</b><span>Combine the details for your own design.</span></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" id="contact">
        <div className="container footer-grid">
          <div><div className="logo"><span className="logo-mark">HC</span><span>HINGLAJ<small>Creation</small></span></div><p>Custom men's kurtas for Navratri and festive occasions. Traditional roots, modern style.</p></div>
          <div><b>Collections</b><p>Plain Kurtas<br/>Patch Work<br/>DTF Prints<br/>Print + Patch</p></div>
          <div><b>Connect</b><p>WhatsApp: 7405652991<br/>Instagram: @hinglaj.creation.store</p><div className="btn-row"><a className="btn btn-gold" href="https://wa.me/917405652991"><MessageCircle size={16}/> WhatsApp</a><a className="btn btn-light" href="https://instagram.com/hinglaj.creation.store"><Instagram size={16}/> Instagram</a></div></div>
        </div>
      </footer>
    </>
  );
}
