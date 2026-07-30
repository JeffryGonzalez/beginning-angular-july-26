import { z } from 'zod';

export interface Band {
  id: string;
  name: string;
  albums: string[];
}

export const BandSchema: z.ZodType<Band> = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    albums: z.array(z.string()),
  })
  .strict();

export const BandsResponseSchema = z.array(BandSchema);

export const parseBandsResponse = (input: unknown): Band[] => BandsResponseSchema.parse(input);

export const safeParseBandsResponse = (input: unknown) => BandsResponseSchema.safeParse(input);
