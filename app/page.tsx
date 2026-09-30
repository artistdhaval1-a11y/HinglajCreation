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
  ["Purple","#70458f"],
  ["Dark Green","#075b45"],
  ["Light Green","#5fce2f"],
  ["Light Yellow","#fff0a6"]
];
const colourImages: Record<string,string> = {};
const kurtaCatalogImage = "/kurta-colour-sprite.svg";
const sizes = ["S","M","L","XL","XXL"];
const addOnSizes = ["Small","Medium","Large"];
const printPositions = ["Front","Back","Both"];
const patchPrices: Record<string,number> = { Small:50, Medium:100, Large:150 };
const patchPlacementOptions = ["Left Chest","Right Chest","Sleeves","Long Front","Back Center","Multiple Small"];
const multipleQuantities = [2,3,4,5];
function deliveryEstimate(city:string){return city.trim().toLowerCase()==="ahmedabad"?"3-4 days":"8-10 days";}
const printPrices: Record<string,number> = { Small:50, Medium:100, Large:150, "Full Print":250 };
type CartItem = { colour:string; tone:string; size:string; patchDetails:string; patchPrice:number; printDetails:string; printPrice:number; total:number; patchImage:string; printImage:string };

export default function Home() {
  const [selectedColour,setSelectedColour]=useState("White");
  const [customiseOpen,setCustomiseOpen]=useState(false);
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
  const [cartItems,setCartItems]=useState<CartItem[]>([]);
  const [orderCreatedId,setOrderCreatedId]=useState("");
  const selectedColourIndex=colours.findIndex(([name])=>name===selectedColour);
  const selectedSpriteRow=Math.floor(selectedColourIndex/5);
  const selectedSpritePosition={backgroundPosition:`${(selectedColourIndex%5)*25}% ${selectedSpriteRow*(100/3)}%`};
  const selectedColourImage = colourImages[selectedColour];
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
  const cartTotal=cartItems.reduce((sum,item)=>sum+item.total,0);
  const finalTotal=cartTotal;
  const ready=!!kurtaSize && (!chestSelected || !!patchSize) && (!printSize || printSize==="Full Print" || !!printPosition);

  function filePreview(e:ChangeEvent<HTMLInputElement>,type:"patch"|"print"){
    const file=e.target.files?.[0]; if(!file)return;
    const reader=new FileReader();
    reader.onload=()=>type==="patch"?setPatchImage(String(reader.result)):setPrintImage(String(reader.result));
    reader.readAsDataURL(file);
  }
  function addToCart(){if(!ready){window.alert("Please select a kurta size and complete the required customization selections.");return;} const item:CartItem={colour:selectedColour,tone:selectedTone,size:kurtaSize,patchDetails:patchOrderText,patchPrice,printDetails:printDetailsText,printPrice,total,patchImage,printImage}; setCartItems(prev=>[...prev,item]); setAdded(true); setCustomiseOpen(false); setOrderCreatedId(""); window.setTimeout(()=>{setAdded(false);window.scrollTo({top:0,behavior:"smooth"});},1800);}
  function removeCartItem(index:number){setCartItems(prev=>prev.filter((_,i)=>i!==index));}
  function continueShopping(){setCartOpen(false);window.setTimeout(()=>document.getElementById("shop")?.scrollIntoView({behavior:"smooth",block:"start"}),50);}
  async function placeOrderOnWhatsApp(){
    if(!cartItems.length){window.alert("Please add at least one kurta to your cart.");return;}
    if(!customerName.trim()||!/^\d{10}$/.test(customerPhone)||!shippingAddress.trim()||!shippingCity.trim()||!shippingState.trim()||!/^\d{6}$/.test(shippingPincode)){window.alert("Please complete your name, 10-digit mobile number and full delivery address.");return;}
    try{
      const deliveryDays=deliveryEstimate(shippingCity);
      const items=cartItems.map((item,index)=>({itemNumber:index+1,colour:item.colour,size:item.size,patchDetails:item.patchDetails,patchPrice:item.patchPrice,printDetails:item.printDetails,printPrice:item.printPrice,total:item.total,patchUploaded:!!item.patchImage,printUploaded:!!item.printImage}));
      const first=cartItems[0];
      const res=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({customerName,customerPhone,shippingAddress,shippingCity,shippingState,shippingPincode,deliveryDays,colour:first.colour,size:first.size,patchDetails:items.map(i=>i.patchDetails).join(" | "),patchPrice:items.reduce((n,i)=>n+i.patchPrice,0),printDetails:items.map(i=>i.printDetails).join(" | "),printPrice:items.reduce((n,i)=>n+i.printPrice,0),total:cartTotal,patchUploaded:items.some(i=>i.patchUploaded),printUploaded:items.some(i=>i.printUploaded),items})});
      const data=await res.json();if(!res.ok)throw new Error(data.error||"Could not save order.");setOrderCreatedId(data.orderId);
      const lines=cartItems.map((item,index)=>(index+1)+". "+item.colour+" Kurta · Size "+item.size+" · "+item.patchDetails+" · "+item.printDetails+" · ₹"+item.total).join("\n");
      const text="Hi Hinglaj Creation, I want to order "+cartItems.length+" custom kurta(s).\nOrder ID: "+data.orderId+"\nName: "+customerName+"\nMobile: "+customerPhone+"\nAddress: "+shippingAddress+", "+shippingCity+", "+shippingState+" - "+shippingPincode+"\n\nItems:\n"+lines+"\n\nFinal Total: ₹"+cartTotal+"\nEstimated Delivery: "+deliveryDays+"\nShipping: Included Pan-India";
      const files:File[]=[];async function dataUrlToFile(dataUrl:string,name:string){const res=await fetch(dataUrl);const blob=await res.blob();return new File([blob],name,{type:blob.type||"image/jpeg"});}
      for(let i=0;i<cartItems.length;i++){if(cartItems[i].patchImage)files.push(await dataUrlToFile(cartItems[i].patchImage,"hinglaj-patch-"+(i+1)+".jpg"));if(cartItems[i].printImage)files.push(await dataUrlToFile(cartItems[i].printImage,"hinglaj-dtf-"+(i+1)+".jpg"));}
      if(files.length&&typeof navigator!=="undefined"&&"share" in navigator&&"canShare" in navigator&&navigator.canShare({files})){await navigator.share({title:"Hinglaj Creation Order",text,files});return;}window.open("https://wa.me/917405652991?text="+encodeURIComponent(text),"_blank");
    }catch(error){window.alert(error instanceof Error?error.message:"Could not save the order. Please try again.");}
  }
  const orderText = "Hi Hinglaj Creation, cart has "+cartItems.length+" kurta(s). Final Total: ₹"+cartTotal;
  const addedPopup = added ? <div className="added-cart-popup" role="status"><div className="added-cart-popup-card"><span className="added-cart-check">✓</span><div><strong>Added to Cart</strong><small>{selectedColour} Kurta · Size {kurtaSize}</small></div><button onClick={()=>setAdded(false)} aria-label="Close">×</button></div></div> : null;

  return <>
    {addedPopup}
    <header className="nav"><div className="container nav-inner">
      <a className="logo-image" href="#"><img src="/hinglaj-logo.svg" alt="Hinglaj Creation"/></a>
      <nav className={"nav-links "+(menuOpen?"nav-links-open":"")}><a href="#shop" onClick={()=>setMenuOpen(false)}>Shop</a><a href="#customise" onClick={()=>setMenuOpen(false)}>Customise</a><a href="#how" onClick={()=>setMenuOpen(false)}>How It Works</a><a href="/myorder" onClick={()=>setMenuOpen(false)}>My Orders</a><a href="#contact" onClick={()=>setMenuOpen(false)}>Contact</a></nav>
      <div className="nav-actions"><button className="icon-btn mobile-menu-btn" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X size={18}/>:<Menu size={18}/>}</button><button className="icon-btn" onClick={()=>setCartOpen(true)}><ShoppingBag size={18}/>{cartItems.length>0&&<span className="cart-badge">{cartItems.length}</span>}</button></div>
    </div></header>

    <main>
      <section className="hero hero-custom"><div className="container"><div className="hero-grid">
        <div className="hero-copy"><span className="eyebrow">Hinglaj Custom Studio</span><h1>Start with a<br/>plain kurta.</h1><p>Choose your base colour and size, then add your own patch, DTF print, or both. Upload your artwork and preview it on the kurta.</p><div className="btn-row"><a className="btn btn-gold" href="#shop">Choose Your Kurta <ArrowRight size={17}/></a><a className="btn btn-light" href="#how">How it works</a></div><div className="trust-row"><span><Check size={15}/> ₹249 plain kurta</span><span><Check size={15}/> Custom uploads</span><span><Check size={15}/> S–XXL</span></div></div>
        <div className="hero-art"><img className="hero-photo" src="https://d2ol7oe51mr4n9.cloudfront.net/user_3GaPnt7FT0FsavzgVsFIQBb4kgI/272c73e9-cad2-4a4d-88d7-64d64e4f5698.png" alt="Hinglaj Creation custom kurta collection"/><div className="hero-caption">PLAIN · PATCH · PRINT</div></div>
      </div></div></section>

      <section className="section shop-section" id="shop"><div className="container">
        <div className="section-head"><div><span className="eyebrow">Step 01</span><h2>Choose Your Plain Kurta</h2><p>Every custom order starts at <strong>₹249</strong>. Select one colour below, then continue to size and customisation.</p></div></div>
        <div className="colour-picker-card">
          <div className="colour-collage" role="group" aria-label="Choose kurta colour">
            {colours.map(([name,tone])=><button key={name} className={"colour-tile "+(selectedColour===name?"colour-tile-active":"")} onClick={()=>{setSelectedColour(name);setSelectedTone(tone);setCustomiseOpen(true);}} aria-label={"Select "+name+" kurta"}><span className="colour-swatch" style={{background:tone}}/><span className="colour-tile-label">{name}</span></button>)}</div>
          <div className="colour-picker-info">
            <div><span className="eyebrow">Selected Colour</span><h3>{selectedColour}</h3><p>Plain kurta · ₹249 · Sizes S–XXL</p></div>
            
          </div>
        </div>
      </div></section>

      <section className={"section customise-section customise-wizard "+(customiseOpen?"customise-wizard-open":"")} id="customise"><div className="customise-wizard-backdrop" onClick={()=>setCustomiseOpen(false)}></div><div className="customise-wizard-panel"><div className="customise-wizard-top"><button className="customise-back-btn" onClick={()=>setCustomiseOpen(false)}><ArrowRight size={17} style={{transform:"rotate(180deg)"}}/> Back to colours</button><span>Step 02 of 02</span></div><div className="container">
        <div className="section-head"><div><span className="eyebrow">Step 02</span><h2>Customize Your Kurta</h2><p>Base: <strong>{selectedColour}</strong> · Plain kurta ₹249</p></div></div>
        <div className="builder">
          <aside className="builder-preview"><div className="preview-label">LIVE PREVIEW</div><div className="preview-stage"><div className="preview-photo">{selectedColourImage?<img className="preview-kurta-image" src={`${selectedColourImage}?v=4`} alt={`${selectedColour} kurta preview`} loading="eager" decoding="async" />:<div className="preview-kurta-sprite" style={{backgroundImage:`url(${kurtaCatalogImage})`,backgroundSize:"500% 400%",backgroundPosition:selectedSpritePosition.backgroundPosition}}/>}</div></div><div className="preview-colour"><span className="colour-dot" style={{background:selectedTone}}/> {selectedColour} · Size {kurtaSize||"—"}</div><div className="preview-product-details"><div className="preview-product-heading"><span>PRODUCT DETAILS</span><b>Custom Men&apos;s Kurta</b></div><div className="preview-detail-row"><span>Colour</span><b>{selectedColour}</b></div><div className="preview-detail-row"><span>Size</span><b>{kurtaSize||"Not selected"}</b></div><div className="preview-detail-row"><span>Plain Kurta</span><b>₹249</b></div><div className="preview-detail-row"><span>Patch Work</span><b>{patchPrice?`₹${patchPrice}`:"None · ₹0"}</b></div><div className="preview-detail-row"><span>DTF Print</span><b>{printSize?`${printSize} · ₹${printPrice}`:"None · ₹0"}</b></div><div className="preview-detail-total"><span>Total</span><b>₹{total}</b></div></div></aside>

          <div className="builder-options">
            <div className="builder-card"><div className="builder-title"><span>1</span><div><h3>Kurta Size</h3><p>Choose your fitting size.</p></div></div><div className="option-grid kurta-size-grid">{sizes.map(s=><button key={s} className={"choice "+(kurtaSize===s?"choice-active":"")} onClick={()=>setKurtaSize(s)}>{s}</button>)}</div></div>

            <div className="builder-card"><div className="builder-title"><span>2</span><div><h3>Patch Work <em>Optional</em></h3><p>Select one or more placements. You can combine them.</p></div></div><div className="option-label">Choose patch placement(s)</div><div className="option-grid patch-placement-grid">{patchPlacementOptions.map(option=><button key={option} className={"choice "+(patchPlacements.includes(option)?"choice-active":"")} onClick={()=>setPatchPlacements(prev=>prev.includes(option)?prev.filter(item=>item!==option):[...prev,option])}>{option}<small>{option==="Left Chest"||option==="Right Chest"?"Choose size":option==="Sleeves"?"₹100":option==="Long Front"?"₹150":option==="Back Center"?"₹150":"₹50 each"}</small></button>)}</div>{chestSelected&&<><div className="option-label">Chest patch size</div><div className="option-grid">{addOnSizes.map(s=><button key={s} className={"choice "+(patchSize===s?"choice-active":"")} onClick={()=>setPatchSize(patchSize===s?"":s)}>{s}<small>₹{patchPrices[s]} per chest</small></button>)}</div></>}{patchPlacements.includes("Multiple Small")&&<><div className="option-label">Multiple small patches</div><select className="quantity-select" value={multipleQuantity} onChange={e=>setMultipleQuantity(Number(e.target.value))}>{multipleQuantities.map(q=><option key={q} value={q}>Quantity: {q} — ₹{q*50}</option>)}</select></>}{patchPlacements.length>0&&<label className="upload-box"><span>Upload your patch</span><small>PNG/JPG · used for all selected placement(s)</small><input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>filePreview(e,"patch")}/>{patchImage&&<b>✓ Patch uploaded</b>}</label>}<div className="patch-selection-note">{patchPlacements.length?"Selected: "+patchPlacements.join(" + "):"No patch selected"}</div></div>

            <div className="builder-card"><div className="builder-title"><span>3</span><div><h3>DTF Print <em>Optional</em></h3><p>Choose your print size, then select Front, Back, or Both.</p></div></div><div className="option-label">Print size</div><div className="option-grid">{addOnSizes.map(s=><button key={s} className={"choice "+(printSize===s?"choice-active":"")} onClick={()=>{setPrintSize(printSize===s?"":s);if(printSize===s)setPrintPosition("");}}>{s}<small>₹{printPrices[s]}</small></button>)}<button className={"choice "+(printSize==="Full Print"?"choice-active":"")} onClick={()=>{setPrintSize(printSize==="Full Print"?"":"Full Print");setPrintPosition("");}}>Full Print<small>₹250</small></button></div>{printSize&&<><div className="option-label">Print placement</div><div className="option-grid two">{printPositions.map(s=><button key={s} className={"choice "+(printPosition===s?"choice-active":"")} onClick={()=>setPrintPosition(s)}>{s}<small>{s==="Both"?"2 × print price":""}</small></button>)}</div><label className="upload-box"><span>Upload your DTF print</span><small>PNG/JPG · transparent PNG recommended</small><input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>filePreview(e,"print")}/>{printImage&&<b>✓ Print uploaded</b>}</label></>}</div>

            <div className="builder-summary"><div><span>Plain Kurta</span><b>₹249</b></div><div><span>{selectedColour} · Size</span><b>{kurtaSize||"Not selected"}</b></div><div><span>Patch</span><b>{patchPrice?patchOrderText.replace(" / ₹"," · ₹"): "None · ₹0"}</b></div><div><span>DTF Print</span><b>{printSize?printSize+" · "+(printPosition||"Placement not selected")+" · ₹"+printPrice:"None · ₹0"}</b></div><div className="total-row"><span>Total</span><b>₹{total}</b></div><button className="btn btn-gold full-btn" disabled={!ready} onClick={addToCart}>{ready?"Add Custom Kurta to Cart":"Select kurta size to continue"} <ShoppingBag size={17}/></button></div>
          </div>
        </div>
      </div></div></section>

      <section className="section product-details-section" id="product-details"><div className="container">
  <div className="section-head"><div><span className="eyebrow">Product Details</span><h2>Build Your Kurta Your Way</h2><p>A men's long kurta designed as the perfect base for your own patch, DTF print, or combination.</p></div></div>
  <div className="brochure-download-wrap"><a className="btn btn-gold brochure-download" href="/Hinglaj%20Creation%20Catalogue-1.pdf" download="Hinglaj-Creation-Brochure.pdf">Download Brochure <span>↓</span></a><p>Download our Hinglaj Creation kurta catalogue.</p></div>
  <div className="product-details-grid">
    <div className="product-detail-card"><span className="product-detail-icon">👕</span><h3>Kurta Details</h3><ul><li>Men's long kurta</li><li>Sizes S, M, L, XL & XXL</li><li>19 colour options</li><li>Plain kurta starting at ₹249</li><li>Designed for custom patch & DTF printing</li><li>Pan-India shipping included</li></ul></div>
    <div className="product-detail-card"><span className="product-detail-icon">✦</span><h3>Patch Work</h3><ul><li>Left Chest — Small / Medium / Large</li><li>Right Chest — Small / Medium / Large</li><li>Sleeves — ₹100</li><li>Long Front — ₹150</li><li>Back Center — ₹150</li><li>Multiple Small — ₹50 each</li><li>Multiple placements can be combined</li></ul></div>
    <div className="product-detail-card"><span className="product-detail-icon">✦</span><h3>DTF Printing</h3><ul><li>Small — ₹50</li><li>Medium — ₹100</li><li>Large — ₹150</li><li>Full Print — ₹250</li><li>Front / Back / Both placement available</li><li>Both placement is charged for two prints</li><li>Transparent PNG recommended</li></ul></div>
    <div className="product-detail-card"><span className="product-detail-icon">✓</span><h3>How Your Order Works</h3><ol><li>Select colour and size.</li><li>Choose one or more patch placements.</li><li>Upload your patch artwork.</li><li>Add a DTF print if required.</li><li>Upload your print artwork.</li><li>Review your customization and total.</li><li>Place your order through WhatsApp.</li></ol></div>
  </div>
  <div className="product-detail-note"><strong>Important:</strong> Upload clear, high-resolution artwork. Transparent PNG is recommended for DTF prints. Final appearance may vary slightly depending on fabric colour, artwork and selected placement.</div>
