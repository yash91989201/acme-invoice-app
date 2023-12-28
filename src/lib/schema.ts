import { z } from "zod";

const customerSchema = z.object({
  name: z.string().min(6, { message: "First name is required." }),
  email: z.string().email(),
  image: z.string().url(),
});

const customerIDSchema = z.object({
  id: z.string().uuid(),
});

export { customerSchema, customerIDSchema };
