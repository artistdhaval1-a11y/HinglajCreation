"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronDown, Instagram, Menu, MessageCircle, Search, ShoppingBag, X } from "lucide-react";

const colours = [
  ["White","#f5f2ea"],["Maroon","#7b2028"],["Mustard","#c99a21"],
  ["Navy Blue","#173b5b"],["Olive Green","#526044"],["Sky Blue","#8db8ca"],
  ["Peach","#e8b49d"],["Lavender","#b9a9cf"],["Black","#222222"]
];

const categories = ["All","Plain","Patch Work","DTF Print","Print + Patch"];

const products = [
  ["Classic Plain Kurta","Plain","White","#f5f2ea"],
  ["Classic Plain Kurta","Plain","Maroon","#7b2028"],
  ["Classic Plain Kurta","Plain","Mustard","#c99a21"],
  ["Classic Plain Kurta","Plain","Navy Blue","#173b5b"],
  ["Classic Plain Kurta","Plain","Olive Green","#526044"],
  ["Classic Plain Kurta","Plain","Sky Blue","#8db8ca"],
  ["Classic Plain Kurta","Plain","Peach","#e8b49d"],
  ["Classic Plain Kurta","Plain","Lavender","#b9a9cf"],
  ["Classic Plain Kurta","Plain","Black","#222222"]
];

const optionSizes = ["Small","Medium","Large"];
const positions = ["Front","Back"];
const kurtaSizes = ["S","M","L","XL","XXL"];

