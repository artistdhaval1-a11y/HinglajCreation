"use client";

import { ChangeEvent, useState } from "react";
import { ArrowRight, Check, Instagram, Menu, MessageCircle, ShoppingBag, X } from "lucide-react";

const colours = [
  ["White","#f5f2ea"],
  ["Red","#b51f2a"],
  ["Baby Pink","#f3b6c5"],
  ["Dark Pink","#c94f78"],
  ["Maroon","#7b2028"],
  ["Sky Blue","#8db8ca"],
  ["Navy Blue","#173b5b"],
  ["Yellow","#e5c43d"],
  ["Mustard","#c99a21"],
  ["Orange","#e67e22"],
  ["Grey","#8a8a8a"],
  ["Black","#222222"],
  ["Olive Green","#526044"],
  ["Lavender","#b9a9cf"],
  ["Purple","#70458f"]
];
const kurtaCatalogImage = "https://d2ol7oe51mr4n9.cloudfront.net/user_3GaPnt7FT0FsavzgVsFIQBb4kgI/c60e2c6a-d2f9-490a-b60c-5d94e1044ca1.webp";
const sizes = ["S","M","L","XL","XXL"];
const addOnSizes = ["Small","Medium","Large"];
const printPositions = ["Front","Back","Both"];
const patchPrices: Record<string,number> = { Small:50, Medium:100, Large:150 };
const patchPlacementOptions = ["Left Chest","Right Chest","Sleeves","Long Front","Back Center","Multiple Small"];
const multipleQuantities = [2,3,4,5];
const printPrices: Record<string,number> = { Small:50, Medium:100, Large:150, "Full Print":250 };

