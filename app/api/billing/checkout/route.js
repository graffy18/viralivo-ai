import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "../../../lib/supabase/server";

export async function POST(req) {
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({error:"STRIPE_SECRET_KEY fehlt"},{status:500});
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:"Nicht eingeloggt"},{status:401});
  const {plan}=await req.json();
  const prices={creator:process.env.STRIPE_PRICE_CREATOR,pro:process.env.STRIPE_PRICE_PRO,unlimited:process.env.STRIPE_PRICE_UNLIMITED};
  if(!prices[plan]) return NextResponse.json({error:"Ungültiger Plan"},{status:400});
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
  const {data:profile}=await supabase.from("profiles").select("stripe_customer_id").eq("id",user.id).single();
  const session=await stripe.checkout.sessions.create({mode:"subscription",customer:profile?.stripe_customer_id||undefined,customer_email:profile?.stripe_customer_id?undefined:user.email,line_items:[{price:prices[plan],quantity:1}],success_url:`${process.env.NEXT_PUBLIC_APP_URL||"http://localhost:3000"}/billing?success=1`,cancel_url:`${process.env.NEXT_PUBLIC_APP_URL||"http://localhost:3000"}/billing?canceled=1`,metadata:{user_id:user.id,plan}});
  return NextResponse.json({url:session.url});
}
