import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
export const runtime="nodejs";
export async function POST(req){
 if(!process.env.STRIPE_SECRET_KEY||!process.env.STRIPE_WEBHOOK_SECRET||!process.env.SUPABASE_SERVICE_ROLE_KEY)return NextResponse.json({error:"Billing env fehlt"},{status:500});
 const stripe=new Stripe(process.env.STRIPE_SECRET_KEY); const body=await req.text(); const sig=req.headers.get("stripe-signature"); let event;
 try{event=stripe.webhooks.constructEvent(body,sig,process.env.STRIPE_WEBHOOK_SECRET)}catch(e){return NextResponse.json({error:`Webhook ungültig: ${e.message}`},{status:400});}
 const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
 if(event.type==="checkout.session.completed"){const s=event.data.object;const userId=s.metadata?.user_id;const plan=s.metadata?.plan;const credits={creator:20,pro:60,unlimited:999999}[plan]||2;if(userId)await db.from("profiles").update({plan,credits,stripe_customer_id:s.customer,stripe_subscription_id:s.subscription,billing_period_start:new Date().toISOString()}).eq("id",userId);}
 if(event.type==="invoice.paid"){const inv=event.data.object;const sub=inv.subscription;if(sub){const subscription=await stripe.subscriptions.retrieve(sub);const customer=subscription.customer;const {data:p}=await db.from("profiles").select("id,plan").eq("stripe_customer_id",customer).single();if(p){const credits={creator:20,pro:60,unlimited:999999}[p.plan]||2;await db.from("profiles").update({credits,billing_period_start:new Date().toISOString(),stripe_subscription_id:subscription.id}).eq("id",p.id);}}}
 if(event.type==="customer.subscription.deleted"){const s=event.data.object;await db.from("profiles").update({plan:"free",credits:2,stripe_subscription_id:null}).eq("stripe_customer_id",s.customer);}
 return NextResponse.json({received:true});
}
