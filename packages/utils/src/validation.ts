import { z } from "zod";

export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8).max(100);
export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
