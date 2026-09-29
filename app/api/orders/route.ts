import { NextRequest, NextResponse } from "next/server";
import { db, ensureSchema } from "../../../lib/db";

export const dynamic = "force-dynamic";
const STATUSES = ["Order Received","Confirmed","In Production","Dispatched","Delivered","Cancelled"];

function adminOk(request: NextRequest) {
  const expected = process.env.HINGLAJ_ADMIN_PASSWORD;
  const provided = request.headers.get("x-admin-password") || request.headers.get("authorization")?.replace(/^Bearer /,"");
  return !!expected && provided === expected;
}

export async function POST(request: NextRequest) {
  try {
    await ensureSchema();
    const body = await request.json();
    const required = ["customerName","customerPhone","shippingAddress","shippingCity","shippingState","shippingPincode","colour","size","total"];
    if (required.some(key => !String(body[key] ?? "").trim())) return NextResponse.json({error:"Please complete all required details."},{status:400});
    if (!/^\d{10}$/.test(String(body.customerPhone))) return NextResponse.json({error:"Enter a valid 10-digit mobile number."},{status:400});
    if (!/^\d{6}$/.test(String(body.shippingPincode))) return NextResponse.json({error:"Enter a valid 6-digit pincode."},{status:400});

    const client = await db().connect();
    try {
      await client.query("BEGIN");
      const inserted = await client.query(
        "INSERT INTO orders (order_code,customer_name,customer_phone,shipping_address,shipping_city,shipping_state,shipping_pincode,colour,size,patch_details,patch_price,print_details,print_price,total,patch_uploaded,print_uploaded) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING id",
        ["TEMP-"+Date.now()+"-"+Math.random().toString(36).slice(2,8), body.customerName.trim(), body.customerPhone, body.shippingAddress.trim(), body.shippingCity.trim(), body.shippingState.trim(), body.shippingPincode, body.colour, body.size, body.patchDetails || "None", Number(body.patchPrice)||0, body.printDetails || "None", Number(body.printPrice)||0, Number(body.total)||0, !!body.patchUploaded, !!body.printUploaded]
      );
      const id = inserted.rows[0].id as number;
      const orderCode = "HC-" + String(id).padStart(4,"0");
      await client.query("UPDATE orders SET order_code=$1 WHERE id=$2",[orderCode,id]);
      await client.query("COMMIT");
      return NextResponse.json({orderId:orderCode});
    } catch(error) {
      await client.query("ROLLBACK");
      throw error;
    } finally { client.release(); }
  } catch(error) {
    console.error("Create order error", error);
    return NextResponse.json({error:"Could not save the order. Please try again."},{status:500});
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureSchema();
    const params = new URL(request.url).searchParams;
    if (params.get("mode") === "admin") {
      if (!adminOk(request)) return NextResponse.json({error:"Unauthorized"},{status:401});
      const result = await db().query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 500");
      return NextResponse.json({orders:result.rows});
    }
    const phone = String(params.get("phone") || "").replace(/\D/g,"");
    if (!/^\d{10}$/.test(phone)) return NextResponse.json({error:"Enter a valid 10-digit mobile number."},{status:400});
    const result = await db().query(
      "SELECT order_code,customer_name,customer_phone,shipping_address,shipping_city,shipping_state,shipping_pincode,colour,size,patch_details,patch_price,print_details,print_price,total,status,courier_name,tracking_number,tracking_url,created_at,updated_at FROM orders WHERE customer_phone=$1 ORDER BY created_at DESC",
      [phone]
    );
    return NextResponse.json({orders:result.rows});
  } catch(error) {
    console.error("Get orders error", error);
    return NextResponse.json({error:"Could not load orders."},{status:500});
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await ensureSchema();
    const body = await request.json();
    const orderId = String(body.orderId||"").trim().toUpperCase();
    const phone = String(body.phone||"").replace(/\D/g,"");
    if (!/^HC-\d+$/.test(orderId) || !/^\d{10}$/.test(phone)) return NextResponse.json({error:"Enter a valid Order ID and mobile number."},{status:400});
    const result = await db().query(
      "SELECT order_code,customer_name,customer_phone,shipping_address,shipping_city,shipping_state,shipping_pincode,colour,size,patch_details,patch_price,print_details,print_price,total,status,courier_name,tracking_number,tracking_url,created_at,updated_at FROM orders WHERE order_code=$1 AND customer_phone=$2 LIMIT 1",
      [orderId,phone]
    );
    if (!result.rowCount) return NextResponse.json({error:"No order found for these details."},{status:404});
    return NextResponse.json({order:result.rows[0]});
  } catch(error) {
    console.error("Lookup order error", error);
    return NextResponse.json({error:"Could not look up the order."},{status:500});
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureSchema();
    if (!adminOk(request)) return NextResponse.json({error:"Unauthorized"},{status:401});
    const body = await request.json();
    if (!body.orderId || !STATUSES.includes(body.status)) return NextResponse.json({error:"Invalid order update."},{status:400});
    const result = await db().query("UPDATE orders SET status=$1,courier_name=$2,tracking_number=$3,tracking_url=$4,updated_at=NOW() WHERE order_code=$5 RETURNING order_code",[body.status,body.courierName||null,body.trackingNumber||null,body.trackingUrl||null,body.orderId]);
    if (!result.rowCount) return NextResponse.json({error:"Order not found."},{status:404});
    return NextResponse.json({ok:true});
  } catch(error) {
    console.error("Update order error", error);
    return NextResponse.json({error:"Could not update the order."},{status:500});
  }
}