</div></section>

<section className="section how-section" id="how"><div className="container"><div className="section-head"><div><span className="eyebrow">Simple Process</span><h2>Build It Your Way</h2></div></div><div className="process-grid"><div><strong>01</strong><h3>Choose plain kurta</h3><p>₹249 base price. Select colour and S–XXL size.</p></div><div><strong>02</strong><h3>Add patch</h3><p>Front: Left Chest Small/Medium/Large ₹50/₹100/₹150 · Multiple Small ₹50 each (2–5) · Long ₹150 · Sleeves ₹100. Back Center Large ₹150.</p></div><div><strong>03</strong><h3>Add DTF print</h3><p>Small ₹50 · Medium ₹100 · Large ₹150 · Full Print ₹250. Placement options are available for regular prints.</p></div><div><strong>04</strong><h3>Upload & preview</h3><p>Upload your own patch/print and see an approximate preview before checkout.</p></div></div></div></section>
    </main>

    <footer className="footer" id="contact"><div className="container footer-grid"><div><img className="footer-logo" src="/hinglaj-logo.svg" alt="Hinglaj Creation"/><p>Custom men's kurtas. Start with a plain kurta and build your own print and patch combination.</p></div><div><b>Pricing</b><p>Plain Kurta ₹249<br/>Patch ₹50–₹150<br/>DTF Print ₹50–₹150 · Full Print ₹250</p></div><div><b>Connect</b><p>WhatsApp: 7405652991<br/>Instagram: @hinglaj.creation.store</p><div className="btn-row"><a className="btn btn-gold" href="https://wa.me/917405652991" target="_blank"><MessageCircle size={16}/> WhatsApp</a><a className="btn btn-light" href="https://instagram.com/hinglaj.creation.store" target="_blank"><Instagram size={16}/> Instagram</a></div></div></div></footer>

    {cartOpen&&<div className="drawer-backdrop" onClick={()=>setCartOpen(false)}><aside className="cart-drawer" onClick={e=>e.stopPropagation()}>
      <div className="drawer-head"><h3>Your Cart ({cartItems.length})</h3><button className="icon-btn" onClick={()=>setCartOpen(false)}><X size={18}/></button></div>
      <div className="checkout-summary">
        {cartItems.map((item,index)=><div className="checkout-product-card cart-item-card" key={index}><div className="checkout-product-photo" style={colourImages[item.colour]?{backgroundImage:`url(${colourImages[item.colour]})`,backgroundSize:"cover",backgroundPosition:"center"}:{backgroundImage:`url(${kurtaCatalogImage})`,backgroundSize:"500% 400%",backgroundPosition:`${(colours.findIndex(([name])=>name===item.colour)%5)*25}% ${Math.floor(colours.findIndex(([name])=>name===item.colour)/5)*(100/3)}%`}}/><div className="checkout-product-info"><b>{index+1}. {item.colour} Custom Kurta</b><p>Size: {item.size}<br/>Patch: {item.patchDetails.replace(" / ₹"+item.patchPrice,"")}<br/>Print: {item.printDetails.replace(" / ₹"+item.printPrice,"")}</p><strong>₹{item.total}</strong><button className="cart-remove" onClick={()=>removeCartItem(index)}>Remove</button></div></div>)}
        {!cartItems.length&&<p className="cart-empty">Your cart is empty.</p>}
        {cartItems.length>0&&<button type="button" className="btn btn-light full-btn" onClick={continueShopping}>+ Add Another Kurta</button>}
        <div className="shipping-form shipping-included"><div className="shipping-form-title">Delivery Details</div>
          <input value={customerName} onChange={e=>setCustomerName(e.target.value)} placeholder="Full Name" autoComplete="name"/>
          <input value={customerPhone} onChange={e=>setCustomerPhone(e.target.value.replace(/D/g,"").slice(0,10))} placeholder="Mobile Number" inputMode="numeric" autoComplete="tel"/>
          <textarea value={shippingAddress} onChange={e=>setShippingAddress(e.target.value)} placeholder="Full Delivery Address" rows={3} autoComplete="street-address"/>
          <div className="shipping-form-grid"><input value={shippingCity} onChange={e=>setShippingCity(e.target.value)} placeholder="City" autoComplete="address-level2"/><input value={shippingState} onChange={e=>setShippingState(e.target.value)} placeholder="State" autoComplete="address-level1"/></div>
          <input value={shippingPincode} onChange={e=>setShippingPincode(e.target.value.replace(/D/g,"").slice(0,6))} placeholder="Pincode" inputMode="numeric" autoComplete="postal-code"/>
          <div className="shipping-included-badge">✓ Pan-India shipping included in the kurta price</div><div className="delivery-estimate">🚚 Estimated delivery: <strong>{shippingCity.trim()?deliveryEstimate(shippingCity):"3-4 days in Ahmedabad · 8-10 days elsewhere"}</strong></div>
        </div>
        <div className="checkout-lines"><div><span>{cartItems.length} Kurta{cartItems.length!==1?"s":""}</span><b>₹{cartTotal}</b></div><div className="total-row"><span>Final Total</span><b>₹{cartTotal}</b></div></div>
        <button type="button" className="btn btn-gold cart-wa" disabled={!cartItems.length} onClick={placeOrderOnWhatsApp}>Place Order on WhatsApp <MessageCircle size={17}/></button>
        <p className="whatsapp-note">{orderCreatedId?"Order "+orderCreatedId+" saved. ":""}Your complete cart will be sent to WhatsApp. After placing your order, use <a href="/orders">My Orders</a> to track it.</p>
      </div>
    </aside></div>}
  </>;
}
