"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LogOut, RefreshCw, Save, Search } from "lucide-react";

const statuses=["Order Received","Confirmed","In Production","Dispatched","Delivered","Cancelled"];

export default function AdminPage(){
  const [password,setPassword]=useState("");
  const [loggedIn,setLoggedIn]=useState(false);
  const [orders,setOrders]=useState<any[]>([]);
  const [selected,setSelected]=useState<any>(null);
  const [filter,setFilter]=useState("");
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState("");

  async function load(p=password){
    setLoading(true);setMessage("");
    try{
      const res=await fetch("/api/orders?mode=admin",{headers:{"x-admin-password":p}});
      const data=await res.json();
      if(!res.ok){setMessage(data.error||"Login failed.");setLoading(false);return false;}
      sessionStorage.setItem("hinglajAdminPassword",p);setLoggedIn(true);setOrders(data.orders||[]);setLoading(false);return true;
    }catch{setMessage("Could not connect to the orders system.");setLoading(false);return false;}
  }
  useEffect(()=>{const p=sessionStorage.getItem("hinglajAdminPassword");if(p){setPassword(p);load(p);}},[]);

  async function save(){
    if(!selected)return;
    setLoading(true);setMessage("");
    const res=await fetch("/api/orders",{method:"PUT",headers:{"Content-Type":"application/json","x-admin-password":password},body:JSON.stringify({orderId:selected.order_code,status:selected.status,courierName:selected.courier_name,trackingNumber:selected.tracking_number,trackingUrl:selected.tracking_url})});
    const data=await res.json();setLoading(false);
    if(!res.ok){setMessage(data.error||"Update failed.");return;}
    setMessage("Order updated successfully."); await load(password);
  }
  function logout(){sessionStorage.removeItem("hinglajAdminPassword");setLoggedIn(false);setOrders([]);setSelected(null);}

  if(!loggedIn) return <main className="admin-page"><div className="admin-login"><Link href="/" className="orders-back"><ArrowLeft size={16}/> Back to website</Link><img src="/hinglaj-logo.svg" alt="Hinglaj Creation"/><span className="eyebrow">Admin</span><h1>Orders Dashboard</h1><p>Enter the admin password to manage customer orders.</p><form onSubmit={e=>{e.preventDefault();load();}}><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Admin password" required/><button className="btn btn-gold">Login</button></form>{message&&<p className="orders-error">{message}</p>}</div></main>;

  const visible=orders.filter(o=>!filter||o.order_code.toLowerCase().includes(filter.toLowerCase())||o.customer_name.toLowerCase().includes(filter.toLowerCase())||o.customer_phone.includes(filter));
  return <main className="admin-page"><div className="admin-shell">
    <header className="admin-head"><div><span className="eyebrow">Hinglaj Creation</span><h1>Orders Dashboard</h1></div><div className="admin-head-actions"><button className="btn btn-light" onClick={()=>load()}><RefreshCw size={15}/> Refresh</button><button className="btn btn-light" onClick={logout}><LogOut size={15}/> Logout</button></div></header>
    {message&&<div className="admin-message">{message}</div>}
    <div className="admin-stats"><div><b>{orders.length}</b><span>Total Orders</span></div>{statuses.slice(0,5).map(s=><div key={s}><b>{orders.filter(o=>o.status===s).length}</b><span>{s}</span></div>)}</div>
    <div className="admin-layout">
      <section className="admin-list"><div className="admin-list-head"><h2>Orders</h2><div className="admin-search"><Search size={15}/><input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search order, name or mobile"/></div></div>
      {visible.map(o=><button key={o.order_code} className={"admin-order-row "+(selected?.order_code===o.order_code?"active":"")} onClick={()=>setSelected({...o})}><div><b>{o.order_code}</b><span>{o.customer_name} · {o.colour} · {o.size}</span></div><div><strong>₹{o.total}</strong><em>{o.status}</em></div></button>)}
      {!visible.length&&<p className="admin-empty">No orders found.</p>}</section>
      {selected?<section className="admin-editor"><div className="editor-head"><div><span className="eyebrow">Order Details</span><h2>{selected.order_code}</h2></div><span className="order-status-pill">{selected.status}</span></div>
        <div className="editor-grid"><div><b>Customer</b><p>{selected.customer_name}<br/>{selected.customer_phone}</p></div><div><b>Delivery</b><p>{selected.shipping_address}<br/>{selected.shipping_city}, {selected.shipping_state} - {selected.shipping_pincode}</p></div><div><b>Kurta</b><p>{selected.colour} · Size {selected.size}</p></div><div><b>Customization</b><p>{selected.patch_details}<br/>{selected.print_details}</p></div></div>
        <label>Status<select value={selected.status} onChange={e=>setSelected({...selected,status:e.target.value})}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label>
        <label>Courier Name<input value={selected.courier_name||""} onChange={e=>setSelected({...selected,courier_name:e.target.value})} placeholder="e.g. Delhivery"/></label>
        <label>Tracking Number<input value={selected.tracking_number||""} onChange={e=>setSelected({...selected,tracking_number:e.target.value})} placeholder="Tracking / AWB number"/></label>
        <label>Tracking URL<input value={selected.tracking_url||""} onChange={e=>setSelected({...selected,tracking_url:e.target.value})} placeholder="https://..."/></label>
        <div className="editor-total">Total <b>₹{selected.total}</b></div><button className="btn btn-gold full-btn" onClick={save} disabled={loading}><Save size={16}/> {loading?"Saving…":"Save Order Update"}</button>
      </section>:<section className="admin-editor admin-empty-panel"><h2>Select an order</h2><p>Choose an order from the list to view and update its status.</p></section>}
    </div>
  </div></main>
}
