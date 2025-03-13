import { class_type_enum } from "@prisma/client";
import { z } from "zod";

export const crateClassesSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().min(5, "Description must be at least 5 characters long"),
    instructor: z.string({ required_error: "Instructor is required" }),
    latitude: z.number().min(-90, "Latitude must be between -90 and 90").max(90),
    longitude: z.number().min(-180, "Longitude must be between -180 and 180").max(180),
    startTime: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format for startTime",
    }),
    endTime: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format for endTime",
    }),
    coverImage: z.string().optional(), // TODO: Make required if necessary
    type: z.nativeEnum(class_type_enum).refine(
      (val) => Object.values(class_type_enum).includes(val),
      (val) => ({
        message: `Invalid class type: '${val}', expected one of [${Object.values(class_type_enum).join(", ")}]`,
      })
    ),
    price: z.number().min(0, "Price must be a positive number"),
    duration: z.number().min(1, "Duration must be at least 1 minute"),
    capacity: z.number().min(1, "Capacity must be at least 1 person"),
    available: z.boolean().default(true),
    bookedUsers: z.array(z.string()).default([]),
  }),
});

export const classesValidations = {
  crateClassesSchema,
};
