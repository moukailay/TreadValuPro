import { nanoid } from "nanoid";
import { eq, sql, desc } from "drizzle-orm";
import { db } from "./db";
import {
  companies,
  proposals,
  calculations,
  users,
  type Company,
  type InsertCompany,
  type Proposal,
  type InsertProposal,
  type Calculation,
  type InsertCalculation,
  type User,
  type UpsertUser,
  type ROICalculationInput
} from "@shared/schema";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Company operations
  getCompany(id: string): Promise<Company | undefined>;
  getCompanies(): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;
  
  // Proposal operations
  getProposal(id: string): Promise<Proposal | undefined>;
  getProposals(): Promise<Proposal[]>;
  getProposalsByCompany(companyId: string): Promise<Proposal[]>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal>;
  
  // Calculation operations
  getCalculation(id: string): Promise<Calculation | undefined>;
  getCalculationsByProposal(proposalId: string): Promise<Calculation[]>;
  createCalculation(calculation: InsertCalculation): Promise<Calculation>;
  
  // Stats operations
  getStats(): Promise<{
    proposalsThisMonth: number;
    conversionRate: number;
    averageROI: number;
    co2Saved: number;
  }>;
  
  getRecentActivity(): Promise<Array<{
    id: string;
    type: string;
    description: string;
    timestamp: Date;
    companyName?: string;
  }>>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Ensure sample data exists in database
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    try {
      // Check if sample data already exists
      const existingCompanies = await db.select().from(companies).limit(1);
      if (existingCompanies.length > 0) {
        return; // Sample data already exists
      }

      // Insert sample companies - Quebec transporters
      const sampleCompanies = [
        {
          id: "1",
          name: "Transport Bourassa",
          email: "info@transport-bourassa.ca",
          contactPerson: "Jean-Pierre Bourassa",
          phone: "(514) 234-5678",
          address: "1250 Rue Sainte-Catherine Est, Montréal, QC H2L 2H5",
        },
        {
          id: "2",
          name: "Camion Lussier",
          email: "service@camion-lussier.qc.ca",
          contactPerson: "Marie-Claire Lussier",
          phone: "(514) 567-8901",
          address: "3456 Boulevard Saint-Laurent, Montréal, QC H2X 2T6",
        },
        {
          id: "3",
          name: "Transport Moran",
          email: "admin@moran-transport.ca",
          contactPerson: "François Moran",
          phone: "(514) 890-1234",
          address: "5678 Avenue Papineau, Montréal, QC H2H 1V4",
        },
        {
          id: "4",
          name: "London Fountain Transport",
          email: "contact@londonfountain.qc.ca",
          contactPerson: "Robert London",
          phone: "(514) 345-6789",
          address: "2100 Rue Notre-Dame Ouest, Montréal, QC H3J 0C6",
        },
        {
          id: "5",
          name: "Transport Belisle",
          email: "info@belisle-transport.ca",
          contactPerson: "Sylvie Belisle",
          phone: "(514) 678-9012",
          address: "4321 Boulevard Pie-IX, Montréal, QC H1X 2B3",
        },
      ];

      await db.insert(companies).values(sampleCompanies);

      // Insert sample proposals
      const sampleProposals = [
        {
          id: "p1",
          companyId: "1",
          fleetSize: 87,
          annualKilometers: 120000,
          vehicleType: "heavy_truck",
          fuelPrice: "1.55",
          calculatedROI: "312.00",
          annualSavings: "156800.00",
          fiveYearSavings: "784000.00",
          co2Reduction: "198.50",
          costPerKm: "0.162",
          paybackPeriod: 15,
          status: "accepted",
          pdfGenerated: true,
        },
        {
          id: "p2",
          companyId: "2",
          fleetSize: 134,
          annualKilometers: 150000,
          vehicleType: "heavy_truck",
          fuelPrice: "1.52",
          calculatedROI: "298.00",
          annualSavings: "287400.00",
          fiveYearSavings: "1437000.00",
          co2Reduction: "312.40",
          costPerKm: "0.158",
          paybackPeriod: 16,
          status: "under_review",
          pdfGenerated: true,
        },
        {
          id: "p3",
          companyId: "3",
          fleetSize: 42,
          annualKilometers: 80000,
          vehicleType: "medium_truck",
          fuelPrice: "1.58",
          calculatedROI: "276.00",
          annualSavings: "89200.00",
          fiveYearSavings: "446000.00",
          co2Reduction: "95.30",
          costPerKm: "0.165",
          paybackPeriod: 18,
          status: "sent",
          pdfGenerated: true,
        },
      ];

      await db.insert(proposals).values(sampleProposals);
    } catch (error) {
      console.error("Error initializing sample data:", error);
    }
  }

  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Company operations
  async getCompany(id: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
  }

  async getCompanies(): Promise<Company[]> {
    return await db.select().from(companies);
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const [company] = await db
      .insert(companies)
      .values({
        ...insertCompany,
        id: nanoid(),
      })
      .returning();
    return company;
  }

  // Proposal operations
  async getProposal(id: string): Promise<Proposal | undefined> {
    const [proposal] = await db.select().from(proposals).where(eq(proposals.id, id));
    return proposal;
  }

  async getProposals(): Promise<Proposal[]> {
    return await db.select().from(proposals).orderBy(desc(proposals.createdAt));
  }

  async getProposalsByCompany(companyId: string): Promise<Proposal[]> {
    return await db
      .select()
      .from(proposals)
      .where(eq(proposals.companyId, companyId))
      .orderBy(desc(proposals.createdAt));
  }

  async createProposal(insertProposal: InsertProposal): Promise<Proposal> {
    const [proposal] = await db
      .insert(proposals)
      .values({
        ...insertProposal,
        id: nanoid(),
      })
      .returning();
    return proposal;
  }

  async updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal> {
    const [proposal] = await db
      .update(proposals)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(proposals.id, id))
      .returning();
    
    if (!proposal) {
      throw new Error("Proposal not found");
    }
    return proposal;
  }

  // Calculation operations
  async getCalculation(id: string): Promise<Calculation | undefined> {
    const [calculation] = await db.select().from(calculations).where(eq(calculations.id, id));
    return calculation;
  }

  async getCalculationsByProposal(proposalId: string): Promise<Calculation[]> {
    return await db
      .select()
      .from(calculations)
      .where(eq(calculations.proposalId, proposalId));
  }

  async createCalculation(insertCalculation: InsertCalculation): Promise<Calculation> {
    const [calculation] = await db
      .insert(calculations)
      .values({
        ...insertCalculation,
        id: nanoid(),
      })
      .returning();
    return calculation;
  }

  // Stats operations
  async getStats(): Promise<{
    proposalsThisMonth: number;
    conversionRate: number;
    averageROI: number;
    co2Saved: number;
  }> {
    const allProposals = await db.select().from(proposals);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const proposalsThisMonth = allProposals.filter(p => {
      const proposalDate = new Date(p.createdAt!);
      return proposalDate.getMonth() === currentMonth && proposalDate.getFullYear() === currentYear;
    }).length;

    const acceptedProposals = allProposals.filter(p => p.status === "accepted").length;
    const conversionRate = allProposals.length > 0 ? Math.round((acceptedProposals / allProposals.length) * 100) : 0;

    const totalROI = allProposals.reduce((sum, p) => sum + (parseFloat(p.calculatedROI || "0")), 0);
    const averageROI = allProposals.length > 0 ? Math.round(totalROI / allProposals.length) : 0;

    const totalCO2 = allProposals.reduce((sum, p) => sum + (parseFloat(p.co2Reduction || "0")), 0);
    const co2Saved = Math.round(totalCO2 * 10); // Scale up for yearly estimate

    return {
      proposalsThisMonth,
      conversionRate,
      averageROI,
      co2Saved,
    };
  }

  async getRecentActivity(): Promise<Array<{
    id: string;
    type: string;
    description: string;
    timestamp: Date;
    companyName?: string;
  }>> {
    const activities = [];
    const recentProposals = await db
      .select()
      .from(proposals)
      .orderBy(desc(proposals.createdAt))
      .limit(3);

    for (const proposal of recentProposals) {
      const company = await this.getCompany(proposal.companyId);
      if (proposal.status === "accepted") {
        activities.push({
          id: nanoid(),
          type: "proposal_accepted",
          description: `Proposition acceptée par ${company?.name}`,
          timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Random time in last 24h
          companyName: company?.name,
        });
      } else if (proposal.status === "sent") {
        activities.push({
          id: nanoid(),
          type: "proposal_sent",
          description: `Proposition envoyée à ${company?.name}`,
          timestamp: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000), // Random time in last 48h
          companyName: company?.name,
        });
      } else {
        activities.push({
          id: nanoid(),
          type: "calculation_created",
          description: `Nouveau calcul ROI pour ${company?.name}`,
          timestamp: new Date(Date.now() - Math.random() * 72 * 60 * 60 * 1000), // Random time in last 72h
          companyName: company?.name,
        });
      }
    }

    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

export const storage = new DatabaseStorage();
