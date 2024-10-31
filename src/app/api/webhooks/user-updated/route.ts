import { Webhook } from "svix";
import type { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.USER_UPDATED_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  throw new Error(
    "Please add USER_UPDATED_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
  );
}

const svix_id = req.headers.get("svix-id")!;
const svix_timestamp = req.headers.get("svix-timestamp")!;
const svix_signature = req.headers.get("svix-signature")!;

if (!svix_id || !svix_timestamp || !svix_signature) {
  return NextResponse.json({ error: "Error occured -- no svix headers" }, { status: 400 });
}

const body = await req.text();

const wh = new Webhook(WEBHOOK_SECRET);

let evt: WebhookEvent;

try {
  evt = wh.verify(body, {
    "svix-id": svix_id,
    "svix-timestamp": svix_timestamp,
    "svix-signature": svix_signature,
  }) as WebhookEvent;
} catch (err) {
  console.error("Error verifying webhook:", err);
  return NextResponse.json({ Error: err }, { status: 400 });
}
  
    try {
        const {
            id,
            email_addresses,
            first_name,
            last_name,
            primary_email_address_id,
            image_url,
          } = evt.data as UserJSON;
        
          const email = email_addresses.find(
            (email) => email.id === primary_email_address_id,
          )?.email_address;
        
          await db.user.upsert({
            where: {
              clerkId: id,
            },
            update: {
              email: email,
              firstName: first_name,
              lastName: last_name,
              image: image_url,
            },
            create: {
              clerkId: id,
              email: email,
              firstName: first_name,
              lastName: last_name,
              image: image_url,
            },
          });
        
      return NextResponse.json("Success", { status: 200 });
    } catch (error) {
      console.error('Error creating link token:', error);
      return NextResponse.json({ error: 'Failed to create link token' }, { status: 500 });
    }
  }