export default function Home() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedColour, setSelectedColour] = useState("White");
  const [selectedTone, setSelectedTone] = useState("#f5f2ea");
  const [kurtaSize, setKurtaSize] = useState("");
  const [patchSize, setPatchSize] = useState("");
  const [patchPosition, setPatchPosition] = useState("");
  const [printSize, setPrintSize] = useState("");
  const [printPosition, setPrintPosition] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const filtered = useMemo(() => products.filter((p) => {
    const categoryMatch = category === "All" || p[1] === category;
    const searchMatch = (p[0] + " " + p[2]).toLowerCase().includes(search.toLowerCase());
    return categoryMatch && searchMatch;
  }), [category, search]);

  const plainAdded = cartCount > 0;
  const configurationReady = plainAdded && !!kurtaSize && (!patchSize || patchPosition) && (!printSize || printPosition);

  function addPlain(colour = selectedColour, tone = selectedTone) {
    setSelectedColour(colour);
    setSelectedTone(tone);
    setCartCount(1);
    document.getElementById("customise")?.scrollIntoView({behavior:"smooth"});
  }

  function addConfiguration() {
    if (!configurationReady) return;
    setCartCount(1);
    setCartOpen(true);
  }

  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <a className="logo-image" href="#"><img src="/hinglaj-logo.svg" alt="Hinglaj Creation"/></a>
          <nav className={"nav-links " + (menuOpen ? "nav-links-open" : "")}>
            <a href="#shop" onClick={() => setMenuOpen(false)}>Shop</a>
            <a href="#customise" onClick={() => setMenuOpen(false)}>Customise</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>How It Works</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </nav>
          <div className="nav-actions">
            <div className="search-wrap"><Search size={17}/><input placeholder="Search colours" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            <button className="icon-btn mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">{menuOpen ? <X size={18}/> : <Menu size={18}/>}</button>
            <button className="icon-btn" onClick={() => setCartOpen(true)} aria-label="Shopping bag"><ShoppingBag size={18}/>{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}</button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero hero-custom"><div className="container"><div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Hinglaj Custom Studio</span>
            <h1>Start with a<br/>plain kurta.</h1>
            <p>Choose your base colour, then build your own look with a patch, a DTF print, or both. You decide the size and placement.</p>
            <div className="btn-row"><a className="btn btn-gold" href="#shop">Choose Your Kurta <ArrowRight size={17}/></a><a className="btn btn-light" href="#how">How it works</a></div>
            <div className="trust-row"><span><Check size={15}/> Custom made</span><span><Check size={15}/> Sizes S–XXL</span><span><Check size={15}/> Front / Back</span></div>
          </div>
          <div className="hero-art"><div className="hero-badge">CUSTOM<br/><span>YOUR WAY</span></div><div className="kurta-silhouette"/><div className="hero-caption">PLAIN · PATCH · PRINT</div></div>
        </div></div></section>

        <section className="section shop-section" id="shop"><div className="container">
          <div className="section-head shop-head">
            <div><span className="eyebrow">Step 01</span><h2>Choose Your Plain Kurta</h2><p>Pick your base colour. If you want it plain, simply add it to cart. You can also customise it below.</p></div>
          </div>
          <div className="shop-controls shop-controls-wide">
            {categories.map((item) => <button key={item} className={"filter " + (category === item ? "filter-active" : "")} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
          <div className="plain-grid">
            {filtered.map((p, i) => <article className={"plain-card " + (selectedColour === p[2] ? "plain-selected" : "")} key={p[2]}>
              <button className="plain-visual" style={{"--pc":p[3]} as React.CSSProperties} onClick={() => {setSelectedColour(p[2]);setSelectedTone(p[3]);}} aria-label={"Select " + p[2] + " kurta"}>
                <span className="product-kurta"/>
              </button>
              <div className="plain-body"><div className="product-type">{p[2]}</div><h3>{p[0]}</h3><div className="meta">Sizes S–XXL · Plain base</div>
                <button className="btn btn-dark full-btn" onClick={() => addPlain(p[2],p[3])}>Add to Cart <ShoppingBag size={16}/></button>
              </div>
            </article>)}
          </div>
        </div></section>

        <section className="section customise-section" id="customise"><div className="container">
          <div className="section-head"><div><span className="eyebrow">Step 02</span><h2>Build Your Custom Kurta</h2><p>Base: <strong>{selectedColour}</strong> plain kurta. Add a patch, a print, or both.</p></div></div>
          <div className="builder">
            <aside className="builder-preview">
              <div className="preview-label">YOUR KURTA</div>
              <div className="preview-stage"><div className="preview-kurta" style={{"--pc":selectedTone} as React.CSSProperties}>
                {patchSize && <span className={"preview-detail patch-detail " + patchSize.toLowerCase() + " " + patchPosition.toLowerCase()}>PATCH</span>}
                {printSize && <span className={"preview-detail print-detail " + printSize.toLowerCase() + " " + printPosition.toLowerCase()}>PRINT</span>}
              </div></div>
              <div className="preview-colour"><span className="colour-dot" style={{background:selectedTone}}/> {selectedColour}</div>
            </aside>

            <div className="builder-options">
              <div className="builder-card"><div className="builder-title"><span>1</span><div><h3>Plain Kurta</h3><p>Selected base colour and size</p></div></div><div className="selected-pill"><Check size={15}/> {selectedColour}</div><div className="option-label">Kurta size</div><div className="option-grid kurta-size-grid">{kurtaSizes.map(s => <button key={s} className={"choice " + (kurtaSize === s ? "choice-active" : "")} onClick={() => setKurtaSize(s)}>{s}</button>)}</div></div>

              <div className="builder-card">
                <div className="builder-title"><span>2</span><div><h3>Add Patch Work <em>Optional</em></h3><p>Choose patch size and placement.</p></div></div>
                <div className="option-label">Patch size</div>
                <div className="option-grid">{optionSizes.map(s => <button key={s} className={"choice " + (patchSize === s ? "choice-active" : "")} onClick={() => setPatchSize(patchSize === s ? "" : s)}>{s}</button>)}</div>
                {patchSize && <><div className="option-label">Patch placement</div><div className="option-grid two">{positions.map(s => <button key={s} className={"choice " + (patchPosition === s ? "choice-active" : "")} onClick={() => setPatchPosition(s)}>{s}</button>)}</div></>}
              </div>

              <div className="builder-card">
                <div className="builder-title"><span>3</span><div><h3>Add DTF Print <em>Optional</em></h3><p>Choose print size and placement.</p></div></div>
                <div className="option-label">Print size</div>
                <div className="option-grid">{optionSizes.map(s => <button key={s} className={"choice " + (printSize === s ? "choice-active" : "")} onClick={() => setPrintSize(printSize === s ? "" : s)}>{s}</button>)}</div>
                {printSize && <><div className="option-label">Print placement</div><div className="option-grid two">{positions.map(s => <button key={s} className={"choice " + (printPosition === s ? "choice-active" : "")} onClick={() => setPrintPosition(s)}>{s}</button>)}</div></>}
              </div>

              <div className="builder-summary">
                <div><span>Base</span><b>{selectedColour} · Size {kurtaSize || "Not selected"}</b></div>
                <div><span>Patch</span><b>{patchSize ? patchSize + " · " + patchPosition : "None"}</b></div>
                <div><span>Print</span><b>{printSize ? printSize + " · " + printPosition : "None"}</b></div>
                <button className="btn btn-gold full-btn" disabled={!configurationReady} onClick={addConfiguration}>{configurationReady ? "Add Custom Kurta to Cart" : "Select a placement to continue"} <ShoppingBag size={17}/></button>
              </div>
            </div>
          </div>
        </div></section>

        <section className="section how-section" id="how"><div className="container">
          <div className="section-head"><div><span className="eyebrow">Simple Process</span><h2>Build It Your Way</h2></div></div>
          <div className="process-grid"><div><strong>01</strong><h3>Choose the plain base</h3><p>Select your favourite colour from the nine options.</p></div><div><strong>02</strong><h3>Add patch work</h3><p>Pick Small, Medium or Large and Front or Back.</p></div><div><strong>03</strong><h3>Add DTF print</h3><p>Pick Small, Medium or Large and Front or Back.</p></div><div><strong>04</strong><h3>Order your design</h3><p>Review your combination and continue to cart.</p></div></div>
        </div></section>
      </main>

      <footer className="footer" id="contact"><div className="container footer-grid">
        <div><img className="footer-logo" src="/hinglaj-logo.svg" alt="Hinglaj Creation"/><p>Custom men's kurtas. Start with a plain kurta and build your own print and patch combination.</p></div>
        <div><b>Customise</b><p>Plain Kurta<br/>Patch Work<br/>DTF Print<br/>Front / Back</p></div>
        <div><b>Connect</b><p>WhatsApp: 7405652991<br/>Instagram: @hinglaj.creation.store</p><div className="btn-row"><a className="btn btn-gold" href="https://wa.me/917405652991" target="_blank"><MessageCircle size={16}/> WhatsApp</a><a className="btn btn-light" href="https://instagram.com/hinglaj.creation.store" target="_blank"><Instagram size={16}/> Instagram</a></div></div>
      </div></footer>

      {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head"><h3>Your Custom Order</h3><button className="icon-btn" onClick={() => setCartOpen(false)}><X size={18}/></button></div>
        {cartCount === 0 ? <div className="cart-empty"><ShoppingBag size={38}/><h3>Your bag is empty</h3><p>Choose a plain kurta to begin.</p><button className="btn btn-gold" onClick={() => setCartOpen(false)}>Choose Kurta</button></div> :
          <div className="cart-content">
            <div className="cart-item"><span className="cart-thumb" style={{background:"linear-gradient(145deg," + selectedTone + ",#d4af37)"}}/><div><b>{selectedColour} Plain Kurta</b><p>Size: {kurtaSize || "Not selected"}<br/>Patch: {patchSize ? patchSize + " · " + patchPosition : "None"}<br/>Print: {printSize ? printSize + " · " + printPosition : "None"}</p></div></div>
            <a className="btn btn-gold cart-wa" href={"https://wa.me/917405652991?text=" + encodeURIComponent("Hi Hinglaj Creation, I want this custom kurta: " + selectedColour + " plain kurta, size " + kurtaSize + ". Patch: " + (patchSize ? patchSize + " " + patchPosition : "None") + ". Print: " + (printSize ? printSize + " " + printPosition : "None") + ".")} target="_blank">Continue on WhatsApp <MessageCircle size={17}/></a>
          </div>}
      </aside></div>}
    </>
  );
}
