import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: varchar("email"),
  contactPerson: text("contact_person"),
  phone: varchar("phone"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const proposals = pgTable("proposals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => companies.id),
  fleetSize: integer("fleet_size").notNull(),
  annualKilometers: integer("annual_kilometers").notNull(),
  vehicleType: text("vehicle_type").notNull(),
  fuelPrice: decimal("fuel_price", { precision: 5, scale: 2 }).notNull(),
  calculatedROI: decimal("calculated_roi", { precision: 5, scale: 2 }),
  annualSavings: decimal("annual_savings", { precision: 10, scale: 2 }),
  fiveYearSavings: decimal("five_year_savings", { precision: 10, scale: 2 }),
  co2Reduction: decimal("co2_reduction", { precision: 8, scale: 2 }),
  costPerKm: decimal("cost_per_km", { precision: 5, scale: 3 }),
  paybackPeriod: integer("payback_period"), // in months
  status: text("status").notNull().default("draft"), // draft, sent, under_review, accepted, rejected
  pdfGenerated: boolean("pdf_generated").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const calculations = pgTable("calculations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  proposalId: varchar("proposal_id").notNull().references(() => proposals.id),
  calculationData: json("calculation_data").notNull(), // Store detailed calculation breakdown
  environmentalImpact: json("environmental_impact"), // CO2, oil savings, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const companiesRelations = relations(companies, ({ many }) => ({
  proposals: many(proposals),
}));

export const proposalsRelations = relations(proposals, ({ one, many }) => ({
  company: one(companies, {
    fields: [proposals.companyId],
    references: [companies.id],
  }),
  calculations: many(calculations),
}));

export const calculationsRelations = relations(calculations, ({ one }) => ({
  proposal: one(proposals, {
    fields: [calculations.proposalId],
    references: [proposals.id],
  }),
}));

// Insert schemas
export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProposalSchema = createInsertSchema(proposals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCalculationSchema = createInsertSchema(calculations).omit({
  id: true,
  createdAt: true,
});

// Types
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;

export type Proposal = typeof proposals.$inferSelect;
export type InsertProposal = z.infer<typeof insertProposalSchema>;

export type Calculation = typeof calculations.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;

// ROI Calculation input schema
export const roiCalculationSchema = z.object({
  fleetSize: z.number().min(1).max(10000),
  annualKilometers: z.number().min(1000).max(1000000),
  vehicleType: z.enum(["heavy_truck", "medium_truck", "light_utility", "bus"]),
  fuelPrice: z.number().min(0.5).max(5.0),
  companyId: z.string().optional(),
});

export type ROICalculationInput = z.infer<typeof roiCalculationSchema>;
