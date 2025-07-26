import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCompanySchema, 
  insertProposalSchema, 
  roiCalculationSchema,
  type ROICalculationInput 
} from "@shared/schema";
import { z } from "zod";

// ROI Calculation Engine
function calculateROI(input: ROICalculationInput) {
  const { fleetSize, annualKilometers, vehicleType, fuelPrice } = input;

  // Base costs and savings (simplified calculation)
  const vehicleMultipliers = {
    heavy_truck: { baseCost: 450, savings: 0.35, co2Factor: 2.8 },
    medium_truck: { baseCost: 320, savings: 0.32, co2Factor: 2.2 },
    light_utility: { baseCost: 180, savings: 0.28, co2Factor: 1.6 },
    bus: { baseCost: 520, savings: 0.38, co2Factor: 3.2 },
  };

  const multiplier = vehicleMultipliers[vehicleType];
  
  // Annual calculations
  const totalAnnualKm = fleetSize * annualKilometers;
  const retreatingCostPerTire = multiplier.baseCost;
  const tiresPerVehiclePerYear = 4; // Average tire replacement per vehicle per year
  const totalTiresPerYear = fleetSize * tiresPerVehiclePerYear;
  
  // Cost savings from retreading vs new tires
  const newTireCost = retreatingCostPerTire / multiplier.savings;
  const retreatingCost = retreatingCostPerTire;
  const savingsPerTire = newTireCost - retreatingCost;
  const annualSavings = totalTiresPerYear * savingsPerTire;
  
  // 5-year projections
  const fiveYearSavings = annualSavings * 5;
  
  // Environmental impact
  const co2ReductionPerTire = multiplier.co2Factor; // kg CO2 per tire
  const annualCO2Reduction = totalTiresPerYear * co2ReductionPerTire / 1000; // Convert to tonnes
  
  // ROI calculation
  const initialInvestment = fleetSize * 1500; // Estimated initial setup cost per vehicle
  const roi = ((fiveYearSavings - initialInvestment) / initialInvestment) * 100;
  
  // Cost per kilometer
  const costPerKm = retreatingCost / (annualKilometers * 0.8); // Assuming 80% tire efficiency
  
  // Payback period in months
  const paybackPeriod = Math.ceil((initialInvestment / annualSavings) * 12);

  return {
    annualSavings: Math.round(annualSavings),
    fiveYearSavings: Math.round(fiveYearSavings),
    co2Reduction: parseFloat(annualCO2Reduction.toFixed(2)),
    roi: parseFloat(roi.toFixed(2)),
    costPerKm: parseFloat(costPerKm.toFixed(3)),
    paybackPeriod: Math.min(paybackPeriod, 60), // Cap at 5 years
    savingsBreakdown: {
      year1: Math.round(annualSavings),
      year2: Math.round(annualSavings * 2),
      year3: Math.round(annualSavings * 3),
      year4: Math.round(annualSavings * 4),
      year5: Math.round(annualSavings * 5),
    }
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Stats endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Recent activity endpoint
  app.get("/api/activity", async (req, res) => {
    try {
      const activity = await storage.getRecentActivity();
      res.json(activity);
    } catch (error) {
      console.error("Error fetching activity:", error);
      res.status(500).json({ message: "Failed to fetch activity" });
    }
  });

  // ROI calculation endpoint
  app.post("/api/calculate-roi", async (req, res) => {
    try {
      const input = roiCalculationSchema.parse(req.body);
      const calculation = calculateROI(input);
      res.json(calculation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid input data", 
          errors: error.errors 
        });
      } else {
        console.error("Error calculating ROI:", error);
        res.status(500).json({ message: "Failed to calculate ROI" });
      }
    }
  });

  // Companies endpoints
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  app.post("/api/companies", async (req, res) => {
    try {
      const companyData = insertCompanySchema.parse(req.body);
      const company = await storage.createCompany(companyData);
      res.status(201).json(company);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid company data", 
          errors: error.errors 
        });
      } else {
        console.error("Error creating company:", error);
        res.status(500).json({ message: "Failed to create company" });
      }
    }
  });

  // Proposals endpoints
  app.get("/api/proposals", async (req, res) => {
    try {
      const proposals = await storage.getProposals();
      const proposalsWithCompanies = await Promise.all(
        proposals.map(async (proposal) => {
          const company = await storage.getCompany(proposal.companyId);
          return { ...proposal, company };
        })
      );
      res.json(proposalsWithCompanies);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });

  app.post("/api/proposals", async (req, res) => {
    try {
      const proposalData = insertProposalSchema.parse(req.body);
      const proposal = await storage.createProposal(proposalData);
      res.status(201).json(proposal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid proposal data", 
          errors: error.errors 
        });
      } else {
        console.error("Error creating proposal:", error);
        res.status(500).json({ message: "Failed to create proposal" });
      }
    }
  });

  // Proposal by ID
  app.get("/api/proposals/:id", async (req, res) => {
    try {
      const proposal = await storage.getProposal(req.params.id);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      const company = await storage.getCompany(proposal.companyId);
      res.json({ ...proposal, company });
    } catch (error) {
      console.error("Error fetching proposal:", error);
      res.status(500).json({ message: "Failed to fetch proposal" });
    }
  });

  // Update proposal status
  app.patch("/api/proposals/:id", async (req, res) => {
    try {
      const updates = req.body;
      const proposal = await storage.updateProposal(req.params.id, updates);
      res.json(proposal);
    } catch (error) {
      console.error("Error updating proposal:", error);
      res.status(500).json({ message: "Failed to update proposal" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
