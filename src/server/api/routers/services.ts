import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { client } from "@/server/plaid";

export const serviceRouter = createTRPCRouter({
    exchangePublicToken: protectedProcedure
    .input(z.object({ publicToken: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const response = await client.itemPublicTokenExchange({
          public_token: input.publicToken,
        });

        const accessToken = response.data.access_token;
        const itemID = response.data.item_id;

        await ctx.db.plaidItem.create({
          data: {
            userId: ctx.session?.user?.id,
            accessToken: accessToken,
            itemId: itemID
          },
        });

        return { public_token_exchange: 'complete' };
      } catch (error) {
        console.error('Error exchanging public token:', error);
        throw new Error('Failed to exchange public token');
      }
    }),
});