export default function Home() {
  const [selectedColour,setSelectedColour]=useState("White");
  const [selectedTone,setSelectedTone]=useState("#f5f2ea");
  const [kurtaSize,setKurtaSize]=useState("");
  const [patchSize,setPatchSize]=useState("");
  const [patchPlacements,setPatchPlacements]=useState<string[]>([]);
  const [multipleQuantity,setMultipleQuantity]=useState(2);
  const [printSize,setPrintSize]=useState("");
  const [printPosition,setPrintPosition]=useState("");
  const [patchImage,setPatchImage]=useState("");
  const [printImage,setPrintImage]=useState("");
  const [cartOpen,setCartOpen]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  const [customerName,setCustomerName]=useState("");
  const [customerPhone,setCustomerPhone]=useState("");
  const [shippingAddress,setShippingAddress]=useState("");
  const [shippingCity,setShippingCity]=useState("");
  const [shippingState,setShippingState]=useState("");
  const [shippingPincode,setShippingPincode]=useState("");
  const [added,setAdded]=useState(false);
  const [orderCreatedId,setOrderCreatedId]=useState("");
  const selectedColourIndex=colours.findIndex(([name])=>name===selectedColour);
  const selectedSpritePosition={backgroundPosition:`${(selectedColourIndex%5)*25}% ${Math.floor(selectedColourIndex/5)*50}%`};
  const chestSelected=patchPlacements.includes("Left Chest") || patchPlacements.includes("Right Chest");
  const patchPrice=patchPlacements.reduce((sum,placement)=>{
    if(placement==="Left Chest" || placement==="Right Chest") return sum+(patchSize ? patchPrices[patchSize] : 0);
    if(placement==="Sleeves") return sum+100;
    if(placement==="Long Front") return sum+150;
    if(placement==="Back Center") return sum+150;
    if(placement==="Multiple Small") return sum+(multipleQuantity*50);
    return sum;
  },0);
  const patchDetailsText=patchPlacements.map(placement=>{
    if(placement==="Left Chest" || placement==="Right Chest") return patchSize+" "+placement;
    if(placement==="Multiple Small") return "Multiple Small ("+multipleQuantity+" patches)";
    return placement;
  }).join(" + ");
  const patchOrderText=patchPlacements.length ? patchDetailsText+" / ₹"+patchPrice : "None";
  const printBasePrice=printSize ? printPrices[printSize] : 0;
  const printPlacementCount=printPosition==="Both" ? 2 : printPosition ? 1 : 0;
  const printPrice=printSize ? printBasePrice*(printPlacementCount||1) : 0;
  const printDetailsText=printSize ? printSize+" / "+(printPosition||"Placement not selected")+" / ₹"+printPrice : "None";
  const total=249+patchPrice+printPrice;
  const finalTotal=total;
  const ready=!!kurtaSize && (!chestSelected || !!patchSize) && (!printSize || printSize==="Full Print" || !!printPosition);

  function filePreview(e:ChangeEvent<HTMLInputElement>,type:"patch"|"print"){
    const file=e.target.files?.[0]; if(!file)return;
    const reader=new FileReader();
    reader.onload=()=>type==="patch"?setPatchImage(String(reader.result)):setPrintImage(String(reader.result));
    reader.readAsDataURL(file);
  }
  function addToCart(){if(ready){setAdded(true);setCartOpen(true);}}
  async function placeOrderOnWhatsApp(){
    if(!kurtaSize){ window.alert("Please select a kurta size (S, M, L, XL or XXL)."); return; }
    if(!customerName.trim() || !/^\d{10}$/.test(customerPhone) || !shippingAddress.trim() || !shippingCity.trim() || !shippingState.trim() || !/^\d{6}$/.test(shippingPincode)){
      window.alert("Please complete your name, 10-digit mobile number and full delivery address.");
      return;
    }
    let savedOrderId=orderCreatedId;
    if(!savedOrderId){
      try{
        const patchDetails=patchOrderText;
        const printDetails=printDetailsText;
        const res=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
          customerName,customerPhone,shippingAddress,shippingCity,shippingState,shippingPincode,
          colour:selectedColour,size:kurtaSize,patchDetails,patchPrice,printDetails,printPrice,total,
          patchUploaded:!!patchImage,printUploaded:!!printImage
        })});
        const data=await res.json();
        if(!res.ok) throw new Error(data.error||"Could not save order.");
        savedOrderId=data.orderId;
        setOrderCreatedId(savedOrderId);
      }catch(error){
        window.alert(error instanceof Error?error.message:"Could not save the order. Please try again.");
        return;
      }
    }
    const text = "Order ID: "+savedOrderId+"; "+orderText + (patchImage || printImage ? "; Uploaded artwork: attached with this order." : "");
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
  const orderText = "Hi Hinglaj Creation, I want to order a custom kurta. Name: "+customerName+"; Mobile: "+customerPhone+"; Address: "+shippingAddress+", "+shippingCity+", "+shippingState+" - "+shippingPincode+"; Colour: "+selectedColour+"; Size: "+kurtaSize+"; Base: ₹249; Patch: "+patchOrderText+"; Print: "+printDetailsText+"; Product Total: ₹"+total+"; Shipping: Included Pan-India; Final Total: ₹"+finalTotal;

  return <>
    <header className="nav"><div className="container nav-inner">
      <a className="logo-image" href="#"><img src="/hinglaj-logo.svg" alt="Hinglaj Creation"/></a>
      <nav className={"nav-links "+(menuOpen?"nav-links-open":"")}><a href="#shop" onClick={()=>setMenuOpen(false)}>Shop</a><a href="#customise" onClick={()=>setMenuOpen(false)}>Customise</a><a href="#how" onClick={()=>setMenuOpen(false)}>How It Works</a><a href="/orders" onClick={()=>setMenuOpen(false)}>My Orders</a><a href="#contact" onClick={()=>setMenuOpen(false)}>Contact</a></nav>
      <div className="nav-actions"><button className="icon-btn mobile-menu-btn" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X size={18}/>:<Menu size={18}/>}</button><button className="icon-btn" onClick={()=>setCartOpen(true)}><ShoppingBag size={18}/>{added&&<span className="cart-badge">1</span>}</button></div>
    </div></header>

    <main>
      <section className="hero hero-custom"><div className="container"><div className="hero-grid">
        <div className="hero-copy"><span className="eyebrow">Hinglaj Custom Studio</span><h1>Start with a<br/>plain kurta.</h1><p>Choose your base colour and size, then add your own patch, DTF print, or both. Upload your artwork and preview it on the kurta.</p><div className="btn-row"><a className="btn btn-gold" href="#shop">Choose Your Kurta <ArrowRight size={17}/></a><a className="btn btn-light" href="#how">How it works</a></div><div className="trust-row"><span><Check size={15}/> ₹249 plain kurta</span><span><Check size={15}/> Custom uploads</span><span><Check size={15}/> S–XXL</span></div></div>
        <div className="hero-art"><img className="hero-photo" src="https://d2ol7oe51mr4n9.cloudfront.net/user_3GaPnt7FT0FsavzgVsFIQBb4kgI/272c73e9-cad2-4a4d-88d7-64d64e4f5698.png" alt="Hinglaj Creation custom kurta collection"/><div className="hero-badge">CUSTOM<br/><span>YOUR WAY</span></div><div className="hero-caption">PLAIN · PATCH · PRINT</div></div>
      </div></div></section>

      <section className="section shop-section" id="shop"><div className="container">
        <div className="section-head"><div><span className="eyebrow">Step 01</span><h2>Choose Your Plain Kurta</h2><p>Every custom order starts at <strong>₹249</strong>. Select one colour below, then continue to size and customisation.</p></div></div>
        <div className="colour-picker-card">
          <div className="colour-collage" role="group" aria-label="Choose kurta colour">
            {colours.map(([name,tone])=><button key={name} className={"colour-tile "+(selectedColour===name?"colour-tile-active":"")} onClick={()=>{setSelectedColour(name);setSelectedTone(tone);}} aria-label={"Select "+name+" kurta"}><span className="colour-swatch" style={{background:tone}}/><span className="colour-tile-label">{name}</span></button>)}</div>
          <div className="colour-picker-info">
            <div><span className="eyebrow">Selected Colour</span><h3>{selectedColour}</h3><p>Plain kurta · ₹249 · Sizes S–XXL</p></div>
            <button className="btn btn-gold" onClick={()=>document.getElementById("customise")?.scrollIntoView({behavior:"smooth"})}>Continue with {selectedColour} <ArrowRight size={17}/></button>
          </div>
        </div>
      </div></section>

      <section className="section customise-section" id="customise"><div className="container">
        <div className="section-head"><div><span className="eyebrow">Step 02</span><h2>Customize Your Kurta</h2><p>Base: <strong>{selectedColour}</strong> · Plain kurta ₹249</p></div></div>
        <div className="builder">
          <aside className="builder-preview"><div className="preview-label">LIVE PREVIEW</div><div className="preview-stage"><div className="preview-photo" style={{backgroundImage:`url(${kurtaCatalogImage})`,backgroundSize:"500% 300%",backgroundPosition:selectedSpritePosition.backgroundPosition}}></div></div><div className="preview-colour"><span className="colour-dot" style={{background:selectedTone}}/> {selectedColour} · Size {kurtaSize||"—"}</div><div className="preview-product-details"><div className="preview-product-heading"><span>PRODUCT DETAILS</span><b>Custom Men&apos;s Kurta</b></div><div className="preview-detail-row"><span>Colour</span><b>{selectedColour}</b></div><div className="preview-detail-row"><span>Size</span><b>{kurtaSize||"Not selected"}</b></div><div className="preview-detail-row"><span>Plain Kurta</span><b>₹249</b></div><div className="preview-detail-row"><span>Patch Work</span><b>{patchPrice?`₹${patchPrice}`:"None · ₹0"}</b></div><div className="preview-detail-row"><span>DTF Print</span><b>{printSize?`${printSize} · ₹${printPrice}`:"None · ₹0"}</b></div><div className="preview-detail-total"><span>Total</span><b>₹{total}</b></div></div></aside>

          <div className="builder-options">
            <div className="builder-card"><div className="builder-title"><span>1</span><div><h3>Kurta Size</h3><p>Choose your fitting size.</p></div></div><div className="option-grid kurta-size-grid">{sizes.map(s=><button key={s} className={"choice "+(kurtaSize===s?"choice-active":"")} onClick={()=>setKurtaSize(s)}>{s}</button>)}</div></div>

            <div className="builder-card"><div className="builder-title"><span>2</span><div><h3>Patch Work <em>Optional</em></h3><p>Select one or more placements. You can combine them.</p></div></div><div className="option-label">Choose patch placement(s)</div><div className="option-grid patch-placement-grid">{patchPlacementOptions.map(option=><button key={option} className={"choice "+(patchPlacements.includes(option)?"choice-active":"")} onClick={()=>setPatchPlacements(prev=>prev.includes(option)?prev.filter(item=>item!==option):[...prev,option])}>{option}<small>{option==="Left Chest"||option==="Right Chest"?"Choose size":option==="Sleeves"?"₹100":option==="Long Front"?"₹150":option==="Back Center"?"₹150":"₹50 each"}</small></button>)}</div>{chestSelected&&<><div className="option-label">Chest patch size</div><div className="option-grid">{addOnSizes.map(s=><button key={s} className={"choice "+(patchSize===s?"choice-active":"")} onClick={()=>setPatchSize(patchSize===s?"":s)}>{s}<small>₹{patchPrices[s]} per chest</small></button>)}</div></>}{patchPlacements.includes("Multiple Small")&&<><div className="option-label">Multiple small patches</div><select className="quantity-select" value={multipleQuantity} onChange={e=>setMultipleQuantity(Number(e.target.value))}>{multipleQuantities.map(q=><option key={q} value={q}>Quantity: {q} — ₹{q*50}</option>)}</select></>}{patchPlacements.length>0&&<label className="upload-box"><span>Upload your patch</span><small>PNG/JPG · used for all selected placement(s)</small><input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>filePreview(e,"patch")}/>{patchImage&&<b>✓ Patch uploaded</b>}</label>}<div className="patch-selection-note">{patchPlacements.length?"Selected: "+patchPlacements.join(" + "):"No patch selected"}</div></div>

            <div className="builder-card"><div className="builder-title"><span>3</span><div><h3>DTF Print <em>Optional</em></h3><p>Choose your print size, then select Front, Back, or Both.</p></div></div><div className="option-label">Print size</div><div className="option-grid">{addOnSizes.map(s=><button key={s} className={"choice "+(printSize===s?"choice-active":"")} onClick={()=>{setPrintSize(printSize===s?"":s);if(printSize===s)setPrintPosition("");}}>{s}<small>₹{printPrices[s]}</small></button>)}<button className={"choice "+(printSize==="Full Print"?"choice-active":"")} onClick={()=>{setPrintSize(printSize==="Full Print"?"":"Full Print");setPrintPosition("");}}>Full Print<small>₹250</small></button></div>{printSize&&<><div className="option-label">Print placement</div><div className="option-grid two">{printPositions.map(s=><button key={s} className={"choice "+(printPosition===s?"choice-active":"")} onClick={()=>setPrintPosition(s)}>{s}<small>{s==="Both"?"2 × print price":""}</small></button>)}</div><label className="upload-box"><span>Upload your DTF print</span><small>PNG/JPG · transparent PNG recommended</small><input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>filePreview(e,"print")}/>{printImage&&<b>✓ Print uploaded</b>}</label></>}</div>

            <div className="builder-summary"><div><span>Plain Kurta</span><b>₹249</b></div><div><span>{selectedColour} · Size</span><b>{kurtaSize||"Not selected"}</b></div><div><span>Patch</span><b>{patchPrice?patchOrderText.replace(" / ₹"," · ₹"): "None · ₹0"}</b></div><div><span>DTF Print</span><b>{printSize?printSize+" · "+(printPosition||"Placement not selected")+" · ₹"+printPrice:"None · ₹0"}</b></div><div className="total-row"><span>Total</span><b>₹{total}</b></div><button className="btn btn-gold full-btn" disabled={!ready} onClick={addToCart}>{ready?"Add Custom Kurta to Cart":"Select kurta size to continue"} <ShoppingBag size={17}/></button></div>
          </div>
        </div>
      </div></section>

      <section className="section product-details-section" id="product-details"><div className="container">
  <div className="section-head"><div><span className="eyebrow">Product Details</span><h2>Build Your Kurta Your Way</h2><p>A men's long kurta designed as the perfect base for your own patch, DTF print, or combination.</p></div></div>
  <div className="product-details-grid">
    <div className="product-detail-card"><span className="product-detail-icon">👕</span><h3>Kurta Details</h3><ul><li>Men's long kurta</li><li>Sizes S, M, L, XL & XXL</li><li>15 colour options</li><li>Plain kurta starting at ₹249</li><li>Designed for custom patch & DTF printing</li><li>Pan-India shipping included</li></ul></div>
    <div className="product-detail-card"><span className="product-detail-icon">✦</span><h3>Patch Work</h3><ul><li>Left Chest — Small / Medium / Large</li><li>Right Chest — Small / Medium / Large</li><li>Sleeves — ₹100</li><li>Long Front — ₹150</li><li>Back Center — ₹150</li><li>Multiple Small — ₹50 each</li><li>Multiple placements can be combined</li></ul></div>
    <div className="product-detail-card"><span className="product-detail-icon">✦</span><h3>DTF Printing</h3><ul><li>Small — ₹50</li><li>Medium — ₹100</li><li>Large — ₹150</li><li>Full Print — ₹250</li><li>Front / Back placement available</li><li>Transparent PNG recommended</li></ul></div>
    <div className="product-detail-card"><span className="product-detail-icon">✓</span><h3>How Your Order Works</h3><ol><li>Select colour and size.</li><li>Choose one or more patch placements.</li><li>Upload your patch artwork.</li><li>Add a DTF print if required.</li><li>Upload your print artwork.</li><li>Review your customization and total.</li><li>Place your order through WhatsApp.</li></ol></div>
  </div>
  <div className="product-detail-note"><strong>Important:</strong> Upload clear, high-resolution artwork. Transparent PNG is recommended for DTF prints. Final appearance may vary slightly depending on fabric colour, artwork and selected placement.</div>
