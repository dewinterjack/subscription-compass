import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { client } from "@/server/plaid";
import { type CountryCode } from "plaid";

export const serviceRouter = createTRPCRouter({
  getPlaidItems: protectedProcedure
  .query(async ({ ctx }) => {
    const plaidItems = await ctx.db.plaidItem.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        institutionName: true,
        institutionId: true,
      },
    });
    return plaidItems;
  }),
  exchangePublicToken: protectedProcedure
    .input(z.object({ publicToken: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const response = await client.itemPublicTokenExchange({
          public_token: input.publicToken,
        });

        const accessToken = response.data.access_token;
        const itemID = response.data.item_id;

        const itemGetResponse = await client.itemGet({
          access_token: accessToken,
        });

        const institutionId = itemGetResponse.data.item.institution_id;

        let institutionName = null;
        if (institutionId) {
          const institutionResponse = await client.institutionsGetById({
            institution_id: institutionId,
            country_codes: ['GB'] as CountryCode[],
          });
          institutionName = institutionResponse.data.institution.name;
        }

        await ctx.db.plaidItem.create({
          data: {
            userId: ctx.session?.user?.id,
            accessToken: accessToken,
            itemId: itemID,
            institutionId: institutionId,
            institutionName: institutionName,
          },
        });

        return { public_token_exchange: 'complete' };
      } catch (error) {
        console.error('Error exchanging public token:', error);
        throw new Error('Failed to exchange public token');
      }
    }),
});