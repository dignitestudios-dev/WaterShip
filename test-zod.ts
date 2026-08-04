import { z } from "zod";

const schema = z.object({
  a: z.string().min(1),
});

const result = schema.safeParse({ a: "" });
console.log(result.success);
