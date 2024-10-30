import { pgTable, serial, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const jsonForms = pgTable("jsonForms", {
  id: serial("id").primaryKey(),
  jsonform: text("jsonform").notNull(),
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt").notNull(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  formId: integer("form_id").notNull().references(() => jsonForms.id),
  submissionData: text("submission_data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});