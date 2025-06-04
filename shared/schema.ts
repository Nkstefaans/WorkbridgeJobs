import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  salary_min: integer("salary_min"),
  salary_max: integer("salary_max"),
  job_type: text("job_type").notNull(), // Full-time, Part-time, Contract, Remote
  skills: text("skills").array(),
  posted_date: timestamp("posted_date").defaultNow(),
  company_logo: text("company_logo"),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  job_id: integer("job_id").notNull(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  cover_letter: text("cover_letter"),
  resume_file: text("resume_file"),
  applied_date: timestamp("applied_date").defaultNow(),
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  posted_date: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  applied_date: true,
});

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;
