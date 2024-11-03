import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { client } from "@/server/plaid";
import { type CountryCode, RecurringTransactionFrequency } from "plaid";
import type { Database } from "@/server/db";
import type { BillingCycle } from "@prisma/client";

async function getPlaidAccessToken(userId: string, db: Database) {
  const plaidItem = await db.plaidItem.findFirst({
    where: {
      userId: userId,
    },
  });
  const accessToken = plaidItem?.accessToken;
  if (!accessToken) {
    throw new Error("No access token found");
  }
  return { accessToken, itemId: plaidItem?.id };
}

function mapPlaidFrequencyToBillingCycle(frequency: RecurringTransactionFrequency): BillingCycle {
  switch (frequency) {
    case RecurringTransactionFrequency.Weekly:
      return 'Weekly';
    case RecurringTransactionFrequency.Biweekly:
      return 'Biweekly';
    case RecurringTransactionFrequency.SemiMonthly:
      return 'Unknown';
    case RecurringTransactionFrequency.Monthly:
      return 'Monthly';
    case RecurringTransactionFrequency.Annually:
      return 'Yearly';
    case RecurringTransactionFrequency.Unknown:
    default:
      return 'Unknown';
  }
}

export const serviceRouter = createTRPCRouter({
  getPlaidItems: protectedProcedure
  .query(async ({ ctx }) => {
    const plaidItems = await ctx.db.plaidItem.findMany({
      where: {
        userId: ctx.user?.id,
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
            userId: ctx.user?.id,
            accessToken: accessToken,
            id: itemID,
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
    getRecurringTransactions: protectedProcedure
    .query(async ({ ctx }) => {
      const { accessToken } = await getPlaidAccessToken(ctx.user?.id, ctx.db);
      
      const existingSubscriptions = await ctx.db.subscription.findMany({
        where: { createdById: ctx.user?.id },
        select: { plaidStreamId: true }
      });
      const existingStreamIds = new Set(existingSubscriptions.map(sub => sub.plaidStreamId));
      
      const recurringTransactions = await client.transactionsRecurringGet({
        access_token: accessToken,
      });
      
      return recurringTransactions.data.outflow_streams.filter(
        stream => !existingStreamIds.has(stream.stream_id)
      );
    }),
  importTransactions: protectedProcedure
    .input(z.object({ streamIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { accessToken, itemId } = await getPlaidAccessToken(ctx.user?.id, ctx.db);

      const recurringTransactions = await client.transactionsRecurringGet({
        access_token: accessToken,
      });
      const transactionsToImport = recurringTransactions.data.outflow_streams.filter((stream) => 
        input.streamIds.includes(stream.stream_id)
      );
      return await ctx.db.subscription.createMany({
        data: transactionsToImport.map((stream) => ({
          name: stream.merchant_name!, 
          cost: stream.average_amount.amount!,
          billingCycle: mapPlaidFrequencyToBillingCycle(stream.frequency),
          firstDate: stream.first_date,
          lastDate: stream.last_date,
          isActive: true,
          // library needs updating?
          plaidPredictedNextDate: stream.predicted_next_date,
          plaidItemId: itemId,
          plaidAccountId: stream.account_id,
          plaidStreamId: stream.stream_id,
          plaidMetadata: JSON.stringify(stream),
          createdById: ctx.user?.id,
        })),
      });
    }),
});
