import { z } from "zod";
import { PlanEnum, subscription_status_enum } from "@prisma/client";

export const createSubscriptionSchema = z.object({
  body: z.object({
    subscriptedUsers: z.array(z.string()).default([]), // Array of user ObjectIds
    plan: z.nativeEnum(PlanEnum, {
      required_error: "Plan is required",
    }),
    price: z.number().min(0, "Price must be a positive number"),
    status: z.nativeEnum(subscription_status_enum).refine(
      (val) => Object.values(subscription_status_enum).includes(val),
      (val) => ({
        message: `Invalid status value: '${val}', expected one of [${Object.values(
          subscription_status_enum
        ).join(", ")}]`,
      })
    ),
    credit: z.number().min(1, "Credit must be at least 1"),
    duration: z.number().min(1, "Duration must be at least 1 day"),
  }),
});

export const subscriptionValidations = {
  createSubscriptionSchema,
};
