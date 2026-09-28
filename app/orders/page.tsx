"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Package, Search, Truck } from "lucide-react";

const steps=["Order Received","Confirmed","In Production","Dispatched","Delivered"];

export default function OrdersPage(){
  const [orderId,setOrderId]=useState("");
  const [phone,setPhone]=useState("");
  const [order,setOrder]=useState<any>(null);
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  async function lookup(e:FormEvent){
    e.preventDefault(); setLoading(true); setError(""); setOrder(null);
    try{
      const res=await fetch("/api/orders",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderId:orderId.trim().toUpperCase(),phone})});
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||"Order not found.");
      setOrder(data.order);
    }catch(err){setError(err instanceof Error?err.message:"Could not find order.");}
    finally{setLoading(false);}
  }

  const activeIndex=order?steps.indexOf(order.status):-1;
  return <main className="orders-page">
    <div className="orders-shell">
      <Link href="/" className="orders-back"><ArrowLeft size={16}/> Back to Hinglaj Creation</Link>
      <div className="orders-brand"><img src="/hinglaj-logo.svg" alt="Hinglaj Creation"/></div>
      <div className="orders-card">
        <span className="eyebrow">My Orders</span>
        <h1>Track your Hinglaj order</h1>
        <p className="orders-intro">Enter the Order ID and mobile number used at checkout.</p>
        <form onSubmit={lookup} className="orders-form">
          <input value={orderId} onChange={e=>setOrderId(e.target.value.toUpperCase())} placeholder="Order ID e.g. HC-1001" required/>
          <input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="10-digit mobile number" inputMode="numeric" required/>
          <button className="btn btn-gold" disabled={loading}>{loading?"Checking…":"View My Order"} <Search size={16}/></button>
        </form>
        {error&&<p className="orders-error">{error}</p>}
      </div>

      {order&&<div className="order-result">
        <div className="order-result-head"><div><span className="eyebrow">Order</span><h2>{order.order_code}</h2><p>{new Date(order.created_at).toLocaleString("en-IN")}</p></div><div className="order-status-pill">{order.status}</div></div>
        <div className="order-timeline">
          {steps.map((step,i)=><div key={step} className={"order-step "+(i<=activeIndex?"done":"")}><div className="order-step-dot">{i<=activeIndex?<Check size={14}/>:i===3?<Truck size={14}/>:<Package size={14}/>}</div><span>{step}</span></div>)}
        </div>
        <div className="order-detail-grid">
          <div><b>Kurta</b><p>{order.colour} · Size {order.size}</p></div>
          <div><b>Patch</b><p>{order.patch_details} {order.patch_price?("· ₹"+order.patch_price):""}</p></div>
          <div><b>DTF Print</b><p>{order.print_details} {order.print_price?("· ₹"+order.print_price):""}</p></div>
          <div><b>Total</b><p>₹{order.total} · Shipping Included</p></div>
        </div>
        <div className="order-address"><b>Delivery Address</b><p>{order.shipping_address}, {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</p></div>
        {(order.status==="Dispatched"||order.status==="Delivered")&&<div className="tracking-card"><Truck size={20}/><div><b>{order.status==="Delivered"?"Delivery completed":"Your order is on the way"}</b><p>{order.courier_name||"Courier"}{order.tracking_number?(" · "+order.tracking_number):""}</p>{order.tracking_url&&<a href={order.tracking_url} target="_blank" rel="noreferrer">Track Shipment</a>}</div></div>}
      </div>}
    </div>
  </main>
}
