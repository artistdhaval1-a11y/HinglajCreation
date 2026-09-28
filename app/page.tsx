"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { ArrowRight, Check, Instagram, Menu, MessageCircle, Search, ShoppingBag, X } from "lucide-react";

const colours = [
  ["White","#f5f2ea"],["Maroon","#7b2028"],["Mustard","#c99a21"],["Navy Blue","#173b5b"],
  ["Olive Green","#526044"],["Sky Blue","#8db8ca"],["Peach","#e8b49d"],["Lavender","#b9a9cf"],["Black","#222222"]
];
const kurtaCatalogImage = "data:image/webp;base64,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";
const products = colours.map(([name,tone]) => ["Classic Plain Kurta","Plain",name,tone]);
const sizes = ["S","M","L","XL","XXL"];
const addOnSizes = ["Small","Medium","Large"];
const patchPositions = ["Left Chest","Back"];
const printPositions = ["Front","Back"];
const patchPrices: Record<string,number> = { Small:50, Medium:100, Large:150 };
const printPrices: Record<string,number> = { Small:50, Medium:100, Large:150 };

export default function Home() {
  const [search,setSearch]=useState("");
  const [selectedColour,setSelectedColour]=useState("White");
  const [selectedTone,setSelectedTone]=useState("#f5f2ea");
  const [kurtaSize,setKurtaSize]=useState("");
  const [patchSize,setPatchSize]=useState("");
  const [patchPosition,setPatchPosition]=useState("");
  const [printSize,setPrintSize]=useState("");
  const [printPosition,setPrintPosition]=useState("");
  const [patchImage,setPatchImage]=useState("");
  const [printImage,setPrintImage]=useState("");
  const [cartOpen,setCartOpen]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  const [added,setAdded]=useState(false);

  const filtered=useMemo(()=>products.filter(p=>(p[0]+" "+p[2]).toLowerCase().includes(search.toLowerCase())),[search]);
  const patchPrice=patchSize ? patchPrices[patchSize] : 0;
  const printPrice=printSize ? printPrices[printSize] : 0;
  const total=225+patchPrice+printPrice;
  const ready=!!kurtaSize && (!patchSize || !!patchPosition) && (!printSize || !!printPosition);

  function choosePlain(colour:string,tone:string){setSelectedColour(colour);setSelectedTone(tone);setAdded(true);document.getElementById("customise")?.scrollIntoView({behavior:"smooth"});}
  function filePreview(e:ChangeEvent<HTMLInputElement>,type:"patch"|"print"){
    const file=e.target.files?.[0]; if(!file)return;
    const reader=new FileReader();
    reader.onload=()=>type==="patch"?setPatchImage(String(reader.result)):setPrintImage(String(reader.result));
    reader.readAsDataURL(file);
  }
  function addToCart(){if(ready){setAdded(true);setCartOpen(true);}}
  async function placeOrderOnWhatsApp(){
    const text = orderText + (patchImage || printImage ? "; Uploaded artwork: attached with this order." : "");
    const files: File[] = [];
    async function dataUrlToFile(dataUrl:string, name:string){
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      return new File([blob], name, { type: blob.type || "image/jpeg" });
    }
    try{
      if(patchImage) files.push(await dataUrlToFile(patchImage, "hinglaj-patch.jpg"));
      if(printImage) files.push(await dataUrlToFile(printImage, "hinglaj-dtf-print.jpg"));
      if(files.length && typeof navigator !== "undefined" && "share" in navigator && "canShare" in navigator && navigator.canShare({files})){
        await navigator.share({title:"Hinglaj Creation Order", text, files});
        return;
      }
    }catch(error){
      if(error instanceof DOMException && error.name === "AbortError") return;
    }
    window.open("https://wa.me/917405652991?text="+encodeURIComponent(text), "_blank");
  }
  const orderText="Hi Hinglaj Creation, I want to order a custom kurta. Colour: "+selectedColour+"; Size: "+kurtaSize+"; Base: ₹225; Patch: "+(patchSize?patchSize+" / "+patchPosition+" / ₹"+patchPrice:"None")+"; Print: "+(printSize?printSize+" / "+printPosition+" / ₹"+printPrice:"None")+"; Total: ₹"+total;

  return <>
    <header className="nav"><div className="container nav-inner">
      <a className="logo-image" href="#"><img src="/hinglaj-logo.svg" alt="Hinglaj Creation"/></a>
      <nav className={"nav-links "+(menuOpen?"nav-links-open":"")}><a href="#shop" onClick={()=>setMenuOpen(false)}>Shop</a><a href="#customise" onClick={()=>setMenuOpen(false)}>Customise</a><a href="#how" onClick={()=>setMenuOpen(false)}>How It Works</a><a href="#contact" onClick={()=>setMenuOpen(false)}>Contact</a></nav>
      <div className="nav-actions"><div className="search-wrap"><Search size={17}/><input placeholder="Search colour" value={search} onChange={e=>setSearch(e.target.value)}/></div><button className="icon-btn mobile-menu-btn" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X size={18}/>:<Menu size={18}/>}</button><button className="icon-btn" onClick={()=>setCartOpen(true)}><ShoppingBag size={18}/>{added&&<span className="cart-badge">1</span>}</button></div>
    </div></header>

    <main>
      <section className="hero hero-custom"><div className="container"><div className="hero-grid">
        <div className="hero-copy"><span className="eyebrow">Hinglaj Custom Studio</span><h1>Start with a<br/>plain kurta.</h1><p>Choose your base colour and size, then add your own patch, DTF print, or both. Upload your artwork and preview it on the kurta.</p><div className="btn-row"><a className="btn btn-gold" href="#shop">Choose Your Kurta <ArrowRight size={17}/></a><a className="btn btn-light" href="#how">How it works</a></div><div className="trust-row"><span><Check size={15}/> ₹225 plain kurta</span><span><Check size={15}/> Custom uploads</span><span><Check size={15}/> S–XXL</span></div></div>
        <div className="hero-art"><div className="hero-badge">CUSTOM<br/><span>YOUR WAY</span></div><div className="kurta-silhouette"/><div className="hero-caption">PLAIN · PATCH · PRINT</div></div>
      </div></div></section>

      <section className="section shop-section" id="shop"><div className="container">
        <div className="section-head"><div><span className="eyebrow">Step 01</span><h2>Choose Your Plain Kurta</h2><p>Every custom order starts at <strong>₹225</strong>. Choose a colour and add the plain kurta to your cart.</p></div></div>
        <div className="plain-grid">{filtered.map((p,i)=><article className={"plain-card "+(selectedColour===p[2]?"plain-selected":"")} key={p[2]}>
          <button className="plain-visual kurta-photo" style={{backgroundImage:"url("+kurtaCatalogImage+")",backgroundPosition:(i*12.5)+"% top"}} onClick={()=>{setSelectedColour(p[2]);setSelectedTone(p[3]);}} aria-label={p[2]+" kurta"} />
          <div className="plain-body"><div className="product-type">{p[2]}</div><h3>{p[0]}</h3><div className="meta">S–XXL · Plain base</div><div className="product-bottom"><span className="price">₹225</span><button className="btn btn-dark" onClick={()=>choosePlain(p[2],p[3])}>Add to Cart <ShoppingBag size={15}/></button></div></div>
        </article>)}</div>
      </div></section>

      <section className="section customise-section" id="customise"><div className="container">
        <div className="section-head"><div><span className="eyebrow">Step 02</span><h2>Customize Your Kurta</h2><p>Base: <strong>{selectedColour}</strong> · Plain kurta ₹225</p></div></div>
        <div className="builder">
          <aside className="builder-preview"><div className="preview-label">LIVE PREVIEW</div><div className="preview-stage"><div className="preview-kurta" style={{"--pc":selectedTone} as React.CSSProperties}>
            {patchImage&&<img className={"uploaded-art patch-art "+patchSize?.toLowerCase()+" "+patchPosition?.toLowerCase().replace(" ","-")} src={patchImage} alt="Uploaded patch preview"/>}
            {!patchImage&&patchSize&&<span className={"preview-detail patch-detail "+patchSize.toLowerCase()+" "+patchPosition?.toLowerCase().replace(" ","-")}>PATCH</span>}
            {printImage&&<img className={"uploaded-art print-art "+printSize?.toLowerCase()+" "+printPosition?.toLowerCase().replace(" ","-")} src={printImage} alt="Uploaded print preview"/>}
            {!printImage&&printSize&&<span className={"preview-detail print-detail "+printSize.toLowerCase()+" "+printPosition?.toLowerCase().replace(" ","-")}>PRINT</span>}
          </div></div><div className="preview-colour"><span className="colour-dot" style={{background:selectedTone}}/> {selectedColour} · Size {kurtaSize||"—"}</div></aside>

          <div className="builder-options">
            <div className="builder-card"><div className="builder-title"><span>1</span><div><h3>Kurta Size</h3><p>Choose your fitting size.</p></div></div><div className="option-grid kurta-size-grid">{sizes.map(s=><button key={s} className={"choice "+(kurtaSize===s?"choice-active":"")} onClick={()=>setKurtaSize(s)}>{s}</button>)}</div></div>

            <div className="builder-card"><div className="builder-title"><span>2</span><div><h3>Patch Work <em>Optional</em></h3><p>₹50 / ₹100 / ₹150 according to size.</p></div></div><div className="option-label">Patch placement</div><div className="option-grid two">{patchPositions.map(s=><button key={s} className={"choice "+(patchPosition===s?"choice-active":"")} onClick={()=>{setPatchPosition(s);if(s==="Back"&&patchSize!=="Large")setPatchSize("Large");}}>{s==="Left Chest"?"Front (Left Chest)":"Back Center"}</button>)}</div>{patchPosition&&<><div className="option-label">Patch size</div><div className="option-grid">{addOnSizes.filter(s=>patchPosition==="Left Chest"||s==="Large").map(s=><button key={s} className={"choice "+(patchSize===s?"choice-active":"")} onClick={()=>setPatchSize(patchSize===s?"":s)}>{s}<small>₹{patchPrices[s]}</small></button>)}</div><label className="upload-box"><span>Upload your patch</span><small>PNG/JPG · used for preview</small><input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>filePreview(e,"patch")}/>{patchImage&&<b>✓ Patch uploaded</b>}</label></>}</div>

            <div className="builder-card"><div className="builder-title"><span>3</span><div><h3>DTF Print <em>Optional</em></h3><p>₹50 / ₹100 / ₹150 according to size.</p></div></div><div className="option-label">Print size</div><div className="option-grid">{addOnSizes.map(s=><button key={s} className={"choice "+(printSize===s?"choice-active":"")} onClick={()=>{setPrintSize(printSize===s?"":s);if(printSize===s)setPrintPosition("");}}>{s}<small>₹{printPrices[s]}</small></button>)}</div>{printSize&&<><div className="option-label">Print placement</div><div className="option-grid two">{printPositions.map(s=><button key={s} className={"choice "+(printPosition===s?"choice-active":"")} onClick={()=>setPrintPosition(s)}>{s}</button>)}</div><label className="upload-box"><span>Upload your DTF print</span><small>PNG/JPG · transparent PNG recommended</small><input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>filePreview(e,"print")}/>{printImage&&<b>✓ Print uploaded</b>}</label></>}</div>

            <div className="builder-summary"><div><span>Plain Kurta</span><b>₹225</b></div><div><span>{selectedColour} · Size</span><b>{kurtaSize||"Not selected"}</b></div><div><span>Patch</span><b>{patchSize?patchSize+" · "+patchPosition+" · ₹"+patchPrice:"None · ₹0"}</b></div><div><span>DTF Print</span><b>{printSize?printSize+" · "+printPosition+" · ₹"+printPrice:"None · ₹0"}</b></div><div className="total-row"><span>Total</span><b>₹{total}</b></div><button className="btn btn-gold full-btn" disabled={!ready} onClick={addToCart}>{ready?"Add Custom Kurta to Cart":"Select kurta size to continue"} <ShoppingBag size={17}/></button></div>
          </div>
        </div>
      </div></section>

      <section className="section how-section" id="how"><div className="container"><div className="section-head"><div><span className="eyebrow">Simple Process</span><h2>Build It Your Way</h2></div></div><div className="process-grid"><div><strong>01</strong><h3>Choose plain kurta</h3><p>₹225 base price. Select colour and S–XXL size.</p></div><div><strong>02</strong><h3>Add patch</h3><p>Front (left chest): Small ₹50 · Medium ₹100 · Large ₹150. Back center: Large ₹150 only.</p></div><div><strong>03</strong><h3>Add DTF print</h3><p>Small ₹50 · Medium ₹100 · Large ₹150. Left chest or back.</p></div><div><strong>04</strong><h3>Upload & preview</h3><p>Upload your own patch/print and see an approximate preview before checkout.</p></div></div></div></section>
    </main>

    <footer className="footer" id="contact"><div className="container footer-grid"><div><img className="footer-logo" src="/hinglaj-logo.svg" alt="Hinglaj Creation"/><p>Custom men's kurtas. Start with a plain kurta and build your own print and patch combination.</p></div><div><b>Pricing</b><p>Plain Kurta ₹225<br/>Patch ₹50–₹150<br/>DTF Print ₹50–₹150</p></div><div><b>Connect</b><p>WhatsApp: 7405652991<br/>Instagram: @hinglaj.creation.store</p><div className="btn-row"><a className="btn btn-gold" href="https://wa.me/917405652991" target="_blank"><MessageCircle size={16}/> WhatsApp</a><a className="btn btn-light" href="https://instagram.com/hinglaj.creation.store" target="_blank"><Instagram size={16}/> Instagram</a></div></div></div></footer>

    {cartOpen&&<div className="drawer-backdrop" onClick={()=>setCartOpen(false)}><aside className="cart-drawer" onClick={e=>e.stopPropagation()}>
      <div className="drawer-head"><h3>Checkout Summary</h3><button className="icon-btn" onClick={()=>setCartOpen(false)}><X size={18}/></button></div>
      <div className="checkout-summary"><div className="cart-item"><span className="cart-thumb" style={{background:"linear-gradient(145deg,"+selectedTone+",#d4af37)"}}/><div><b>{selectedColour} Custom Kurta</b><p>Size: {kurtaSize}<br/>Patch: {patchSize?patchSize+" · "+patchPosition:"None"}<br/>Print: {printSize?printSize+" · "+printPosition:"None"}</p></div></div>
      <div className="checkout-lines"><div><span>Plain Kurta</span><b>₹225</b></div>{patchSize&&<div><span>{patchSize} Patch</span><b>+ ₹{patchPrice}</b></div>}{printSize&&<div><span>{printSize} DTF Print</span><b>+ ₹{printPrice}</b></div>}<div className="total-row"><span>Total</span><b>₹{total}</b></div></div>
      <button type="button" className="btn btn-gold cart-wa" onClick={placeOrderOnWhatsApp}>Place Order on WhatsApp <MessageCircle size={17}/></button><p className="whatsapp-note">{(patchImage||printImage)?"Your uploaded patch/print will be attached when your phone/browser supports WhatsApp file sharing.":"Your order details will open in WhatsApp."}</p></div>
    </aside></div>}
  </>;
}
