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

export const jobApplicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  jobTitle: z.string().min(1, "Job Title is required"),
  name: z.string().min(2, "Please enter your name").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(5, "Please enter your phone number").max(30),
  linkedin: z.string().url("Please enter a valid LinkedIn URL").or(z.literal("")),
  portfolio: z.string().url("Please enter a valid Portfolio/GitHub URL").or(z.literal("")),
  intro: z.string().min(20, "Please introduce yourself in at least 20 characters").max(3000),
});

export const partnerSchema = z.object({
  companyName: z.string().min(2, "Please enter your company/organization name").max(150),
  contactName: z.string().min(2, "Please enter contact person's name").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(5, "Please enter your phone number").max(30),
  website: z.string().max(150).optional().or(z.literal("")),
  partnershipType: z.string().min(2, "Please select a partnership category"),
  message: z.string().min(20, "Please provide a detailed partnership proposal (min 20 characters)").max(3000),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type JobApplicationInput = z.infer<typeof jobApplicationSchema>;
export type PartnerInput = z.infer<typeof partnerSchema>;
