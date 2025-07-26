import { 
  companies, 
  proposals, 
  calculations,
  type Company, 
  type InsertCompany,
  type Proposal,
  type InsertProposal,
  type Calculation,
  type InsertCalculation,
  type ROICalculationInput
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
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

export class MemStorage implements IStorage {
  private companies: Map<string, Company> = new Map();
  private proposals: Map<string, Proposal> = new Map();
  private calculations: Map<string, Calculation> = new Map();

  constructor() {
    // Add some initial sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample companies
    const company1: Company = {
      id: "1",
      name: "Transport Leclerc",
      email: "contact@transport-leclerc.fr",
      contactPerson: "Michel Leclerc",
      phone: "+33 1 23 45 67 89",
      address: "123 Rue de la Logistique, 75001 Paris",
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-15"),
    };

    const company2: Company = {
      id: "2",
      name: "Logistics Plus",
      email: "info@logistics-plus.fr",
      contactPerson: "Sophie Martin",
      phone: "+33 1 98 76 54 32",
      address: "456 Avenue du Transport, 69000 Lyon",
      createdAt: new Date("2024-01-12"),
      updatedAt: new Date("2024-01-14"),
    };

    const company3: Company = {
      id: "3",
      name: "Fleet Services SA",
      email: "contact@fleet-services.fr",
      contactPerson: "Pierre Dubois",
      phone: "+33 1 11 22 33 44",
      address: "789 Boulevard de la Flotte, 13000 Marseille",
      createdAt: new Date("2024-01-11"),
      updatedAt: new Date("2024-01-13"),
    };

    this.companies.set("1", company1);
    this.companies.set("2", company2);
    this.companies.set("3", company3);

    // Sample proposals
    const proposal1: Proposal = {
      id: "p1",
      companyId: "1",
      fleetSize: 87,
      annualKilometers: 120000,
      vehicleType: "heavy_truck",
      fuelPrice: "1.45",
      calculatedROI: "312.00",
      annualSavings: "156800.00",
      fiveYearSavings: "784000.00",
      co2Reduction: "198.50",
      costPerKm: "0.162",
      paybackPeriod: 15,
      status: "accepted",
      pdfGenerated: true,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    };

    const proposal2: Proposal = {
      id: "p2",
      companyId: "2",
      fleetSize: 134,
      annualKilometers: 150000,
      vehicleType: "heavy_truck",
      fuelPrice: "1.42",
      calculatedROI: "298.00",
      annualSavings: "287400.00",
      fiveYearSavings: "1437000.00",
      co2Reduction: "312.40",
      costPerKm: "0.158",
      paybackPeriod: 16,
      status: "under_review",
      pdfGenerated: true,
      createdAt: new Date("2024-01-14"),
      updatedAt: new Date("2024-01-14"),
    };

    const proposal3: Proposal = {
      id: "p3",
      companyId: "3",
      fleetSize: 42,
      annualKilometers: 80000,
      vehicleType: "medium_truck",
      fuelPrice: "1.48",
      calculatedROI: "276.00",
      annualSavings: "89200.00",
      fiveYearSavings: "446000.00",
      co2Reduction: "95.30",
      costPerKm: "0.165",
      paybackPeriod: 18,
      status: "sent",
      pdfGenerated: true,
      createdAt: new Date("2024-01-13"),
      updatedAt: new Date("2024-01-13"),
    };

    this.proposals.set("p1", proposal1);
    this.proposals.set("p2", proposal2);
    this.proposals.set("p3", proposal3);
  }

  async getCompany(id: string): Promise<Company | undefined> {
    return this.companies.get(id);
  }

  async getCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = randomUUID();
    const company: Company = {
      ...insertCompany,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.companies.set(id, company);
    return company;
  }

  async getProposal(id: string): Promise<Proposal | undefined> {
    return this.proposals.get(id);
  }

  async getProposals(): Promise<Proposal[]> {
    return Array.from(this.proposals.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getProposalsByCompany(companyId: string): Promise<Proposal[]> {
    return Array.from(this.proposals.values())
      .filter(p => p.companyId === companyId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createProposal(insertProposal: InsertProposal): Promise<Proposal> {
    const id = randomUUID();
    const proposal: Proposal = {
      ...insertProposal,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.proposals.set(id, proposal);
    return proposal;
  }

  async updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal> {
    const existing = this.proposals.get(id);
    if (!existing) {
      throw new Error("Proposal not found");
    }
    const updated: Proposal = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.proposals.set(id, updated);
    return updated;
  }

  async getCalculation(id: string): Promise<Calculation | undefined> {
    return this.calculations.get(id);
  }

  async getCalculationsByProposal(proposalId: string): Promise<Calculation[]> {
    return Array.from(this.calculations.values()).filter(c => c.proposalId === proposalId);
  }

  async createCalculation(insertCalculation: InsertCalculation): Promise<Calculation> {
    const id = randomUUID();
    const calculation: Calculation = {
      ...insertCalculation,
      id,
      createdAt: new Date(),
    };
    this.calculations.set(id, calculation);
    return calculation;
  }

  async getStats(): Promise<{
    proposalsThisMonth: number;
    conversionRate: number;
    averageROI: number;
    co2Saved: number;
  }> {
    const proposals = Array.from(this.proposals.values());
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const proposalsThisMonth = proposals.filter(p => {
      const proposalDate = new Date(p.createdAt!);
      return proposalDate.getMonth() === currentMonth && proposalDate.getFullYear() === currentYear;
    }).length;

    const acceptedProposals = proposals.filter(p => p.status === "accepted").length;
    const conversionRate = proposals.length > 0 ? Math.round((acceptedProposals / proposals.length) * 100) : 0;

    const totalROI = proposals.reduce((sum, p) => sum + (parseFloat(p.calculatedROI || "0")), 0);
    const averageROI = proposals.length > 0 ? Math.round(totalROI / proposals.length) : 0;

    const totalCO2 = proposals.reduce((sum, p) => sum + (parseFloat(p.co2Reduction || "0")), 0);
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
    const proposals = Array.from(this.proposals.values()).slice(0, 3);

    for (const proposal of proposals) {
      const company = await this.getCompany(proposal.companyId);
      if (proposal.status === "accepted") {
        activities.push({
          id: randomUUID(),
          type: "proposal_accepted",
          description: `Proposition acceptée par ${company?.name}`,
          timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Random time in last 24h
          companyName: company?.name,
        });
      } else if (proposal.status === "sent") {
        activities.push({
          id: randomUUID(),
          type: "proposal_sent",
          description: `Proposition envoyée à ${company?.name}`,
          timestamp: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000), // Random time in last 48h
          companyName: company?.name,
        });
      } else {
        activities.push({
          id: randomUUID(),
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

export const storage = new MemStorage();
