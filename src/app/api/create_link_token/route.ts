import { client } from "@/server/plaid";
import { NextResponse } from "next/server";
import type { Products, CountryCode } from "plaid";

export async function POST(req: Request) {
  const { userId } = await req.json() as { userId: string };
    try {
      const request = {
        user: {
          client_user_id: userId,
        },
        client_name: 'SubsCompass',
        products: ['transactions'] as Products[],
        language: 'en',
        webhook: 'https://webhook.example.com',
        country_codes: ['GB'] as CountryCode[],
      };
  
      const createTokenResponse = await client.linkTokenCreate(request);
      return NextResponse.json(createTokenResponse.data);
    } catch (error) {
      console.error('Error creating link token:', error);
      return NextResponse.json({ error: 'Failed to create link token' }, { status: 500 });
    }
  }