</div></section>

<section className="section how-section" id="how"><div className="container"><div className="section-head"><div><span className="eyebrow">Simple Process</span><h2>Build It Your Way</h2></div></div><div className="process-grid"><div><strong>01</strong><h3>Choose plain kurta</h3><p>₹249 base price. Select colour and S–XXL size.</p></div><div><strong>02</strong><h3>Add patch</h3><p>Front: Left Chest Small/Medium/Large ₹50/₹100/₹150 · Multiple Small ₹50 each (2–5) · Long ₹150 · Sleeves ₹100. Back Center Large ₹150.</p></div><div><strong>03</strong><h3>Add DTF print</h3><p>Small ₹50 · Medium ₹100 · Large ₹150 · Full Print ₹250. Placement options are available for regular prints.</p></div><div><strong>04</strong><h3>Upload & preview</h3><p>Upload your own patch/print and see an approximate preview before checkout.</p></div></div></div></section>
    </main>

    <footer className="footer" id="contact"><div className="container footer-grid"><div><img className="footer-logo" src="/hinglaj-logo.svg" alt="Hinglaj Creation"/><p>Custom men's kurtas. Start with a plain kurta and build your own print and patch combination.</p></div><div><b>Pricing</b><p>Plain Kurta ₹249<br/>Patch ₹50–₹150<br/>DTF Print ₹50–₹150 · Full Print ₹250</p></div><div><b>Connect</b><p>WhatsApp: 7405652991<br/>Instagram: @hinglaj.creation.store</p><div className="btn-row"><a className="btn btn-gold" href="https://wa.me/917405652991" target="_blank"><MessageCircle size={16}/> WhatsApp</a><a className="btn btn-light" href="https://instagram.com/hinglaj.creation.store" target="_blank"><Instagram size={16}/> Instagram</a></div></div></div></footer>

    {cartOpen&&<div className="drawer-backdrop" onClick={()=>setCartOpen(false)}><aside className="cart-drawer" onClick={e=>e.stopPropagation()}>
      <div className="drawer-head"><h3>Checkout & Shipping</h3><button className="icon-btn" onClick={()=>setCartOpen(false)}><X size={18}/></button></div>
      <div className="checkout-summary">
        <div className="checkout-product-card"><div className="checkout-product-photo" style={{backgroundImage:`url(${kurtaCatalogImage})`,backgroundSize:"500% 300%",backgroundPosition:selectedSpritePosition.backgroundPosition}} aria-label={selectedColour+" kurta preview"}></div><div className="checkout-product-info"><b>{selectedColour} Custom Kurta</b><p>Size: {kurtaSize}<br/>Patch: {patchOrderText.replace(" / ₹"+patchPrice,"")}<br/>Print: {printSize?printSize+" · "+(printPosition||"Full Print"):"None"}</p></div></div>

        <div className="shipping-form shipping-included"><div className="shipping-form-title">Delivery Details</div>
          <input value={customerName} onChange={e=>setCustomerName(e.target.value)} placeholder="Full Name" autoComplete="name"/>
          <input value={customerPhone} onChange={e=>setCustomerPhone(e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="Mobile Number" inputMode="numeric" autoComplete="tel"/>
          <textarea value={shippingAddress} onChange={e=>setShippingAddress(e.target.value)} placeholder="Full Delivery Address" rows={3} autoComplete="street-address"/>
          <div className="shipping-form-grid"><input value={shippingCity} onChange={e=>setShippingCity(e.target.value)} placeholder="City" autoComplete="address-level2"/><input value={shippingState} onChange={e=>setShippingState(e.target.value)} placeholder="State" autoComplete="address-level1"/></div>
          <input value={shippingPincode} onChange={e=>setShippingPincode(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="Pincode" inputMode="numeric" autoComplete="postal-code"/>
          <div className="shipping-included-badge">✓ Pan-India shipping included in the kurta price</div>
        </div>

        <div className="checkout-lines">
          <div><span>Plain Kurta</span><b>₹249</b></div>
          {patchPrice>0&&<div><span>Patch Work</span><b>+ ₹{patchPrice}</b></div>}
          {printSize&&<div><span>{printSize} DTF Print</span><b>+ ₹{printPrice}</b></div>}
          <div className="total-row"><span>Final Total</span><b>₹{finalTotal}</b></div>
        </div>
        <button type="button" className="btn btn-gold cart-wa" onClick={placeOrderOnWhatsApp}>Place Order on WhatsApp <MessageCircle size={17}/></button>
        <p className="whatsapp-note">{orderCreatedId?"Order "+orderCreatedId+" saved. ":""}{(patchImage||printImage)?"Your uploaded patch/print will be attached when your phone/browser supports WhatsApp file sharing.":"Pan-India shipping is included. Your order details will open in WhatsApp."} After placing your order, use <a href="/orders">My Orders</a> to track it.</p>
      </div>
    </aside></div>}
  </>;
}
