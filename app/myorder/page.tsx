"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Package, Search, Truck } from "lucide-react";

const steps=["Order Received","Confirmed","In Production","Dispatched","Delivered"];
function deliveryEstimate(city:string){return city.trim().toLowerCase()==="ahmedabad"?"3-4 days":"8-10 days";}

export default function OrdersPage(){
  const [phone,setPhone]=useState("");
  const [orders,setOrders]=useState<any[]>([]);
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  async function lookup(e:FormEvent){
    e.preventDefault(); setLoading(true); setError(""); setOrders([]);
    try{
      const res=await fetch("/api/orders?phone="+encodeURIComponent(phone),{cache:"no-store"});
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||"Could not find orders.");
      if(!data.orders?.length) throw new Error("No orders found for this mobile number.");
      setOrders(data.orders);
    }catch(err){setError(err instanceof Error?err.message:"Could not find orders.");}
    finally{setLoading(false);}
  }

  return <main className="orders-page">
    <div className="orders-shell">
      <Link href="/" className="orders-back"><ArrowLeft size={16}/> Back to Hinglaj Creation</Link>
      <div className="orders-brand"><img src="/hinglaj-logo.svg" alt="Hinglaj Creation"/></div>
      <div className="orders-card">
        <span className="eyebrow">My Orders</span>
        <h1>View your Hinglaj orders</h1>
        <p className="orders-intro">Enter the mobile number used at checkout to see all your orders.</p>
        <form onSubmit={lookup} className="orders-form">
          <input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="10-digit mobile number" inputMode="numeric" autoComplete="tel" required/>
          <button className="btn btn-gold" disabled={loading}>{loading?"Checking…":"View My Orders"} <Search size={16}/></button>
        </form>
        {error&&<p className="orders-error">{error}</p>}
      </div>

      {orders.length>0&&<div className="order-result-list">
        <div className="order-list-heading">
          <div><span className="eyebrow">Orders Found</span><h2>{orders.length} {orders.length===1?"Order":"Orders"}</h2></div>
          <span>{phone}</span>
        </div>
        {orders.map(order=>{
          const activeIndex=steps.indexOf(order.status);
          return <div className="order-result" key={order.order_code}>
            <div className="order-result-head">
              <div><span className="eyebrow">Order</span><h2>{order.order_code}</h2><p>{new Date(order.created_at).toLocaleString("en-IN")}</p></div>
              <div className="order-status-pill">{order.status}</div>
            </div>
            <div className="order-timeline">
              {steps.map((step,i)=><div key={step} className={"order-step "+(i<=activeIndex?"done":"")}><div className="order-step-dot">{i<=activeIndex?<Check size={14}/>:i===3?<Truck size={14}/>:<Package size={14}/>}</div><span>{step}</span></div>)}
            </div>
            <div className="order-detail-grid">{Array.isArray(order.items)&&order.items.length>1 ? order.items.map((item:any,i:number)=><div key={i}><b>Kurta {i+1}</b><p>{item.colour} · Size {item.size}<br/>{item.patchDetails} · {item.printDetails}<br/><strong>₹{item.total}</strong></p></div>) : <><div><b>Kurta</b><p>{order.colour} · Size {order.size}</p></div><div><b>Patch</b><p>{order.patch_details} {order.patch_price?("· ₹"+order.patch_price):""}</p></div><div><b>DTF Print</b><p>{order.print_details} {order.print_price?("· ₹"+order.print_price):""}</p></div></>}<div><b>Total</b><p>₹{order.total} · Shipping Included</p></div></div>
            <div className="order-address"><b>Delivery Address</b><p>{order.shipping_address}, {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</p></div><div className="delivery-estimate order-delivery-estimate">🚚 <b>Estimated Delivery:</b> {deliveryEstimate(order.shipping_city)}</div>
            {(order.status==="Dispatched"||order.status==="Delivered")&&<div className="tracking-card"><Truck size={20}/><div><b>{order.status==="Delivered"?"Delivery completed":"Your order is on the way"}</b><p>{order.courier_name||"Courier"}{order.tracking_number?(" · "+order.tracking_number):""}</p>{order.tracking_url&&<a href={order.tracking_url} target="_blank" rel="noreferrer">Track Shipment</a>}</div></div>}
          </div>
        })}
      </div>}
    </div>
  </main>
}
