import { NextResponse } from "next/server";

const SHIPROCKET_BASE = "https://apiv2.shiprocket.in/v1/external";

type Courier = {
  courier_name?: string;
  rate?: number | string;
  etd?: string;
  estimated_delivery_days?: number | string;
  [key: string]: unknown;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const deliveryPincode = String(body.deliveryPincode || "").trim();
    const cod = body.cod ? 1 : 0;
    const weight = Number(body.weight ?? 0.5);
    const length = Number(body.length ?? 30);
    const breadth = Number(body.breadth ?? 25);
    const height = Number(body.height ?? 5);
    const declaredValue = Number(body.declaredValue ?? 0);

    if (!/^\d{6}$/.test(deliveryPincode)) {
      return NextResponse.json({ error: "Please enter a valid 6-digit delivery pincode." }, { status: 400 });
    }

    if (!Number.isFinite(weight) || weight <= 0 || !Number.isFinite(declaredValue) || declaredValue < 0) {
      return NextResponse.json({ error: "Invalid shipment details." }, { status: 400 });
    }

    const email = process.env.SHIPROCKET_EMAIL;
    const password = process.env.SHIPROCKET_PASSWORD;
    const pickupPincode = process.env.SHIPROCKET_PICKUP_PINCODE || "380058";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Shiprocket is not configured yet. Add SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD in Render." },
        { status: 503 }
      );
    }

    const authResponse = await fetch(`${SHIPROCKET_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store"
    });

    const authData = await authResponse.json();
    if (!authResponse.ok || !authData.token) {
      return NextResponse.json({ error: "Shiprocket authentication failed. Check the API user credentials in Render." }, { status: 502 });
    }

    const params = new URLSearchParams({
      pickup_postcode: pickupPincode,
      delivery_postcode: deliveryPincode,
      cod: String(cod),
      weight: String(weight),
      length: String(length),
      breadth: String(breadth),
      height: String(height),
      declared_value: String(Math.round(declaredValue))
    });

    const serviceResponse = await fetch(`${SHIPROCKET_BASE}/courier/serviceability/?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authData.token}`
      },
      cache: "no-store"
    });

    const serviceData = await serviceResponse.json();
    if (!serviceResponse.ok) {
      return NextResponse.json({ error: "Shiprocket could not check courier serviceability for this pincode." }, { status: 502 });
    }

    const couriers: Courier[] = serviceData?.data?.available_courier_companies || [];
    const validCouriers = couriers
      .filter((courier) => Number.isFinite(Number(courier.rate)))
      .sort((a, b) => Number(a.rate) - Number(b.rate));

    if (!validCouriers.length) {
      return NextResponse.json({ error: "No Shiprocket courier is currently available for this pincode." }, { status: 404 });
    }

    const best = validCouriers[0];
    return NextResponse.json({
      success: true,
      shippingCharge: Number(best.rate),
      courierName: best.courier_name || "Shiprocket Courier",
      etd: best.etd || (best.estimated_delivery_days ? `${best.estimated_delivery_days} days` : ""),
      couriers: validCouriers.slice(0, 5).map((courier) => ({
        name: courier.courier_name,
        rate: Number(courier.rate),
        etd: courier.etd || courier.estimated_delivery_days || ""
      }))
    });
  } catch {
    return NextResponse.json({ error: "Unable to connect to Shiprocket right now. Please try again." }, { status: 500 });
  }
}
