import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { client } from "@/server/plaid";
import type { RemovedTransaction, Transaction, TransactionsSyncRequest, CountryCode } from "plaid";

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
  getTransactions: protectedProcedure
    .query(async ({ ctx }) => {
      // Provide a cursor from your database if you've previously
// received one for the Item. Leave null if this is your
// first sync call for this Item. The first request will
// return a cursor.
// let cursor = database.getLatestCursorOrNull(itemId);
  let cursor;
  const plaidItem = await ctx.db.plaidItem.findFirst({
    where: {
      userId: ctx.user?.id,
    },
  });
  const accessToken = plaidItem?.accessToken;
  if (!accessToken) {
    throw new Error("No access token found");
  }

  // New transaction updates since "cursor"
  let added: Array<Transaction> = [];
  let modified: Array<Transaction> = [];
  // Removed transaction ids
  let removed: Array<RemovedTransaction> = [];
  let hasMore = true;

  // Iterate through each page of new transaction updates for item
  while (hasMore) {
    const request: TransactionsSyncRequest = {
      access_token: accessToken,
      cursor: cursor,
    };
    const response = await client.transactionsSync(request);
    const data = response.data;

    // Add this page of results
    added = added.concat(data.added);
    modified = modified.concat(data.modified);
    removed = removed.concat(data.removed);

    hasMore = data.has_more;

    // Update cursor to the next cursor
    cursor = data.next_cursor;
  }

// Persist cursor and updated data
// database.applyUpdates(itemId, added, modified, removed, cursor);
  return { added, modified, removed, cursor };
    }),
    getRecurringTransactions: protectedProcedure
    .query(async ({ ctx }) => {
  const plaidItem = await ctx.db.plaidItem.findFirst({
    where: {
      userId: ctx.user?.id,
    },
  });
  const accessToken = plaidItem?.accessToken;
  if (!accessToken) {
    throw new Error("No access token found");
  }

  const recurringTransactions = await client.transactionsRecurringGet({
    access_token: accessToken,
  });
  return recurringTransactions.data.outflow_streams;
    }),
});
