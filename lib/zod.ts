import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().trim().email("Invalid email format"),
  
});
