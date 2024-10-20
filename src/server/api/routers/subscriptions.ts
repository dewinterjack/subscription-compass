import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const subscriptionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      service: z.union([
        z.object({ id: z.string() }),
        z.object({
          name: z.string().min(1),
          defaultCost: z.number().positive(),
          defaultBillingCycle: z.enum(["Weekly", "Monthly", "Yearly"]),
        }),
      ]),
      cost: z.number().positive(),
      billingCycle: z.enum(["Weekly", "Monthly", "Yearly"]),
    }))
    .mutation(async ({ ctx, input }) => {
      let serviceId: string;

      if ('id' in input.service) {
        serviceId = input.service.id;
      } else {
        const newService = await ctx.db.service.create({
          data: {
            name: input.service.name,
            defaultCost: input.service.defaultCost,
            defaultBillingCycle: input.service.defaultBillingCycle,
            isVerified: false,
            createdBy: { connect: { id: ctx.session.user.id } },
          },
        });
        serviceId = newService.id;
      }

      return ctx.db.subscription.create({
        data: {
          service: { connect: { id: serviceId } },
          cost: input.cost,
          billingCycle: input.billingCycle,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.subscription.findMany({
      where: { createdBy: { id: ctx.session.user.id } },
      include: { service: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      serviceId: z.string().optional(),
      cost: z.number().positive().optional(),
      billingCycle: z.enum(["Weekly", "Monthly", "Yearly"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subscription.update({
        where: { id: input.id },
        data: {
          service: input.serviceId ? { connect: { id: input.serviceId } } : undefined,
          cost: input.cost,
          billingCycle: input.billingCycle,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subscription.delete({
        where: { id: input.id },
      });
    }),
});
