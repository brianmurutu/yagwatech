import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().max(30).optional().or(z.literal("")),
  subject: z.string().min(2, "Please enter a subject").max(150),
  message: z.string().min(10, "Message should be at least 10 characters").max(3000),
});

export const quoteSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().max(30).optional().or(z.literal("")),
  company: z.string().max(150).optional().or(z.literal("")),
  service: z.string().min(2, "Please select a service"),
  budget: z.string().optional().or(z.literal("")),
  timeline: z.string().optional().or(z.literal("")),
  details: z.string().min(10, "Please share a few details about the project").max(3000),
});

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
