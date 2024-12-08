import { logger, schedules } from "@trigger.dev/sdk/v3";
import { db } from "@/server/db";
import { addMonths, startOfMonth, endOfMonth } from "date-fns";

// Define the scheduled task
export const checkExpiringCardsTask = schedules.task({
  id: "check-expiring-cards",
  maxDuration: 300,
  cron: "0 0 15 * *", // At 00:00 on day-of-month 15
  run: async () => {
    // Calculate next month's date range
    const nextMonth = addMonths(new Date(), 1);
    const startDate = startOfMonth(nextMonth);
    const endDate = endOfMonth(nextMonth);

    // Find all payment methods expiring next month
    const expiringCards = await db.paymentMethod.findMany({
      where: {
        expiresAt: {
          gte: startDate,
          lte: endDate,
        },
        type: "card",
      },
      include: {
        user: true,
      },
    });

    logger.log("Found expiring cards", { 
      count: expiringCards.length,
      month: nextMonth.toLocaleString('default', { month: 'long' }),
      year: nextMonth.getFullYear(),
    });

    return {
      expiringCards: expiringCards.map(card => ({
        id: card.id,
        number: card.number,
        expiresAt: card.expiresAt,
        userEmail: card.user.email,
      })),
      totalCount: expiringCards.length,
    };
  },
});
